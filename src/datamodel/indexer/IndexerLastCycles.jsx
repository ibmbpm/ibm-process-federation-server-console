/*
 Copyright IBM Corp. 2023
*/

import React from "react";
import PropertiesArray from "../../components/PropertiesArray";
import DateTime from "../../components/DateTime";
import InlineWarning from "../../components/InlineWarning"

function IndexerLastCycles({indexer}) {

    function cycleMaintenanceOperations(cycle) {
        var operations = [];
        var index = 0;
        for (let opName in cycle.maintenanceOperations) {
            operations.push(<div key={index}><span>{opName}</span><br/></div>);
            index++;
        }
        return operations;
    }

    if (indexer && indexer.kpi && indexer.kpi.lastCycles && indexer.kpi.lastCycles.length) {
        var headers = ['Start', 'Duration', 'Processed', 'Updated', 'Deleted', 'Errors', 'Warnings', 'Maintenance ops'];
        var rows = indexer.kpi.lastCycles.map(function (cycle) {
            var statusClassName = "status-green";
            if (cycle.errors && cycle.errors.length) {
                statusClassName = "status-red";
            } else if (cycle.warnings && cycle.warnings.length) {
                statusClassName = "status-yellow";
            }
            return [cycle.start.ts, [
                cycle.start ? <DateTime datetime={cycle.start.human}/> : 'unknown',
                cycle.duration ? cycle.duration.human : 'unknown',
                cycle.processedChangelogEntries,
                cycle.indexUpdates,
                cycle.indexDeletions,
                cycle.errors ? cycle.errors.length : 0,
                cycle.warnings ? cycle.warnings.length : 0,
                cycleMaintenanceOperations(cycle)
            ], statusClassName];
        });
        return (
            <div className='indexer-last-cycles'>
                <PropertiesArray headers={headers} rows={rows}/>
            </div>
        );
    } else {
        return <InlineWarning title="No Last Cycles recorded." />
    }
}

export default IndexerLastCycles;