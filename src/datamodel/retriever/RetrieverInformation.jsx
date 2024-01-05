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
    RetrieverKPI,
    RetrieverLastRestAPICalls,
    RetrieverErrors,
    RetrieverProperties
} from '.';

function RetrieverInformation({retriever}) {
    return (
        <Tabs>
            <TabList
            aria-label="List of tabs"
            contained={false}
            activation="automatic">
            <Tab>KPI</Tab>
            <Tab>Last REST API Calls</Tab>
            <Tab disabled={!(retriever && retriever.kpi && retriever.kpi.errors && retriever.kpi.errors.total)}>Errors</Tab>
            <Tab>Properties</Tab>
            </TabList>
            <TabPanels>
            <TabPanel>
                <RetrieverKPI retriever={retriever}/>
            </TabPanel>
            <TabPanel>
                <RetrieverLastRestAPICalls retriever={retriever}/>
            </TabPanel>
            <TabPanel>
                <RetrieverErrors retriever={retriever}/>
            </TabPanel>
            <TabPanel>
                <RetrieverProperties retriever={retriever}/>
            </TabPanel>
            </TabPanels>
        </Tabs>
);
}

export default RetrieverInformation;