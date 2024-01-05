/*
 Copyright IBM Corp. 2023
*/

import React from "react";
import { Tag } from "@carbon/react";
import PropertiesArray from "../../components/PropertiesArray";
import DateTime from "../../components/DateTime";
import InlineWarning from "../../components/InlineWarning";

function IndexerErrors({indexer}) {

    function cycleMaintenanceOperations(cycle) {
        var operations = [];
        var index = 0;
        for (let opName in cycle.maintenanceOperations) {
            operations.push(<div key={index}><span>{opName}</span><br/></div>);
            index++;
        }
        return operations;
    }

    function cycleErrors(cycle) {
        var errors = cycle.errors.map(function (error, index) {
            return <div key={index}><span className="error-message" title={error}>{error}</span><br/></div>;
        });
        return <>{errors}</>;
    }

    if (indexer && indexer.kpi && indexer.kpi.errors && indexer.kpi.errors.lastCycles) {
        var errors = indexer.kpi.errors;
        var headers = ['Cycle start', 'Errors'];
        var rows = indexer.kpi.errors.lastCycles.map(function (cycle) {
            return [cycle.start.ts, [
                cycle.start ? <DateTime datetime={cycle.start.human}/> : 'unknown',
                cycleErrors(cycle)
            ]];
        });
        return (
            <div className='indexer-errors'>
                <Tag type="red"><h6>{errors.total} error{errors.total > 1 ? 's' : ''} since start</h6></Tag>
                <PropertiesArray title="Last errors:" headers={headers} rows={rows}/>
            </div>
        );
    } else {
        return <InlineWarning title="No error recorded." />
    }
}

export default IndexerErrors;