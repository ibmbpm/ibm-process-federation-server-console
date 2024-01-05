/*
 Copyright IBM Corp. 2023
*/

import { act, fireEvent, render, screen } from '@testing-library/react';
import { HttpResponse } from 'msw';
import RuntimedataContextProvider from '../../contexts/RuntimedataContextProvider';

import runtimedataJSON from './runtimedata.json';
import MonitoringPage from '../../content/MonitoringPage';
import { mockFetch, restoreFetch } from '../testutils/mock';

//********************************************************
// fetch mocking function
//********************************************************

const testURL = '/pfsconsole/api/v1/cluster/runtimedata';

//********************************************************
// utility functions
//********************************************************

/**
 * Retrieve the error panel displayed when runtimedata is not valid
 */
function getRuntimedataErrorPanel(container) {
  if (!container) return undefined;

  // get an element of class "runtimedata-error-panel"
  return container.querySelector('.runtimedata-error-panel');
}

/**
 * Retrieve the table containing runtimedata related to Process Federation Server
 */
function getPFSTable(container) {
  if (!container) return undefined;

  // get an element of class "process-federation-servers-table"
  return container.querySelector('.process-federation-servers-table');
}

/**
 * Retrieve the table containing runtimedata related to Federated Systems
 */
function getFSTable(container) {
  if (!container) return undefined;

  // get an element of class "federated-systems-table"
  return container.querySelector('.federated-systems-table');
}

/**
 * Retrieve the Federated Systems tab
 */
function getFSTab() {
  // get a "tab" element named "Federated Systems"
  return screen.queryByRole('tab', { name: 'Federated Systems' });
}

/**
 * Retrieve the Process Federation Servers tab
 */
function getPFSTab() {
  // get a "tab" element named "Process Federation Servers"
  return screen.queryByRole('tab', { name: 'Process Federation Servers' });
}

//********************************************************
// Tests
//********************************************************

afterAll(() => {
  restoreFetch();
});

test(`MonitoringPage render data containing error`, async () => {
  mockFetch(testURL, HttpResponse.json({ error: 'Runtimedata error' }));

  // create a context provider and a monitoring page: the context fetches data and provides it to the monitoring page
  let topContainer;
  await act(async () => {
    const { container } = render(
      <RuntimedataContextProvider>
        <MonitoringPage />
      </RuntimedataContextProvider>
    );
    topContainer = container;
  });

  // there should be a element indicating an error
  expect(getRuntimedataErrorPanel(topContainer)).toBeDefined();

  // there should be NO elements belonging to monitoring data table, like:
  // NO expandable table rows in the page: those rows exists only when there are data for PFS or Federated Sytems
  // NO table cells of class "monitoring-data-table-cell"
  expect(topContainer.querySelector('.cds--expandable-row')).toBeNull();
  expect(topContainer.querySelector('.monitoring-data-table-cell')).toBeNull();
});

test(`MonitoringPage renders data`, async () => {
  mockFetch(testURL, HttpResponse.json(runtimedataJSON));

  // create a context provider and a monitoring page: the context fetches data and provides it to the monitoring page
  let topContainer;
  await act(async () => {
    const { container } = render(
      <RuntimedataContextProvider>
        <MonitoringPage />
      </RuntimedataContextProvider>
    );
    topContainer = container;
  });

  // there should be NO error displayed
  expect(getRuntimedataErrorPanel(topContainer)).toBeNull();

  // The page should contain elements, labeled with "Autorefresh", to control the automatic refresh feature provided by the RuntimedataContextProvider.
  // There are several such toggles in the UI, some of them are hidden until displayed, then we ensure we get at least one
  const autorefreshToggles = screen.getAllByText('Autorefresh');
  expect(autorefreshToggles).toBeDefined();
  expect(autorefreshToggles.length).toBeGreaterThanOrEqual(1);

  // check toplevel tab used to display "Process Federation Servers" table
  const pfsTab = getPFSTab();
  expect(pfsTab).toBeDefined();

  // check toplevel tab used to display "Federated Systems" table
  const fsTab = getFSTab();
  expect(fsTab).toBeDefined();

  // check that a table containing Process Federation Server data exists
  const pfsTable = getPFSTable(topContainer);
  expect(pfsTable).toBeDefined();
  expect(pfsTable).toBeVisible();

  // check that a table containing Federated Systems data exists. This one is NOT visible by default when the MonitoringPage is displayed
  const fsTable = getFSTable(topContainer);
  expect(fsTable).toBeDefined();
  expect(fsTable).not.toBeVisible();
});

test(`MonitoringPage reacts to user interaction on tabs`, async () => {
  mockFetch(testURL, HttpResponse.json(runtimedataJSON));

  // create a context provider and a monitoring page: the context fetches data and provides it to the monitoring page
  let topContainer;
  await act(async () => {
    const { container } = render(
      <RuntimedataContextProvider>
        <MonitoringPage />
      </RuntimedataContextProvider>
    );
    topContainer = container;
  });

  // get toplevel tabs used to display either "Process Federation Servers" or "Federated Systems" table
  const pfsTab = getPFSTab();
  const fsTab = getFSTab();

  // get tables containing "Process Federation Server" and "Federated Systems" data
  // reminder: "PFS" table is visible by default, and "Federated Systems" table is hidden by default
  const pfsTable = getPFSTable(topContainer);
  const fsTable = getFSTable(topContainer);

  // simulate click on "Federated Systems" tab: it should turned "Federated Systems" table visible and "Process Federation Servers" hidden.
  // and vice versa
  fireEvent.click(fsTab);
  expect(pfsTable).not.toBeVisible();
  expect(fsTable).toBeVisible();
  fireEvent.click(pfsTab);
  expect(pfsTable).toBeVisible();
  expect(fsTable).not.toBeVisible();
});
