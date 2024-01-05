/*
 Copyright IBM Corp. 2023
*/

import { HttpResponse } from 'msw';

let originalFetch = null;
let useFakeTimers = false;

/**
 * Mocks window.fetch function that returns given data
 *
 * @param {*} mockedURL URL to simulate
 * @param {*} data Data returned by the mocked fetch
 */
export function mockFetch(mockedURL, data) {
  originalFetch = window.fetch;
  window.fetch = function(url) {
    if (url === mockedURL) {
      return data;
    } else {
      return new HttpResponse('Not found', {
        status: 404,
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    }
  };
}

/**
 * Mocks a long runnning fetch
 *
 * @param {*} delay Running time in ms
 * @param {*} data Data returned by the mocked fetch
 */
export function mockWaitingFetch(delay, data) {
  originalFetch = window.fetch;

  // enabling fake timers: c.f https://testing-library.com/docs/using-fake-timers/
  jest.useFakeTimers();
  useFakeTimers = true;

  // a function that simulate a pause, by waiting for a given "delay" in milliseconds
  const fakeLongRunningOperation = async () =>
    new Promise(resolve => setTimeout(() => resolve('success'), delay));

  window.fetch = async function(url) {
    // wait for "delay" milliseconds
    await fakeLongRunningOperation();
    return data;
  };
}

/**
 * Restores the original window.fetch function, and reset real timers
 */
export function restoreFetch() {
  window.fetch = originalFetch;

  // restore real timers, and flush all the pending timers before
  if (useFakeTimers) {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    useFakeTimers = false;
  }
}
