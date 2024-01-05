/*
 Copyright IBM Corp. 2023
*/

import React from "react";
import {
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
} from "@carbon/react";
import {
    IndexerProperties,
    IndexerMaintenanceOperation,
    IndexerKPI,
    IndexerLastCycles,
    IndexerWarnings,
    IndexerErrors
} from '.';

function IndexerInformation({indexer}) {
    return (
        <Tabs>
            <TabList
            aria-label="List of tabs"
            contained={false}
            activation="automatic">
            <Tab>KPI</Tab>
            <Tab disabled={!(indexer && indexer.kpi && indexer.kpi.numberOfCompletedCycles && indexer.kpi.numberOfCompletedCycles.total)}>Last Cycles</Tab>
            <Tab disabled={!(indexer && indexer.kpi && indexer.kpi.errors && indexer.kpi.errors.total)}>Errors</Tab>
            <Tab disabled={!(indexer && indexer.kpi && indexer.kpi.warnings && indexer.kpi.warnings.total)}>Warnings</Tab>
            <Tab>Maintenance Operations</Tab>
            <Tab>Properties</Tab>
            </TabList>
            <TabPanels>
            <TabPanel>
                <IndexerKPI indexer={indexer}/>
            </TabPanel>
            <TabPanel>
                <IndexerLastCycles indexer={indexer}/>
            </TabPanel>
            <TabPanel>
                <IndexerErrors indexer={indexer}/>
            </TabPanel>
            <TabPanel>
                <IndexerWarnings indexer={indexer}/>
            </TabPanel>
            <TabPanel>
                <IndexerMaintenanceOperation indexer={indexer}/>
            </TabPanel>
            <TabPanel>
                <IndexerProperties indexer={indexer}/>
            </TabPanel>
            </TabPanels>
        </Tabs>
);
}

export default IndexerInformation;