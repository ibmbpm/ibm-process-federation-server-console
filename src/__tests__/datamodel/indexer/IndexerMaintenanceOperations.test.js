/*
 Copyright IBM Corp. 2023
*/

import { render, screen } from '@testing-library/react';
import IndexerMaintenanceOperations from '../../../datamodel/indexer/IndexerMaintenanceOperations';
import indexerJson from './indexers.json';

/**
 * Check existence of inline notification component with role 'status'
 * when the component is built with invalid data
 */
function testInvalidData(data) {
  // create a IndexerMaintenanceOperations with given data
  render(<IndexerMaintenanceOperations indexer={data} />);

  // there should be NO property array
  expect(
    screen.queryByRole('table', { name: 'array of properties' })
  ).toBeNull();
}

test(`IndexerMaintenanceOperations component receives 'null' data`, async () => {
  testInvalidData(null);
});

test(`IndexerMaintenanceOperations component receives 'undefined' data`, async () => {
  testInvalidData(undefined);
});

test(`IndexerMaintenanceOperations component receives data with no 'maintenanceOperations`, async () => {
  const data = {};
  testInvalidData(data);
});

test(`IndexerMaintenanceOperations component receives data`, async () => {
  // create a IndexerMaintenanceOperations
  const { container } = render(
    <IndexerMaintenanceOperations indexer={indexerJson} />
  );

  // should contain a array of properties: an element with role 'table' and name 'array of properties'
  expect(
    screen.getByRole('table', { name: 'array of properties' })
  ).toBeDefined();

  // there should be 2 row groups: one for headers, one for content
  const rowgroups = screen.getAllByRole('rowgroup');
  expect(rowgroups).toBeDefined();
  expect(rowgroups.length).toEqual(2);

  // check table headers
  var headers = [
    '',
    'Frequency',
    'Count',
    'Average Duration',
    'Next scheduled time',
  ];
  const headerElements = screen.getAllByRole('columnheader');
  expect(headerElements).toBeDefined();
  expect(Array.isArray(headerElements)).toBeTruthy();
  expect(headerElements.length).toEqual(headers.length);

  // check rows: as many as maintenance operation + 1 for headers
  const rows = screen.getAllByRole('row');
  expect(rows).toBeDefined();
  expect(rows.length).toEqual(
    Object.keys(indexerJson.maintenanceOperations).length + 1
  );

  // TODO: perhaps, test some content of the table
});
