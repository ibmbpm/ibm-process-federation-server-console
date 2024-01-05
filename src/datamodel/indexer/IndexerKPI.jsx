/*
 Copyright IBM Corp. 2023
*/

import React from "react";
import PropertiesList from "../../components/PropertiesList";
import DateTime from "../../components/DateTime";
import InlineWarning from "../../components/InlineWarning";

/**
 * Function that calculates the indexing status for an indexer. It returns an object with the following fields:
 * {
 *   color: green|yellow|red
 *   message: "message that explains the status color"]
 * }
 * @param {*} indexer the indexer
 */
function indexingStatus(indexer) {
    var statusColor = "yellow";
    var statusMessage = "";
    var isNotRunning = !indexer.isRunning;
    var lastCycles = indexer && indexer.kpi && indexer.kpi.lastCycles;
    var lastCyclesHaveErrors = false;
    if (lastCycles) {
        lastCyclesHaveErrors = lastCycles.some(function(cycle) {
            return !!(cycle && cycle.errors && cycle.errors.length);
        })
    }
    var lastCycle = lastCycles && lastCycles.length && lastCycles[0];
    var lastCycleHasError = lastCycle && lastCycle.errors && lastCycle.errors.length;
    var lastCycleHasWarning = lastCycle && lastCycle.warnings && lastCycle.warnings.length;
    if (!isNotRunning && !lastCycleHasError && !lastCycleHasWarning && !lastCyclesHaveErrors) {
        statusColor = "green";
    } else if (isNotRunning || lastCycleHasError) {
        statusColor = "red";
        statusMessage = isNotRunning ? "Indexer is not running" : "Error during the last indexing cycle";
    } else {
        // yellow status
        statusMessage = lastCyclesHaveErrors ? "Error(s) during the last indexing cycles" : "Warning(s) during the last indexing cycle";
    }
    return {
        color: statusColor,
        message: statusMessage
    };
}

function totalDurationStats(duration) {
    if (duration && duration.total && duration.min && duration.max && duration.avg) {
        return  duration.total.human + ' (min: ' + duration.min.human + ', max: ' + duration.max.human + ', average: ' + duration.avg.human + ')';
    } else {
        return null;
    }
}

function averageDurationStats(duration) {
    if (duration && duration.total && duration.min && duration.max && duration.avg) {
        return  duration.avg.human + ' (min: ' + duration.min.human + ', max: ' + duration.max.human + ', total: ' + duration.total.human + ')';
    } else {
        return null;
    }
}

function countStats(count) {
    if (count) {
        if (count.total > 0) {
            return count.total + ' (' + count.min + ' to ' + count.max + ', average ' + count.avgPerActiveCycle.toFixed(2) + ' per active cycle)';
        } else {
            return 0;
        }
    } else {
        return null;
    }
}

function numberOfCycles(kpi) {
    if (kpi && kpi.numberOfCompletedCycles) {
        return kpi.numberOfCompletedCycles.active + ' active / ' + kpi.numberOfCompletedCycles.total + ' total';
    } else {
        return null;
    }
}

function activeCyclesDuration(kpi) {
    if (kpi && kpi.numberOfCompletedCycles && kpi.numberOfCompletedCycles.active > 0) {
        return totalDurationStats(kpi.cyclesDuration.active);
    } else {
        return null;
    }
}

function inactiveCyclesDuration(kpi) {
    if (kpi && kpi.numberOfCompletedCycles && kpi.numberOfCompletedCycles.inactive > 0) {
        return totalDurationStats(kpi.cyclesDuration.inactive);
    } else {
        return null;
    }
}

function averageActiveCyclesDuration(kpi) {
    if (kpi && kpi.cyclesDuration && kpi.cyclesDuration.active && kpi.cyclesDuration.active.avg) {
        return kpi.cyclesDuration.active.avg.human;
    } else {
        return null;
    }
}

/**
 * Component that display the KPI of an indexer
 * @param {*} indexer 
 */
function IndexerKPI({indexer}) {

    if (indexer && indexer.kpi) {
        var kpi = indexer.kpi;
        var properties = {
            'collection time': kpi.kpiTimestamp && <DateTime datetime={kpi.kpiTimestamp.human}/>,
            'status': indexer.status,
            'running time': kpi.runningTime && kpi.runningTime.human,
            'completed cycles': numberOfCycles(kpi),
            'number of errors': kpi.errors && kpi.errors.total,
            'number of warnings': kpi.warnings && kpi.warnings.total,
            'active cycles duration': activeCyclesDuration(kpi),
            'inactive cycles duration': inactiveCyclesDuration(kpi),
            'last active cycle completion':  kpi.lastActiveCycleEnd && kpi.lastActiveCycleEnd.ts > 0 ? <DateTime datetime={indexer.kpi.lastActiveCycleEnd.human}/> : null,
            'last inactive cycle completion': kpi.lastInactiveCycleEnd && kpi.lastInactiveCycleEnd.ts > 0 ? <DateTime datetime={indexer.kpi.lastInactiveCycleEnd.human}/> : null,
            'consumed change logs': countStats(kpi.consumedChangelogEntries),
            'processed change logs': countStats(kpi.processedChangelogEntries),
            'index updates': countStats(kpi.indexUpdates),
            'index deletions': countStats(kpi.indexDeletions),
        };
        return (
            <PropertiesList properties={properties}/>
        );
    } else {
        return <InlineWarning title="No KPI available." />
    }
}

export default IndexerKPI;
export { indexingStatus, totalDurationStats, averageDurationStats, countStats, numberOfCycles, averageActiveCyclesDuration };
