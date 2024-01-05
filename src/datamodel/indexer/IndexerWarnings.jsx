/*
 Copyright IBM Corp. 2023
*/

import React from "react";
import { Tag } from "@carbon/react";
import PropertiesArray from "../../components/PropertiesArray";
import DateTime from "../../components/DateTime";
import InlineWarning from "../../components/InlineWarning";

function IndexerWarnings({indexer}) {

    function cycleWarnings(cycle) {
        var warnings = cycle.warnings.map(function (warning, index) {
            return <div key={index}><span className="warning-message" title={warning}>{warning}</span><br/></div>;
        });
        return <>{warnings}</>;
    }

    if (indexer && indexer.kpi && indexer.kpi.warnings && indexer.kpi.warnings.lastCycles) {
        var warnings = indexer.kpi.warnings;
        var headers = ['Cycle start', 'Duration', 'Warnings'];
        var rows = indexer.kpi.warnings.lastCycles.map(function (cycle) {
            return [cycle.start.ts, [
                <DateTime datetime={cycle.start.human}/>,
                cycle.duration.human,
                cycleWarnings(cycle)
            ]];
        });
        return (
            <div className='indexer-warnings'>
                <Tag type="gray"><h6>{warnings.total} warning{warnings.total > 1 ? 's' : ''} since start</h6></Tag>
                <PropertiesArray title="Last warnings:" headers={headers} rows={rows}/>
            </div>
        );
    } else {
        return <InlineWarning title="No Warning recorded." />
    }
}

export default IndexerWarnings;