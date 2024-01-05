/*
 Copyright IBM Corp. 2023
*/

import { act, render, screen } from '@testing-library/react';
import { HttpResponse } from 'msw';
import RuntimedataContextProvider from '../../../contexts/RuntimedataContextProvider';
import { ProcessFederationServersTable } from '../../../datamodel/runtimedata';
import runtimedataJSON from './runtimedata.json';
import { mockFetch, restoreFetch } from '../../testutils/mock';

const testURL = '/pfsconsole/api/v1/cluster/runtimedata';

beforeAll(() => {});

afterEach(() => {
  restoreFetch();
});

async function testNotValidData(data) {
  mockFetch(testURL, data);

  // create a context provider that gets/provides data ProcessFederationServersTable
  let topContainer = null;
  await act(async () => {
    const { container } = render(
      <RuntimedataContextProvider>
        <ProcessFederationServersTable />
      </RuntimedataContextProvider>
    );
    topContainer = container;
  });

  // should contain a error panel
  expect(topContainer.querySelector('.runtimedata-error-panel')).not.toBeNull();
}

test('ProcessFederationServersTable receives non valid data', async () => {
  await testNotValidData(null);
});

test('ProcessFederationServersTable receives non valid data', async () => {
  await testNotValidData(undefined);
});

test('ProcessFederationServersTable receives non valid data', async () => {
  await testNotValidData(HttpResponse.error());
});

test('ProcessFederationServersTable structure checking', async () => {
  mockFetch(testURL, HttpResponse.json(runtimedataJSON));

  // create a context provider that gets/provides data ProcessFederationServersTable
  let topContainer = null;
  await act(async () => {
    const { container } = render(
      <RuntimedataContextProvider>
        <ProcessFederationServersTable />
      </RuntimedataContextProvider>
    );
    topContainer = container;
  });

  // check the general structure of the component
  expect(
    topContainer.querySelector('.process-federation-servers-table')
  ).not.toBeNull();
  expect(
    topContainer.querySelector('.cds--data-table-container')
  ).not.toBeNull();
  expect(topContainer.querySelector('.cds--data-table-header')).not.toBeNull();
  expect(topContainer.querySelector('.cds--data-table-content')).not.toBeNull();

  // get all elements of class 'endpoint' and ensure there are as many as runtimedata's nodes
  const endpoints = topContainer.querySelectorAll('.endpoint'); // return a NodeList
  expect(endpoints).not.toBeNull();
  expect(endpoints).toBeInstanceOf(NodeList);
  expect(endpoints.length).toEqual(runtimedataJSON.nodes.length);

  // for each enpoint element, check that it corresponds to a node's description (endpoint url, swagger ui link,...)
  endpoints.forEach((node, idx) => {
    expect(node).toHaveTextContent(runtimedataJSON.nodes[idx].endpoint);
    expect(node).toHaveTextContent('Swagger UI');
  });

  // get all elements of class 'federated-data-repository-properties' and ensure there are as many as runtimedata's nodes
  const fdrs = topContainer.querySelectorAll(
    '.federated-data-repository-properties'
  ); // return a NodeList
  expect(fdrs).not.toBeNull();
  expect(fdrs).toBeInstanceOf(NodeList);
  expect(fdrs.length).toEqual(runtimedataJSON.nodes.length);
});
