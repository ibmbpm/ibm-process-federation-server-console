/*
 Copyright IBM Corp. 2023
*/

import { act, fireEvent, render, screen } from '@testing-library/react';
import { FederatedSystemRetrievers } from '../../../datamodel/federatedsystem';
import { mockFetch, restoreFetch } from '../../testutils/mock';

import systemJson from './system.json';
import RuntimedataContextProvider from '../../../contexts/RuntimedataContextProvider';
const testURL = '/pfsconsole/api/v1/cluster/runtimedata';

afterAll(() => {
  restoreFetch();
});

/**
 * Check component's content when is is built with invalid data
 */
function testInvalidData(data) {
  // create a FederatedSystemRetievers component
  const { container } = render(<FederatedSystemRetrievers system={data} />);

  // there should be ONLY one <div> element in <body>
  expect(document.querySelectorAll('body *').length).toEqual(1);
  expect(document.body.children[0].nodeName).toEqual('DIV');
}

test(`FederatedSystemRetrievers receives null data `, async () => {
  testInvalidData(null);
});

test(`FederatedSystemRetrievers receives data with NO 'retrievers' `, async () => {
  const data = {};
  testInvalidData(data);
});

test(`FederatedSystemRetrievers receives data with empty 'retrievers' `, async () => {
  const data = { retrievers: [] };
  testInvalidData(data);
});

test(`FederatedSystemRetrievers structure and behavior with valid data' `, async () => {
  let topContainer = null;

  // create a FederatedSystemRetrievers:
  // It is wrapped inside a RuntimedataContextProvider (with a mocked fetch) because it has a inner component (<RuntimedataContextAutoRefreshToggle>) that will use
  // data from the context
  mockFetch(testURL, {});
  await act(async () => {
    const { container } = render(
      <RuntimedataContextProvider>
        <FederatedSystemRetrievers system={systemJson} />
      </RuntimedataContextProvider>
    );
    topContainer = container;
  });

  // check general structure of the component
  expect(screen.getByRole('heading', { name: 'Retrievers' })).toBeDefined();
  const table = screen.getByRole('table', { name: 'array of properties' });
  expect(table).toBeDefined();
  expect(table).toHaveClass('properties-array');

  // there should be an hiddend modal dialog
  const modal = topContainer.querySelector('.cds--modal');
  expect(modal).not.toBeNull();
  expect(modal).not.toHaveClass('is-visible');

  // There are two rows: one for headers, one for data.
  // get the first data row: in systemJson there's only one indexer
  const indexerRow = screen.getAllByRole('row')[1];
  expect(indexerRow).not.toHaveClass('cds--structured-list-row--header-row');

  // simulate click on the data row : it should display the modal dialog
  await act(async () => {
    fireEvent.click(indexerRow);
  });
  expect(modal).toHaveClass('is-visible');

  // simulate modal closing
  const button = screen.getByRole('button', { name: 'close' });
  expect(button).toBeDefined();
  expect(button).toHaveClass('cds--modal-close');
  await act(async () => {
    fireEvent.click(button);
  });
  expect(modal).not.toHaveClass('is-visible');
});
