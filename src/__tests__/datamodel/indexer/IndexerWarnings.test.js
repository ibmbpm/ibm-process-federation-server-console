/*
 Copyright IBM Corp. 2023
*/

import { render, screen } from '@testing-library/react';
import indexerJson from './indexers.json';
import { IndexerWarnings } from '../../../datamodel/indexer';

/**
 * Check existence of inline notification component with role 'status'
 * when the component is built with invalid data
 */
function testInvalidData(data) {
  // create a IndexerWarnings
  render(<IndexerWarnings indexer={data} />);

  // there should be an inline notification with role 'status' and specific message
  const element = screen.getByRole('status');
  expect(element).toBeDefined();
  expect(element).toHaveTextContent('No Warning recorded');
}

test(`IndexerWarnings receives 'null' data`, async () => {
  testInvalidData(null);
});

test(`IndexerWarnings receives 'undefined' data`, async () => {
  testInvalidData(undefined);
});

test(`IndexerWarnings receives data with no 'kpi'`, async () => {
  const data = {};
  testInvalidData(data);
});

test(`IndexerWarnings receives data with no 'kpi.warnings'`, async () => {
  const data = {
    kpi: {},
  };
  testInvalidData(data);
});

test(`IndexerWarnings receives data with no 'kpi.warnings.lastCycles'`, async () => {
  const data = {
    kpi: {
      warnings: {},
    },
  };
  testInvalidData(data);
});

test(`IndexerWarnings receives valid data `, async () => {
  // create a IndexerErrors panel from valid json data
  const { container } = render(<IndexerWarnings indexer={indexerJson} />);

  // there should be NO inline notification component with role 'status'
  const element = screen.queryByRole('status');
  expect(element).toBeNull();

  // should contains a <div> of class 'indexer-warnings' containing, a <Tag> with text 'since start' and a <PropertyArray>
  const parent = container.querySelector('.indexer-warnings');
  const tag = container.querySelector('.cds--tag--gray');
  const table = screen.getByRole('table', { name: 'array of properties' });

  expect(parent).not.toBeNull();
  expect(tag).not.toBeNull();
  expect(table).toBeDefined();
  expect(table).toHaveClass('properties-array');

  expect(parent).toContainElement(tag);
  expect(parent).toContainElement(table);
});
