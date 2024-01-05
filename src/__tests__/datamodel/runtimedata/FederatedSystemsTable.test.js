/*
 Copyright IBM Corp. 2023
*/

import { act, render } from '@testing-library/react';
import { HttpResponse } from 'msw';
import RuntimedataContextProvider from '../../../contexts/RuntimedataContextProvider';
import { FederatedSystemsTable } from '../../../datamodel/runtimedata';
import runtimedataJSON from './runtimedata.json';
import { restoreFetch, mockFetch } from '../../testutils/mock';

const testURL = '/pfsconsole/api/v1/cluster/runtimedata';

beforeAll(() => {});

afterEach(() => {
  restoreFetch();
});

async function testNotValidData(data) {
  mockFetch(testURL, data);

  // create a context provider that gets/provides data to FederatedSystemsTable
  let topContainer = null;
  await act(async () => {
    const { container } = render(
      <RuntimedataContextProvider>
        <FederatedSystemsTable />
      </RuntimedataContextProvider>
    );
    topContainer = container;
  });

  // should contain a error panel
  expect(topContainer.querySelector('.runtimedata-error-panel')).not.toBeNull();
}

test('Federated Systems receives non valid data', async () => {
  await testNotValidData(null);
});

test('Federated Systems receives non valid data', async () => {
  await testNotValidData(undefined);
});

test('Federated Systems receives non valid data', async () => {
  await testNotValidData(HttpResponse.error());
});

test('Federated Systems table structure checking', async () => {
  mockFetch(testURL, HttpResponse.json(runtimedataJSON));

  // create a context provider that gets/provides data to FederatedSystemsTable
  let topContainer = null;
  await act(async () => {
    const { container } = render(
      <RuntimedataContextProvider>
        <FederatedSystemsTable />
      </RuntimedataContextProvider>
    );
    topContainer = container;
  });

  // check the general structure of the component
  expect(topContainer.querySelector('.federated-systems-table')).toBeDefined();
  expect(
    topContainer.querySelector('.cds--data-table-container')
  ).not.toBeNull();
  expect(topContainer.querySelector('.cds--data-table-header')).not.toBeNull();
  expect(topContainer.querySelector('.cds--data-table-content')).not.toBeNull();

  // create array of unique federated systems
  let uniqueFSArray = new Map(); // use Map because map.size() is faster than Object.keys().length
  runtimedataJSON.nodes.forEach(node => {
    node.data.federatedSystems.forEach(fs => {
      uniqueFSArray.set(fs.restUrlPrefix, fs);
    });
  });

  // get all elements of class 'systeminfo' and ensure there are as many as unique runtimedata.nodes.data.federatedSystems
  const systemsInfo = topContainer.querySelectorAll('.systeminfo'); // return a NodeList
  expect(systemsInfo).not.toBeNull();
  expect(systemsInfo).toBeInstanceOf(NodeList);
  expect(systemsInfo.length).toEqual(uniqueFSArray.size);
});
