/*
 Copyright IBM Corp. 2023
*/

import React, { useState } from "react";
import {
  Modal } from '@carbon/react';
import { BatchJob } from "@carbon/icons-react";
import PropertiesArray from "../../components/PropertiesArray";
import { FederatedSystemModalHeading, FederatedSystemName, FederatedSystemTypeIcon } from '.';
import InlineError from "../../components/InlineError";
import InlineWarning from "../../components/InlineWarning";
import { IndexerPartitionRange, IndexerInformation, indexingStatus, numberOfCycles, averageActiveCyclesDuration, countStats } from "../indexer";
import RuntimedataContextAutoRefreshToggle from "../../contexts/RuntimedataContextAutoRefreshToggle";

/**
 * Function that calculates the indexing status for a federated system. It returns an object with the following fields:
 * {
 *   color: green|yellow|red
 *   message: ["message that explains the status color"]
 * }
 * @param {*} system the federated system
 * @param {boolean} globalStatus true if system.indexers contains all the indexers for the system across all PFS servers, false if it
 * only contains the indexers of one PFS server.
 */
function federatedSystemIndexingStatus(system, globalStatus) {
  var statusColor = "green";
  var statusMessage = null;
  if (globalStatus) {
    // Status of the indexers of a federated system for a PFS cluster
    if (system && system.indexers && system.indexers.length) {
      var numberOfIndexerWithAssignedPartitionsThatAreNotRunning = 0;
      // Check if all partitions are covered by the indexers
      var partitions = system.indexers.map(function (indexer) {
        var partition = indexer && indexer.partition;
        if (partition) {
          if (! (indexer && indexer.isRunning) && partition.max) {
            // This indexer has an assigned partition but is not running
            numberOfIndexerWithAssignedPartitionsThatAreNotRunning++;
          }
          return [partition.min, partition.max];
        } else {
          return [undefined, undefined];
        }
      });
      partitions.sort(function(a, b) {
        if (a[0] > b[0]) {
          return 1;
        } else if (a[0] < b[0]) {
          return -1;
        } else {
          return 0;
        }
      });
      var expectedNextPartitionValue = 0;
      if (partitions[0][0] == undefined) {
        statusColor = "red";
        statusMessage = "No partitions are covered by the indexers";
      } else {
        for (const partition of partitions) {
          if (partition[0] != expectedNextPartitionValue) {
            statusColor = "red";
            if (isNaN(partition[0]) || partition[0] > expectedNextPartitionValue) {
              statusMessage = "Some partitions are not covered by the indexers";
            } else {
              statusMessage = "Some partitions are covered by more than one indexer";
              console.log("DEBUG");
            }
            break;
          } else {
            expectedNextPartitionValue = partition[1] + 1;
            if (expectedNextPartitionValue > 9999) {
              // All partitions are covered by the indexers !
              if (numberOfIndexerWithAssignedPartitionsThatAreNotRunning > 0) {
                statusColor = "red";
                statusMessage = numberOfIndexerWithAssignedPartitionsThatAreNotRunning + " indexers with assigned partitions are not running";
              } else {
                // Check if at least one running indexer has an error in its last cycle 
                var oneRunningIndexerHasAnErrorInLastCycle = system.indexers.some(function (indexer) {
                  // TODO: MUTUALIZE THIS CODE WITH IndexerKPI ???
                  var lastCycles = indexer && indexer.kpi && indexer.kpi.lastCycles;
                  var lastCycle = lastCycles && lastCycles.length && lastCycles[0];
                  return lastCycle && lastCycle.errors && lastCycle.errors.length;
                });
                if (oneRunningIndexerHasAnErrorInLastCycle) {
                  statusColor = "red";
                  statusMessage = "Last cycle of at least one running indexer have error(s)"
                } else {
                  // Check if at least one indexer has a non green status => yellow
                  var oneIndexerHasANonGreenStatus = system.indexers.some(function (indexer) {
                    return indexingStatus(indexer).color !== "green";
                  });
                  if (oneIndexerHasANonGreenStatus) {
                    statusColor = "yellow";
                    statusMessage = "Issue with at least one indexer";                
                  }
                }
              }
              break;
            }
          }
        }
      }
      if (!statusMessage && expectedNextPartitionValue <= 9999) {
        statusColor = "red";
        statusMessage = "Some partitions are not covered by the indexers";
      }
    } else {
      statusColor = ((system && system.systemType) === "SYSTEM_TYPE_CASE") ? "green" : "red";
      statusMessage = "No indexer defined for this federated system";
    }
  } else {
    // Status of the indexers of a federated system for a PFS server
    if (system && system.indexers && system.indexers.length) {
      var individualIndexerStatus = system.indexers.map(function (indexer) {
        return indexingStatus(indexer).color;
      })
      statusColor = individualIndexerStatus.reduce(function(previousResult, value) {
        if (previousResult === value) {
          return value;
        } else {
          return "yellow";
        }
      });
    } else {
      statusMessage = "No indexer defined for this federated system";
    }
  }
  return {
    color: statusColor,
    message: statusMessage ? statusMessage : "All indexers are working properly"
  };
}

/**
 * Component that displays a list of indexers for a federated system
 * @param {*} system the federated system
 */
function FederatedSystemIndexers({ system }) {

    const [selected, setSelected] = useState(null);
    const [showModal, setShowModal] = useState(false);

    function changeHandler(indexerId) {
      setShowModal(true);
      setSelected(indexerId);
    }

    function getKey(indexer) {
      var key = null;
      if (indexer) {
        key = indexer["config.displayId"];
        if (indexer.hasOwnProperty("_pfsEndpoint")) {
          key += " on " + indexer._pfsEndpoint;
        }
      }
      return key;
    }

    if (system && system.indexers && system.indexers.length) {
      var headers = ['', 'Partition range', 'Running time', 'Cycles', 'Avg active cycle', 'Processed events', 'Errors', 'Warnings'];

      var rows = system.indexers.map(function(indexer) {
        let runningTime = '';
        let errorCount = '';
        let warningCount = '';
        let processedChangelogEntries = '';
        if (indexer.kpi) {
          if (indexer.kpi.runningTime) {
            runningTime = indexer.kpi.runningTime.human;
          }
          if (indexer.kpi.errors) {
            errorCount = indexer.kpi.errors.total;
          }
          if (indexer.kpi.warnings) {
            warningCount = indexer.kpi.warnings.total;
          }
          if (indexer.kpi.processedChangelogEntries) {
            processedChangelogEntries = countStats(indexer.kpi.processedChangelogEntries);
          }
        }

        var rowClassName = "status-" + indexingStatus(indexer).color;
        return [getKey(indexer), [
          getKey(indexer),
          indexer.isRunning ? <IndexerPartitionRange indexer={indexer}/> : "Indexer is not running",
          runningTime,
          numberOfCycles(indexer.kpi),
          averageActiveCyclesDuration(indexer.kpi),
          processedChangelogEntries,
          errorCount,
          warningCount
        ], rowClassName];

      });

      // Find the selected indexer from the indexers list
      var selectedIndexer = system.indexers.find((indexer) => (getKey(indexer) === selected));
      if (selected && !selectedIndexer) {
        // The selection is outdated, let's re initialize the state for the next rendering
        setSelected(null);
        setShowModal(false);
      }

      // Display error or warning message for the indexer in the modal
      var message = <></>;
      if (selectedIndexer) {
        var selectedIndexerStatus = indexingStatus(selectedIndexer);
        if (selectedIndexerStatus.color === "yellow") {
          message = <InlineWarning title={selectedIndexerStatus.message}/>
        } else if (selectedIndexerStatus.color === "red") {
          message = <InlineError title={selectedIndexerStatus.message}/>
        }
      }

      return (
        <>
          <PropertiesArray
            title={<><BatchJob className="icon-with-text"/> Indexers</>}
            headers={headers}
            rows={rows}
            rowClickHandler={changeHandler}
            rowClickTooltip="click to get more details"/>
          <Modal
            open={showModal && !!selectedIndexer} // Open if requested AND there is a valid selected indexer
            passiveModal
            size="lg"
            modalLabel={<><FederatedSystemTypeIcon system={system} className="icon-with-text"/> <FederatedSystemName system={system} /></>}
            modalHeading={ <FederatedSystemModalHeading icon={<BatchJob/>} label="indexer details" items={rows.map(item => item[0])} selectedItem={selected} changeHandler={changeHandler}></FederatedSystemModalHeading> }
            onRequestClose={() => setShowModal(false)}>
              <hr/>
              <div className="modal-refresh-toggle-and-status"><RuntimedataContextAutoRefreshToggle id="autoRefreshToggleFederatedSystemIndexersModal"></RuntimedataContextAutoRefreshToggle> {message}</div>
              <IndexerInformation indexer={selectedIndexer}/>
          </Modal>
        </>
      );
    } else {
      return null;
    }
}

export default FederatedSystemIndexers;
export { federatedSystemIndexingStatus };