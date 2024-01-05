/*
 Copyright IBM Corp. 2023
*/

import React from "react";
import PropertiesArray from "../../components/PropertiesArray";
import DateTime from "../../components/DateTime";
import InlineWarning from "../../components/InlineWarning";
import { averageDurationStats } from "./IndexerKPI";

/**
 * Component that returns information about the maintenance operations of an indexer
 * @param {*} indexer 
 * @returns 
 */
function IndexerMaintenanceOperation({indexer}) {

    var message = indexer && !indexer.isRunning ? <InlineWarning title="No maintenance operation can be performed when the indexer is not running"/> : "";
    if (indexer && indexer.maintenanceOperations) {
        var kpiData = indexer.kpi && indexer.kpi.maintenanceOperations;
        const NOT_SCHEDULED = 'Unscheduled';
        const UNKNOWN = 'Unknown';
        const rows = [];
        var headers = ['', 'Frequency', 'Count', 'Average Duration', 'Next scheduled time'];
        for (let opName in indexer.maintenanceOperations) {
            let operation = indexer.maintenanceOperations[opName];
            let interval = UNKNOWN;
            let nextScheduledTime = UNKNOWN;
            let count = kpiData && kpiData[opName] ? kpiData[opName].count : 0;
            let duration = kpiData && kpiData[opName] ? averageDurationStats(kpiData[opName].duration) : '';
            switch(opName) {
                case 'COMPACTION':
                    interval = operation.scheduledCompaction ? operation.changeLogCompactionInterval + ' ms' : NOT_SCHEDULED;
                    nextScheduledTime = operation.scheduledCompaction ? <DateTime datetime={operation.nextScheduledTime}/> : NOT_SCHEDULED;
                    break;
                case 'INDEX_LOG_TRIM':
                    interval = operation.scheduledIndexLogTrim ? operation.indexLogTrimInterval + ' ms' : NOT_SCHEDULED;
                    nextScheduledTime = operation.scheduledIndexLogTrim ? <DateTime datetime={operation.nextScheduledTime}/> : NOT_SCHEDULED;
                    break;
                case 'SYNC_TASKS':
                    interval = operation.scheduledSyncTasks ? operation.synchronizeTasksInterval + ' ms' : NOT_SCHEDULED;
                    nextScheduledTime = operation.scheduledSyncTasks ? <DateTime datetime={operation.nextScheduledTime}/> : NOT_SCHEDULED;
                    break;
                case 'SYNC_TASK_DELETES':
                    interval = operation.scheduledSyncTaskDeletes ? operation.synchronizeTasksDeleteInterval + ' ms' : NOT_SCHEDULED;
                    nextScheduledTime = operation.scheduledSyncTaskDeletes ? <DateTime datetime={operation.nextScheduledTime}/> : NOT_SCHEDULED;
                    break;
                case 'SYNC_INSTANCE_DELETES':
                    interval = operation.scheduledSyncInstanceDeletes ? operation.synchronizeInstancesDeleteInterval + ' ms' : NOT_SCHEDULED;
                    nextScheduledTime = operation.scheduledSyncInstanceDeletes ? <DateTime datetime={operation.nextScheduledTime}/> : NOT_SCHEDULED;
                    break;
                case 'SYNC_INSTANCES':
                    interval = operation.scheduledSyncInstances ? operation.synchronizeInstancesInterval + ' ms' : NOT_SCHEDULED;
                    nextScheduledTime = operation.scheduledSyncInstances ? <DateTime datetime={operation.nextScheduledTime}/> : NOT_SCHEDULED;
                    break;
                default:
                    break;
            };
            rows.push([opName, [opName, interval, count, duration, nextScheduledTime]]);
        }
        return (
            <>
            {message}
            <PropertiesArray
                headers={headers}
                rows={rows}/>
            </>
        );
    } else {
        return null;
    }
}

export default IndexerMaintenanceOperation;