/*
 Copyright IBM Corp. 2023
*/

import React, { useContext } from 'react';
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Grid,
  Column,
  DataTableSkeleton,
} from '@carbon/react';
import {
  ProcessFederationServersTable,
  FederatedSystemsTable,
} from '../../datamodel/runtimedata';
import { RuntimedataContext } from '../../contexts/RuntimedataContextProvider';
import RuntimedataContextAutoRefreshToggle from '../../contexts/RuntimedataContextAutoRefreshToggle';

/**
 * The Monitoring page of the PFS Console
 * @returns
 */
function MonitoringPage() {
  console.log('Rendering MonitoringPage');

  const {
    runtimedata,
    loadingRuntimedata,
    autoRefreshEnabled,
    setAutoRefreshEnabled,
  } = useContext(RuntimedataContext);

  function handleAutoRefreshToggle(value) {
    setAutoRefreshEnabled(value);
  }

  return (
    <Grid className="monitoring-page">
      <Column lg={16} className="monitoring-page__r0">
        <RuntimedataContextAutoRefreshToggle id="autoRefreshToggleMonitoringPage"></RuntimedataContextAutoRefreshToggle>
      </Column>

      <Column lg={16} className="monitoring-page__r1">
        <Tabs>
          <TabList
            aria-label="List of tabs"
            contained={false}
            activation="automatic">
            <Tab disabled={false}>Process Federation Servers</Tab>
            <Tab disabled={false}>Federated Systems</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              {runtimedata ? (
                <ProcessFederationServersTable />
              ) : (
                <DataTableSkeleton />
              )}
            </TabPanel>
            <TabPanel>
              {runtimedata ? <FederatedSystemsTable /> : <DataTableSkeleton />}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Column>
    </Grid>
  );
}

export default MonitoringPage;
