/*
 Copyright IBM Corp. 2023
*/

import React from "react";
import PropertiesList from "../../components/PropertiesList";
import PropertiesArray from "../../components/PropertiesArray";
import DateTime from "../../components/DateTime";
import InlineWarning from "../../components/InlineWarning";

/**
 * Function that calculates the status of a retriever. It returns an object with the following fields:
 * {
 *   color: green|yellow|red
 *   message: "message that explains the status color"]
 * }
 * @param {*} retriever the retriever
 */
function retrieverStatus(retriever) {
    var statusColor = "yellow";
    var statusMessage = "";
    var isNotRunning = !retriever.isRunning;
    var lastRestAPICalls = retriever && retriever.kpi && retriever.kpi.lastRestAPICalls;
    var lastRestAPICallsHaveErrors = false;
    if (lastRestAPICalls) {
        lastRestAPICallsHaveErrors = lastRestAPICalls.some(function(call) {
            return !!(call && call.error);
        })
    }
    var lastRestAPICall = lastRestAPICalls && lastRestAPICalls.length && lastRestAPICalls[0];
    var lastRestAPICallHasError = lastRestAPICall && lastRestAPICall.error;
    if (!isNotRunning && !lastRestAPICallHasError && !lastRestAPICallsHaveErrors) {
        statusColor = "green";
    } else if (isNotRunning || lastRestAPICallHasError) {
        statusColor = "red";
        statusMessage = isNotRunning ? "Retriever is not running" : "Error during the last REST API call";
    } else {
        // yellow status
        statusMessage = "Error(s) during the last REST API calls";
    }
    return {
        color: statusColor,
        message: statusMessage
    };
}

// TODO: MUTUALIZE THIS FUNCTION WITH THE ONE FROM IndexerKPI (ADD A KPI COMPONENT IN components ?)
function averageDurationStats(duration) {
    if (duration && duration.total && duration.min && duration.max && duration.avg) {
        return  duration.avg.human + ' (min: ' + duration.min.human + ', max: ' + duration.max.human + ', total: ' + duration.total.human + ')';
    } else {
        return null;
    }
}

/**
 * Component that display the KPI of a retriever
 * @param {*} retriever 
 */
function RetrieverKPI({retriever}) {

    if (retriever && retriever.kpi) {
        var kpi = retriever.kpi;
        // Properties list
        var properties = {
            'collection time': kpi.kpiTimestamp && <DateTime datetime={kpi.kpiTimestamp.human}/>,
            'number of REST API calls': kpi.restAPICalls && kpi.restAPICalls.total,
            'number of errors': kpi.errors && kpi.errors.total,
            'end of last REST API call': kpi.restAPICalls && kpi.restAPICalls.lastRestAPICallEnd && kpi.restAPICalls.lastRestAPICallEnd.ts && <DateTime datetime={kpi.restAPICalls.lastRestAPICallEnd.human}/>,
            'end of last REST API call with error': kpi.errors && kpi.errors.lastErrorTimestamp && kpi.errors.lastErrorTimestamp.ts && <DateTime datetime={kpi.errors.lastErrorTimestamp.human}/>,
        };
        // Properties array
        var headers = ['', 'Count', 'Average duration', 'Errors'];
        var rows = [];
        if (kpi.restAPICalls) {
            for (let prop in kpi.restAPICalls) {
                if (prop !== 'total' && prop !== 'lastRestAPICallEnd') {
                    rows.push([prop, [prop, 
                        kpi.restAPICalls[prop].count,
                        averageDurationStats(kpi.restAPICalls[prop].duration),
                        kpi.restAPICalls[prop].errors && kpi.restAPICalls[prop].errors.total]])
                }
            }
        }
        return (
            <div className='retriever-kpi'>
                <PropertiesList properties={properties}/>
                <PropertiesArray title='REST API Calls' headers={headers} rows={rows}/>
            </div>
        );
    } else {
        return <InlineWarning title="No KPI available." />

    }
}

export default RetrieverKPI;
export { retrieverStatus, averageDurationStats };
