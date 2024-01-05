/*
 Copyright IBM Corp. 2023
*/

import React from "react";
import PropertiesArray from "../../components/PropertiesArray";
import DateTime from "../../components/DateTime";
import InlineWarning from "../../components/InlineWarning";

/**
 * Component that display the last REST API calls of a retriever
 * @param {*} retriever 
 */
function RetrieverLastRestAPICalls({retriever}) {

    if (retriever && retriever.kpi && retriever.kpi.lastRestAPICalls && retriever.kpi.lastRestAPICalls.length) {
        var headers = ['Start', 'Duration', 'REST API', 'Path', 'User', 'Response Status'];
        var rows = retriever.kpi.lastRestAPICalls.map(function (call) {
            var statusClassName = "status-green";
            if (call.error) {
                statusClassName = "status-red";
            }
            return [call.start.ts + '-' + call.end.ts, [
                call.start ? <DateTime datetime={call.start.human}/> : 'unknown',
                call.duration ? call.duration.human : 'unknown',
                call.type,
                call.path,
                call.user,
                call.status
            ], statusClassName];
        });
        return (
            <div className='retriever-last-calls'>
                <PropertiesArray headers={headers} rows={rows}/>
            </div>
        );
    } else {
        return <InlineWarning title="No REST API calls recorded." />
    }
}

export default RetrieverLastRestAPICalls;