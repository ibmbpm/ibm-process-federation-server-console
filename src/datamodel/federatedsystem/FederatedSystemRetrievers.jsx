/*
 Copyright IBM Corp. 2023
*/

import React, { useState } from "react";
import {
  Modal} from '@carbon/react';
import { ArrowsHorizontal } from "@carbon/icons-react";
import PropertiesArray from "../../components/PropertiesArray";
import DateTime from "../../components/DateTime";
import InlineError from "../../components/InlineError";
import InlineWarning from "../../components/InlineWarning";
import { FederatedSystemModalHeading, FederatedSystemName, FederatedSystemTypeIcon } from '.';
import { RetrieverInformation, retrieverStatus } from "../retriever";
import RuntimedataContextAutoRefreshToggle from "../../contexts/RuntimedataContextAutoRefreshToggle";

/**
 * Function that calculates the retrievers status for a federated system. It returns an object with the following fields:
 * {
 *   color: green|yellow|red
 *   message: ["message that explains the status color"]
 * }
 * @param {*} system the federated system
 * @param {boolean} globalStatus true if system.retrievers contains all the retrievers for the system across all PFS servers, false if it
 * only contains the retrievers of one PFS server.
 */
function federatedSystemRetrieversStatus(system, globalStatus) {
  var statusColor = "green";
  var statusMessage = "All retrievers are working properly";
  if (system && system.retrievers && system.retrievers.length) {
    var individualRetrieverStatus = system.retrievers.map(function (retriever) {
      return retrieverStatus(retriever).color;
    })
    statusColor = individualRetrieverStatus.reduce(function(previousResult, value) {
      if (previousResult === value) {
        return value;
      } else {
        return "yellow";
      }
    });
    switch (statusColor) {
      case "red":
        statusMessage = "Issues with all retrievers";
        break;
      case "yellow":
        statusMessage = "Issue with at least one retriever";
        break;
      default:
        break;
    }
  } else {
    if (globalStatus) {
      statusColor = "yellow";
    }
    statusMessage = "No retriever defined for this federated system";
  }
  return {
    color: statusColor,
    message: statusMessage
  };
}

/**
 * Component that displays a list of retrievers for a federated system
 * @param {*} system the federated system
 */
function FederatedSystemRetrievers({ system }) {

    const [selected, setSelected] = useState(null);
    const [showModal, setShowModal] = useState(false);

    function changeHandler(retrieverId) {
      setShowModal(true);
      setSelected(retrieverId);
    }

    function getKey(retriever) {
      var key = null;
      if (retriever) {
        key = retriever["config.displayId"];
        if (retriever.hasOwnProperty("_pfsEndpoint")) {
          key += " on " + retriever._pfsEndpoint;
        }
      }
      return key;
    }

    if (system && system.retrievers && system.retrievers.length) {
      var headers = ['', 'REST API calls', 'End of last REST API call', 'Number of errors', 'End of last REST API call with error'];

      var rows = system.retrievers.map(function(retriever) {
        let restAPICallsCount = '';
        let lastRestAPICallEnd = '';
        let errorCount = '';
        let lastErrorTimestamp = '';
        if (retriever.kpi) {
          if (retriever.kpi.restAPICalls) {
            restAPICallsCount = retriever.kpi.restAPICalls.total;
            if (retriever.kpi.restAPICalls.lastRestAPICallEnd && retriever.kpi.restAPICalls.lastRestAPICallEnd.ts) {
              lastRestAPICallEnd = <DateTime datetime={retriever.kpi.restAPICalls.lastRestAPICallEnd.human}/>;
            }
          }
          if (retriever.kpi.errors) {
            errorCount = retriever.kpi.errors.total;
            if (retriever.kpi.errors.lastErrorTimestamp && retriever.kpi.errors.lastErrorTimestamp.ts) {
              lastErrorTimestamp = <DateTime datetime={retriever.kpi.errors.lastErrorTimestamp.human}/>;
            }
          }
        }

        var rowClassName = "status-" + retrieverStatus(retriever).color;

        return [getKey(retriever), [
          getKey(retriever),
          retriever.isRunning ? restAPICallsCount : "Retriever is not running",
          lastRestAPICallEnd,
          errorCount,
          lastErrorTimestamp,
        ], rowClassName];

      });

      // Find the selected retriever from the retrievers list
      var selectedRetriever = system.retrievers.find((retriever) => (getKey(retriever) === selected));
      if (selected && !selectedRetriever) {
        // The selection is outdated, let's re initialize the state for the next rendering
        setSelected(null);
        setShowModal(false);
      }

      // Display error or warning message for the retriever in the modal
      var message = <></>;
      if (selectedRetriever) {
        var selectedRetrieverStatus = retrieverStatus(selectedRetriever);
        if (selectedRetrieverStatus.color === "yellow") {
          message = <InlineWarning title={selectedRetrieverStatus.message}/>
        } else if (selectedRetrieverStatus.color === "red") {
          message = <InlineError title={selectedRetrieverStatus.message}/>
        }
      }
      
      return (
        <>
          <PropertiesArray
            title={<><ArrowsHorizontal className="icon-with-text"/> Retrievers</>}
            headers={headers}
            rows={rows}
            rowClickHandler={changeHandler}
            rowClickTooltip="click to get more details"/>
          <Modal
            open={showModal && !!selectedRetriever} // Open if requested AND there is a valid selected indexer
            passiveModal
            size="lg"
            modalLabel={<><FederatedSystemTypeIcon system={system} className="icon-with-text"/> <FederatedSystemName system={system} /></>}
            modalHeading={ <FederatedSystemModalHeading icon={<ArrowsHorizontal/>} label="retriever details" items={rows.map(item => item[0])} selectedItem={selected} changeHandler={changeHandler}></FederatedSystemModalHeading> }
            onRequestClose={() => setShowModal(false)}>
              <hr />
              <div className="modal-refresh-toggle-and-status"><RuntimedataContextAutoRefreshToggle id="autoRefreshToggleFederatedSystemRetrieversModal"></RuntimedataContextAutoRefreshToggle>{message}</div>
              <RetrieverInformation retriever={selectedRetriever}/>

          </Modal>
        </>
      );
    } else {
      return null;
    }
}

export default FederatedSystemRetrievers;
export { federatedSystemRetrieversStatus };