/*
 Copyright IBM Corp. 2023
*/

import React, { useContext, useEffect, useState } from 'react';
import { Grid, Column, Tag } from '@carbon/react';
import { Checkmark } from '@carbon/icons-react';
import MonitoringDataTable from '../../components/MonitoringDataTable';
import InlineError from '../../components/InlineError';
import InlineWarning from '../../components/InlineWarning';
import ExternalLink from '../../components/ExternalLink';
import { FederatedSystemInformation, FederatedSystemName, FederatedSystemTypeIcon, federatedSystemIndexingStatus, federatedSystemRetrieversStatus } from '../federatedsystem';
import { RuntimedataContext } from '../../contexts/RuntimedataContextProvider';
import RuntimeDataError from './RuntimedataError';
import { collectPropertyValueOnObjectForContext, mergeCollectedValues, hasMultipleValuedProperties } from '../../utils/multi-valued-properties';

/**
 * This component displays a table of federated systems.
 * The data is provided by a RuntimedataContext that gather it from the /console/api/v1/cluster/runtimedata console REST API
 */
function FederatedSystemsTable() {
  console.log('FederatedSystemsTable rendering');

  const {runtimedata} = useContext(RuntimedataContext);
  const [rows, setRows] = useState(null);

  /**
   * Subcomponent that displays information about a federated system in the table rows
   * @param {object} system the federated system
   */
  function SystemInfo({system}) {
    if (system) {
      var systemLink = null;
      if (system.systemType && system.systemType !== "SYSTEM_TYPE_CASE") {
        systemLink = system.restUrlPrefix + "/v1/systems";
      } else {
        systemLink = system.restUrlPrefix + "/systems";
      }
      var configurationStatus = null;
      if (hasMultipleValuedProperties(system) || (system.database && hasMultipleValuedProperties(system.database))) {
        configurationStatus = <Tag type="red">Configuration issues</Tag>
      }
      return (<Grid className="systeminfo">
          <Column lg={16} className="systeminfo__r1">
            <span className="table-row-identifier"><FederatedSystemTypeIcon system={system} className="icon-with-text"/> <FederatedSystemName system={system}/></span>
          </Column>
          <Column lg={16} className="systeminfo__r2">
            <ExternalLink href={systemLink}>{system.restUrlPrefix}</ExternalLink>
          </Column>
          <Column lg={16} className="systeminfo__r3">
            {configurationStatus}
          </Column>
        </Grid>);
    }
  }

  /**
   * Subcomponent that displays the status of federated system retrievers in the table rows
   * @param {object} system the federated system
   */
  function RetrieversStatus({system}) {
      var retrieversStatus = federatedSystemRetrieversStatus(system, true);
      var result;
      switch (retrieversStatus.color) {
        case "red":
          result = <InlineError title={retrieversStatus.message}/>
          break;
        case "yellow":
          result = <InlineWarning title={retrieversStatus.message}/>
          break;
        default:
          result = <span><Checkmark className="icon-with-text status-ok-icon"/> {retrieversStatus.message}</span>;
      }
      return result;
  }

  /**
   * Subcomponent that displays the status of federated system indexers in the table rows
   * @param {object} system the federated system
   */
  function IndexersStatus({system}) {
    var indexersStatus = federatedSystemIndexingStatus(system, true);
    var result;
    switch (indexersStatus.color) {
      case "red":
        result = <InlineError title={indexersStatus.message}/>
        break;
      case "yellow":
        result = <InlineWarning title={indexersStatus.message}/>
        break;
      default:
        result = <span><Checkmark className="icon-with-text status-ok-icon"/> {indexersStatus.message}</span>;
      }
    return result;
  }

  /**
   * Calculate the rows state when runtimedata is updated
   */
  useEffect(function () {
  
    // Map of federated systems: the key is the REST URL prefix for the system,
    // the value is the federated system
    var federatedSystems = {};

    if (runtimedata && runtimedata.nodes) {
      // Clone runtimedata not to update anything for the process federated servers table
      var runtimedataClone = JSON.parse(JSON.stringify(runtimedata));
      // Process the data of each nodes and merge it in the federatedSystems map of federated systems
      runtimedataClone.nodes.forEach(function (node) {
        if (node.data && node.data.federatedSystems) {
          node.data.federatedSystems.forEach(function (system) {
            // use the restURL prefix as the key
            if (system.restUrlPrefix) {
              if (!federatedSystems[system.restUrlPrefix]) {
                federatedSystems[system.restUrlPrefix] = {
                  // _propertyValuesCollector will store the values of each system configuration property across the different PFS nodes.
                  // (see method collectPropertyValueOnObjectForContext for more information, the context here is the node endpoint)
                  _propertyValuesCollector: {},
                  database: {
                    // _propertyValuesCollector will store the values of each database configuration property across the different PFS nodes.
                    // (see method collectPropertyValueOnObjectForContext for more information, the context here is the node endpoint)
                    _propertyValuesCollector: {}
                  }
                };
              }
              // Merge data
              var existing = federatedSystems[system.restUrlPrefix];
              for (let prop in system) {
                switch (prop) {
                  case 'indexers':
                    // merge indexers list with the existing list of indexers
                    system[prop].forEach(function (indexer) {
                      // Add pfs endpoint information to the indexer
                      indexer._pfsEndpoint = node.endpoint;
                      if (!existing[prop]) {
                        existing[prop] = [];
                      }
                      existing[prop].push(indexer);
                    });
                    break;
                  case 'retrievers':
                      // merge retrievers list with the existing list of retrievers
                      system[prop].forEach(function (retriever) {
                        // Add pfs endpoint information to the retriever
                        retriever._pfsEndpoint = node.endpoint;
                        if (!existing[prop]) {
                          existing[prop] = [];
                        }
                        existing[prop].push(retriever);
                      });
                      break;
                  case 'database':
                    // Collect all the system database properties for this node
                    var database = system[prop];
                    if (database) {
                      for (let databaseProp in database) {
                        switch (databaseProp) {
                          case 'databaseName':
                            // falls through
                          case 'vendor':
                            // falls through
                          case 'serverName':
                            // falls through
                          case 'portNumber':
                            // falls through
                          case 'user':
                            collectPropertyValueOnObjectForContext(existing.database._propertyValuesCollector, database, node.endpoint, databaseProp);
                            break;
                          case 'metadata':
                            // Store metadata if defined, they will be removed later if there is a database configuration issue
                            var metadata = database[databaseProp];
                            if (metadata && metadata.productName) {
                              existing.database.metadata = metadata;
                            }
                            break;
                          default:
                            // Ignore any other property
                            break;
                        }
                      }
                    }
                    break;
                  case 'systemID':
                    // falls through
                  case 'version':
                    // falls through
                  case 'displayName':
                    // falls through
                    // Those are not configuration properties and they can be null
                    if (system[prop] != null) {
                      existing[prop] = system[prop];
                    }
                    break;
                  case 'systemType':
                    // falls through
                  case 'restUrlPrefix':
                    // falls through
                  case 'taskCompletionUrlPrefix':
                    // falls through
                  case 'indexName':
                    // falls through
                  case 'index.number_of_replicas':
                    // falls through
                  case 'index.number_of_shards':
                    // falls through
                  case 'indexProcessInstances':
                    // falls through
                  case 'index.refresh_interval':
                    // falls through
                  case 'indexRefreshIntervalForClients':
                    // falls through
                  case 'launchListPriority':
                    // falls through
                  case 'authenticationMechanism':
                    // Collect the values for these properties for the node: if any of these properties have a different value
                    // across the PFS nodes then there is a configuration issue
                    collectPropertyValueOnObjectForContext(existing._propertyValuesCollector, system, node.endpoint, prop);
                    break;
                  default:
                    // Ignore other properties
                    break;
                }
              }
            } else {
              // TODO: WHAT IF WE HAVE A SYSTEM WITH NO URL PREFIX INFORMATION ???
              // => THIS IS NOT POSSIBLE BY DESIGN (VERIFY THIS !!!)
            }
          })
        }
      });

      // Now that we have collected the values of each configuration properties of the different system, merge those
      for (let systemBaseUrl in federatedSystems) {
        var system = federatedSystems[systemBaseUrl];
        mergeCollectedValues(system._propertyValuesCollector, system);
        // Now remove the system collector, that is not needed anymore
        delete system._propertyValuesCollector;
        // Merge the collected database values
        mergeCollectedValues(system.database._propertyValuesCollector, system.database);
        // Now remove the database properties collector
        delete system.database._propertyValuesCollector;
        // If there are database configuration issues for this system, remove the metadata
        if (hasMultipleValuedProperties(system.database) && system.database.metadata) {
          delete system.database.metadata;
        }
        // Last, if there is no database information at all for this system then remove the database property
        if (Object.keys(system.database).length === 0) {
          delete system.database;
        }
      }
    }

    // Build the list of rows to display the federated systems
    const nextRows = [];
    for (let restUrlPrefix in federatedSystems) {
      // Default isExpanded value
      var isExpanded = false;
      if (rows) {
        var previousRowValue = rows.find(function (row) {
          return row.id === restUrlPrefix;
        });
        if (previousRowValue) {
          isExpanded = previousRowValue.isExpanded;
        }
      }
      var currentSystem = federatedSystems[restUrlPrefix];

      nextRows.push({
        id: restUrlPrefix,
        systemInfo: <SystemInfo system={currentSystem}/>,
        retrieversStatus: <RetrieversStatus system={currentSystem}/>,
        indexersStatus: <IndexersStatus system={currentSystem}/>,
        isExpanded: isExpanded,
        expandedContent: <FederatedSystemInformation system={currentSystem} includeSystemName={false}/>
      })
    };
    setRows(nextRows);
    // Disable check on exhaustive deps: useEffect is accessing rows state to get previous value before setting the new value
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runtimedata]);

  const headers = [
    {
      key: 'systemInfo',
      header: 'System',
    },
    {
      key: 'retrieversStatus',
      header: 'Retrievers Status',
    },
    {
      key: 'indexersStatus',
      header: 'Indexers Status',
    },
  ];

  /**
   * Toggle the expansion status of a row
   * @param {*} rowId the id of the row
   */
  function toggleExpansion(rowId) {
    setRows(rows.map(function (row) {
      return {
        id: row.id,
        systemInfo: row.systemInfo,
        retrieversStatus: row.retrieversStatus,
        indexersStatus: row.indexersStatus,
        isExpanded: (row.id === rowId) ? !row.isExpanded : row.isExpanded,
        expandedContent: row.expandedContent
      };
    }))
  }

  return (
    <div className="federated-systems-table">
    <MonitoringDataTable
      title="Federated Systems"
      description="Federated systems that are being monitored"
      headers={headers}
      rows={ (rows && rows.length) ? rows : []}
      expandHandler={toggleExpansion}
      emptyRowsPanel={(rows && rows.length) ? null : <RuntimeDataError data={runtimedata}></RuntimeDataError>}
    />
    </div>
  );
}

export default FederatedSystemsTable;
