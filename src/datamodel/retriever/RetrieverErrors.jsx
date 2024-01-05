/*
 Copyright IBM Corp. 2023
*/

import React from "react";
import { Tag } from "@carbon/react";
import PropertiesArray from "../../components/PropertiesArray";
import DateTime from "../../components/DateTime";
import InlineWarning from "../../components/InlineWarning";

/**
 * Component that display the errors of a retriever
 * @param {*} retriever 
 */
function RetrieverErrors({retriever}) {

    if (retriever && retriever.kpi && retriever.kpi.errors && retriever.kpi.errors.lastRestAPICallsWithError) {
        var errors = retriever.kpi.errors;
        var headers = ['Start', 'Duration', 'Type', 'Path', 'User', 'Response Status'];
        var rows = retriever.kpi.errors.lastRestAPICallsWithError.map(function (operation) {
            // TODO: CHECK THAT operation.start AND operation.duration ARE DEFINED
            return [operation.start.ts + '-' + operation.end.ts, [
                operation.start ? <DateTime datetime={operation.start.human}/> : 'unknown',
                operation.duration ? operation.duration.human : 'unknown',
                operation.type,
                operation.path,
                operation.user,
                operation.status
            ]];
        });
        return (
            <div className='retriever-errors'>
                <Tag type="red"><h6>{errors.total} error{errors.total > 1 ? 's' : ''} since start</h6></Tag>
                <PropertiesArray title="Last REST API call with errors:" headers={headers} rows={rows}/>
            </div>
        );
    } else {
        return <InlineWarning title="No error recorded." />
    }
}

export default RetrieverErrors;