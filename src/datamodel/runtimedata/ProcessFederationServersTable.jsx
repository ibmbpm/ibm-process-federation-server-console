/*
 Copyright IBM Corp. 2023
*/

import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  Grid,
  Column,
  ContainedList,
  ContainedListItem,
  Tag
} from '@carbon/react';
import {
  ViewFilled,
  ErrorFilled,
  WarningFilled,
} from '@carbon/icons-react';
import MonitoringDataTable from '../../components/MonitoringDataTable';
import InlineError from '../../components/InlineError';
import InlineWarning from '../../components/InlineWarning';
import ExternalLink from '../../components/ExternalLink';
import {
  FederatedSystemName,
  FederatedSystemTypeIcon,
  FederatedSystemInformation
} from '../federatedsystem';
import { federatedSystemIndexingStatus, federatedSystemRetrieversStatus } from "../federatedsystem";
import { RuntimedataContext } from '../../contexts/RuntimedataContextProvider';
import RuntimeDataError from './RuntimedataError';
import FederatedDataRepositoryProperties from '../federateddatarepository/FederatedDataRepositoryProperties';

/**
 * This component display a table of PFS servers.
 * The data is provided by a RuntimedataContext that gather it from the /console/api/v1/cluster/runtimedata console REST API
 */
function ProcessFederationServersTable() {
  console.log('ProcessFederationServersTable rendering');

  // use the RuntimedataContext context:
  // - runtimedata provides the data to display
  const {runtimedata} = useContext(RuntimedataContext);

  // Using a rows state to store the definitions of the rows to display in the monitoring table, with a ref
  // to be able to access its latest value in event handlers.
  // See https://medium.com/geographit/accessing-react-state-in-event-listeners-with-usestate-and-useref-hooks-8cceee73c559
  const [rows, _setRows] = useState(null);
  const rowsRef = useRef(rows);
  function setRows(data) {
    rowsRef.current = data;
    _setRows(data);
  }

  /**
   * Calculate the rows state when runtimedata is updated
   */
  useEffect(() => {
    /**
     * Handle the selection of a federated system in the "Federated Systems" column.
     * This function updates the rows state to expand the row on which the selected
     * federated system is displayed, refresh the content of the expanded row with
     * information about the selected system and updates the row persistent data
     * in the context
     * @param {*} rowId the id of the row on which a federated system has been selected
     * @param {*} system the federated system that has been selected
     */
    function handleSystemSelection(rowId, system) {
      console.log('Selected System:', system);
      // Expand the row and display information about the selected system in it, keep the other
      // rows as is.
      setRows(
        rowsRef.current.map(function(row) {
          return {
            id: row.id,
            endpoint: row.endpoint,
            status: row.status,
            federatedSystems: row.federatedSystems,
            links: row.links,
            error: row.error,
            expandedContent:
              row.id === rowId ? (
                <FederatedSystemInformation system={system} />
              ) : (
                row.expandedContent
              ),
            isExpanded: row.id === rowId ? true : row.isExpanded,
            selectedSystemDisplayId: row.id === rowId ? system["config.displayId"] : row.selectedSystemDisplayId,
            federatedDataRepository: row.federatedDataRepository,
          };
        })
      );
    }

    if (runtimedata && runtimedata.nodes && Array.isArray(runtimedata.nodes)) {
      setRows(
        // Create one row per node in runtimedata
        runtimedata.nodes.map(function(node) {
          var hasError = (node.status !== 200);
          var hasFederatedSystems = node.data && node.data.federatedSystems && node.data.federatedSystems.length;
          // default values for isExpanded and selectedSystemDisplayId
          var isExpanded = hasError; // Autoexpand if there is an error
          var selectedSystemDisplayId = hasFederatedSystems &&
                                 node.data.federatedSystems[0]["config.displayId"]; // select the first system by default
          // Check if there are previous data to use instead of the default values for iExpanded and selectedSystemDisplayId
          if (rows != null) {
            let previousRowValue = rows.find(function (row) {
              return row.id === node.endpoint;
            });
            if (previousRowValue) {
                // TODO: WHAT IF THE hasError STATUS CHANGED ? CAN WE RELY ON THE PREVIOUS isExplanded VALUE OR SHOULD WE CHANGE IT ? 
                isExpanded = previousRowValue.isExpanded;
                selectedSystemDisplayId = previousRowValue.selectedSystemDisplayId;
            }
          }
          // Retrieve the selected system for this node
          var selectedSystem = hasFederatedSystems &&
                               selectedSystemDisplayId &&
                               node.data.federatedSystems.find(system => system["config.displayId"] === selectedSystemDisplayId);
          if (!selectedSystem && hasFederatedSystems) {
            // the persisted selected system is not available anymore in the data, select the first one instead
            selectedSystem = node.data.federatedSystems[0];
            selectedSystemDisplayId = selectedSystem["config.displayId"];
          }
          // Return content for this row
          return {
            id: node.endpoint,
            endpoint: <Endpoint node={node}/>,
            federatedDataRepository: <FederatedDataRepositoryProperties federatedDataRepository={node.data && node.data.federatedDataRepository}/>,
            federatedSystems: (
              <FederatedSystemsList
                onSelection={handleSystemSelection}
                endpoint={node.endpoint}
                federatedSystems={node.data && node.data.federatedSystems}
                selectedSystemDisplayId = {selectedSystemDisplayId}
              />
            ),
            links: <LinkList server={node.endpoint} />,
            error: hasError,
            isExpanded: isExpanded,
            expandedContent: (
              <>
                {hasError ?
                <InlineError title={'Error HTTP ' + node.status} subtitle={node.statusMessage} />
                :
                selectedSystem ?
                <FederatedSystemInformation system={selectedSystem} />
                :
                <span className="detail-message">No federated system declared for this server.</span>
                }
              </>
            ),
            // Store the displayId of the selected system in the row so that we can retieve it when the runtimedata are updated
            selectedSystemDisplayId: selectedSystem ? selectedSystem["config.displayId"] : null,
          };
        })
      );
    } else {
      setRows(null);
    }
    // Disable check on exhaustive deps: useEffect is accessing rows state to get previous value before setting the new value
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runtimedata]);

  /**
   * Handle a click on the expand icon of a row to toggle the expansion of the
   * corresponding row
   * @param {*} rowId
   */
  function expandHandler(rowId) {
    setRows(
      rowsRef.current.map(function(row) {
        return {
          id: row.id,
          endpoint: row.endpoint,
          status: row.status,
          federatedSystems: row.federatedSystems,
          links: row.links,
          error: row.error,
          expandedContent: row.expandedContent,
          isExpanded: row.id === rowId ? !row.isExpanded : row.isExpanded,
          selectedSystemDisplayId: row.selectedSystemDisplayId,
          federatedDataRepository: row.federatedDataRepository,
        };
      })
    );
  }

  /**
   * Subcomponent that display the status of a PFS node
   * @param {object} node the PFS node from runtimedata 
   * @returns 
   */
  function EndpointStatus({node}) {
    if (node) {
      var tagType = "green";
      if (node.status !== 200) {
        tagType = "red";
      }
      return <Tag type={tagType}>Status: HTTP {node.status}</Tag>
    } else {
      return null;
    }
  }

  /**
   * Subcomponent that displays information about a PFS endpoint
   * @param {object} node the PFS node from runtimedata
   */
  function Endpoint({node}) {
    if (node) {
      return (
        <Grid className="endpoint">
          <Column lg={16} className="endpoint__r1">
            <span className="table-row-identifier">{node.endpoint}</span><br/>
          </Column>
          <Column lg={16} className="endpoint__r2">
            <LinkList server={node.endpoint} />
          </Column>
          <Column lg={16} className="endpoint__r3">
            <EndpointStatus node={node}/>
          </Column>
        </Grid>
      );
    }
  }

  /**
   * Subcomponent that displays a list of federated systems for a PFS server
   * @param {string} endpoint the endpoint of the PFS server
   * @param {object[]} federatedSystems an array of federated systems
   * @param {*} onSelection a function called with endpoint and system parameters when user select an entry in the list
   * @param {string} selectedSystemDisplayId the config.displayId property of the system initialy selected in the list
   */
  function FederatedSystemsList({ endpoint, federatedSystems, onSelection, selectedSystemDisplayId }) {

    const [selectedSystem, setSelectedSystem] = useState(selectedSystemDisplayId);

    const handleSection = function(endpoint, system) {
      setSelectedSystem(system["config.displayId"]);
      if (onSelection) {
        onSelection(endpoint, system);
      }
    };

    if (federatedSystems) {
      var lines = federatedSystems.map(function(system) {
        // Calculate the federated system status
        var status = "green";
        var statusIcon = null;
        var globalIndexerStatus = federatedSystemIndexingStatus(system, false);
        var retrieverStatus = federatedSystemRetrieversStatus(system, false);
        if (globalIndexerStatus.color === "red" || retrieverStatus.color === "red") {
          status = "red";
          statusIcon = <ErrorFilled className="icon-with-text status-icon"/>;
        } else if (globalIndexerStatus.color === "yellow" || retrieverStatus.color === "yellow") {
          status = "yellow";
          statusIcon = <WarningFilled className="icon-with-text status-icon"/>;
        }

        var className = "federated-system-list status-" + status;
        return (
          <ContainedListItem
            key={system["config.displayId"]}
            onClick={() => handleSection(endpoint, system)}
            className={className}
            >
            {statusIcon}<span className="selection-icon">
              {system["config.displayId"] === selectedSystem ? <ViewFilled className='selection-icon' /> : ''}
            </span><span className="federated-system-name"><FederatedSystemTypeIcon system={system} className="icon-with-text"/> <FederatedSystemName system={system} /></span>
            
          </ContainedListItem>
        );
      });
      return (
        <ContainedList label="federated systems" kind="on-page">
          {lines}
        </ContainedList>
      );
    } else {
      return <InlineWarning title="NO AVAILABLE INFORMATION" />;
    }
  }

  /**
   * Subcomponent that displays a list of links for a PFS server
   * @param {*} server the base URL for the server
   */
  function LinkList({ server }) {
    return (
      <ul>
        <li key="swagger-ui">
          <ExternalLink href={server + '/rest/bpm/federated/openapi'}>Swagger UI</ExternalLink>
        </li>
      </ul>
    );
  }

  // Headers for the MonitoringDataTable
  const headers = [
    {
      key: 'endpoint',
      header: 'Endpoint',
    },
    {
      key: 'federatedSystems',
      header: 'Federated Systems',
    },
    {
      key: 'federatedDataRepository',
      header: 'Federated Data Repository',
    },
  ];

  return (
    <div className="process-federation-servers-table">
      <MonitoringDataTable
        title="Process Federation Servers"
        description="Process Federation Server instances that are being monitored"
        headers={headers}
        rows={ (rows && rows.length) ? rows : []}
        expandHandler={expandHandler}
        emptyRowsPanel={(rows && rows.length) ? null : <RuntimeDataError data={runtimedata}></RuntimeDataError>}
      />
    </div>
    
  );
}

export default ProcessFederationServersTable;
