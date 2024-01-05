/*
 Copyright IBM Corp. 2023
*/

// import API mocking utilities from Mock Service Worker
import { act, render, screen, waitFor } from '@testing-library/react';
import { HttpResponse } from 'msw';
import RuntimedataContextProvider, {
  RuntimedataContext,
} from '../../contexts/RuntimedataContextProvider';
import { useContext } from 'react';

import runtimedataJSON from './runtimedata.json';
import { mockFetch, mockWaitingFetch, restoreFetch } from '../testutils/mock';
const testURL = '/pfsconsole/api/v1/cluster/runtimedata';

/**
 * This is a basic React/Carbon component that gets its data from a the runtimedata context
 * and display some.
 */
function RuntimeDataFetchTestComponent() {
  // use context to get runtimedata
  const { runtimedata, autoRefreshEnabled, loadingRuntimedata } = useContext(
    RuntimedataContext
  );

  return (
    <>
      <h3>autorefresh: {autoRefreshEnabled.toString()}</h3>
      <h3>loadingRuntimedata: {loadingRuntimedata.toString()}</h3>

      {runtimedata ? (
        runtimedata.error ? (
          <h3>Runtimedata error</h3>
        ) : (
          <>
            <h3>status: {runtimedata.status}</h3>
            <h3>statusMessage: {runtimedata.statusMessage}</h3>
          </>
        )
      ) : (
        <h3>"No Data"</h3>
      )}
    </>
  );
}

afterAll(() => {
  restoreFetch();
});

test(`RuntimedataContextProvider gets data from ${testURL} API and provides it to a React component`, async () => {
  mockFetch(testURL, HttpResponse.json(runtimedataJSON));

  // create a context provider that gets/provides data to a component
  await act(async () =>
    render(
      <RuntimedataContextProvider>
        <RuntimeDataFetchTestComponent />
      </RuntimedataContextProvider>
    )
  );

  // runtimedatacontext should provide a autorefresh flag set to "false" by default
  expect(
    screen.getByRole('heading', { name: 'autorefresh: false' })
  ).toBeDefined();

  // runtimedatacontext should provide a loadingRuntimedata flag set to "false" when it has finished to fetch remote data
  expect(
    screen.getByRole('heading', { name: 'loadingRuntimedata: false' })
  ).toBeDefined();

  // there should be existing and valid data
  expect(screen.queryByRole('heading', { name: 'No Data' })).toBeNull();
  expect(screen.getByRole('heading', { name: 'status: 200' })).toBeDefined();
  expect(
    screen.getByRole('heading', { name: 'statusMessage: OK' })
  ).toBeDefined();
});

test(`RuntimedataContextProvider gets data with error from ${testURL} API and provides it to a React component`, async () => {
  mockFetch(testURL, HttpResponse.json({ error: 'Runtimedata error' }));

  // create a context provider that gets/provides data to a component
  await act(async () =>
    render(
      <RuntimedataContextProvider>
        <RuntimeDataFetchTestComponent />
      </RuntimedataContextProvider>
    )
  );

  expect(
    screen.queryByRole('heading', { name: 'Runtimedata error' })
  ).toBeDefined();
});

test('RuntimedataContextProvider waiting a long running fetch to end', async () => {
  const DELAY = 5000;

  // mock the fetch method to simulate a long running fetch that returns data after 5000 milliseconds
  mockWaitingFetch(DELAY, HttpResponse.json(runtimedataJSON));

  // create a context provider that gets/provides data to a component
  await act(async () =>
    render(
      <RuntimedataContextProvider>
        <RuntimeDataFetchTestComponent />
      </RuntimedataContextProvider>
    )
  );

  // the loadingRuntimedata flag of the context should be true while the fetch is hat not yet finished
  expect(
    screen.getByRole('heading', { name: 'loadingRuntimedata: true' })
  ).toBeDefined();

  // advance in time to allow mocked fetch to return data, then context's loadingRuntimedata will be set to false and the UI elements of RuntimeDataFetchTestComponent will be updated
  jest.advanceTimersByTime(DELAY);
  await screen.findByText('loadingRuntimedata: false');
});
