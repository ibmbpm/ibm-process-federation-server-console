/*
 Copyright IBM Corp. 2023
*/

import { render, screen } from '@testing-library/react';
import indexerJson from './indexers.json';
import IndexerLastCycles from '../../../datamodel/indexer/IndexerLastCycles';

/**
 * Check existence of inline notification component with role 'status'
 * when the component is built with invalid data
 */
function testInvalidData(data) {
  // create a IndexerLastCycles
  render(<IndexerLastCycles indexer={data} />);

  // there should be an inline notification with role 'status' and specific message
  const element = screen.getByRole('status');
  expect(element).toBeDefined();
  expect(element).toHaveTextContent('No Last Cycles recorded');
}

test(`IndexerLastCycles receives 'null' data`, async () => {
  testInvalidData(null);
});

test(`IndexerLastCycles receives 'undefined' data`, async () => {
  testInvalidData(undefined);
});

test(`IndexerLastCycles receives data with no 'kpi'`, async () => {
  const data = {};
  testInvalidData(data);
});

test(`IndexerLastCycles receives data with no 'kpi.lastCycles'`, async () => {
  const data = {
    kpi: {},
  };
  testInvalidData(data);
});

test(`IndexerLastCycles receives data with empty 'kpi.lastCycles' array`, async () => {
  const data = {
    kpi: {
      lastCycles: [],
    },
  };
  testInvalidData(data);
});

test(`IndexerLastCycles component receives data`, async () => {
  // create a IndexerLastCycles
  const { container } = render(<IndexerLastCycles indexer={indexerJson} />);

  // // should contain an element with role 'indexer-last-cycles'
  expect(container.querySelector('.indexer-last-cycles')).not.toBeNull();

  // should contain a array of properties: an element with role 'table' and name 'array of properties'
  expect(
    screen.getByRole('table', { name: 'array of properties' })
  ).toBeDefined();

  // TODO: perhaps, test some content of the table
});
