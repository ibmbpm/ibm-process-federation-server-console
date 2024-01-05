/*
 Copyright IBM Corp. 2023
*/

import { act, render, screen } from '@testing-library/react';
import { FederatedSystemInformation } from '../../../datamodel/federatedsystem';
import { mockFetch, restoreFetch } from '../../testutils/mock';
import RuntimedataContextProvider from '../../../contexts/RuntimedataContextProvider';
import systemJson from './system.json';

const testURL = '/pfsconsole/api/v1/cluster/runtimedata';

/**
 * Check component's content when is is built with invalid data
 */
function testInvalidData(data) {
  // create a FederatedSystemIndexers component
  render(<FederatedSystemInformation system={data} />);

  // there should be a text message
  expect(
    screen.getByText('No Federated System information to display')
  ).toBeDefined();
}

afterAll(() => {
  restoreFetch();
});

test(`FederatedSystemInformation receives null data `, async () => {
  testInvalidData(null);
});

test(`FederatedSystemInformation component receives valid data`, async () => {
  let topContainer = null;

  // create a FederatedSystemInformation:
  // It is wrapped inside a RuntimedataContextProvider (with a mocked fetch) because it has a inner component (<RuntimedataContextAutoRefreshToggle>) that will use
  // data from the context
  mockFetch(testURL, {});
  await act(async () => {
    const { container } = render(
      <RuntimedataContextProvider>
        <FederatedSystemInformation system={systemJson} />
      </RuntimedataContextProvider>
    );
    topContainer = container;
  });

  // check general structure
  expect(
    topContainer.querySelector('.federated-system-information')
  ).not.toBeNull();
  expect(
    topContainer.querySelector('.federated-system-information-r1')
  ).not.toBeNull();
  expect(
    topContainer.querySelector('.federated-system-information-r2')
  ).not.toBeNull();
  expect(
    topContainer.querySelector('.federated-system-information-r3')
  ).not.toBeNull();
  expect(
    topContainer.querySelector('.federated-system-information-r4')
  ).not.toBeNull();
});

test(`FederatedSystemInformation component does not display system name`, async () => {
  let topContainer = null;

  // create a FederatedSystemInformation:
  // It is wrapped inside a RuntimedataContextProvider (with a mocked fetch) because it has a inner component (<RuntimedataContextAutoRefreshToggle>) that will use
  // data from the context
  mockFetch(testURL, {});
  await act(async () => {
    const { container } = render(
      <RuntimedataContextProvider>
        <FederatedSystemInformation
          system={systemJson}
          includeSystemName={false}
        />
      </RuntimedataContextProvider>
    );
    topContainer = container;
  });

  // check that element displaying the system name does not exist
  expect(
    topContainer.querySelector('.federated-system-information-r1')
  ).toBeNull();
});
