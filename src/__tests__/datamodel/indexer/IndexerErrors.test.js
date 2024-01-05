/*
 Copyright IBM Corp. 2023
*/

import { render, screen } from '@testing-library/react';
import IndexerErrors from '../../../datamodel/indexer/IndexerErrors';
import indexerJson from './indexers.json';

/**
 * Check existence of inline notification component with role 'status'
 * when the component is built with invalid data
 */
function testInvalidData(data) {
  // create a IndexerErrors
  render(<IndexerErrors indexer={data} />);

  // there should be an inline notification with role 'status' and specific message
  const element = screen.getByRole('status');
  expect(element).toBeDefined();
  expect(element).toHaveTextContent('No error recorded');
}

test(`IndexerErrors receives 'null' data`, async () => {
  testInvalidData(null);
});

test(`IndexerErrors receives 'undefined' data`, async () => {
  testInvalidData(undefined);
});

test(`IndexerErrors receives data with no KPI`, async () => {
  const data = {};
  testInvalidData(data);
});

test(`IndexerErrors receives data with no KPI.errors`, async () => {
  const data = {
    kpi: {},
  };
  testInvalidData(data);
});

test(`IndexerErrors receives data with no KPI.errors.lastCycles`, async () => {
  const data = {
    kpi: {
      errors: {},
    },
  };
  testInvalidData(data);
});

test(`IndexerErrors receives valid data `, async () => {
  // create a IndexerErrors panel from valid json data
  const { container } = render(<IndexerErrors indexer={indexerJson} />);

  // there should be NO inline notification component with role 'status'
  const element = screen.queryByRole('status');
  expect(element).toBeNull();

  // should contains a <div> of class 'indexer-errors' containing, a <Tag> with text 'since start' and a <PropertyArray>
  const parent = container.querySelector('.indexer-errors');
  const tag = container.querySelector('.cds--tag--red');
  const table = screen.getByRole('table', { name: 'array of properties' });

  expect(parent).not.toBeNull();
  expect(tag).not.toBeNull();
  expect(table).toBeDefined();
  expect(table).toHaveClass('properties-array');

  expect(parent).toContainElement(tag);
  expect(parent).toContainElement(table);

  // quick check of table's content
  const cells = screen.getAllByRole('cell');
  expect(cells).toBeDefined();
  expect(cells.length).toEqual(2); //one for cycle start, one for errors
});
