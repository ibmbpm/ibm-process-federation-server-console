/*
 Copyright IBM Corp. 2023
*/

import { render, screen } from '@testing-library/react';
import indexerJson from './indexers.json';
import IndexerPartitionRange from '../../../datamodel/indexer/IndexerPartitionRange';

/**
 * Check existence of inline notification component with role 'status'
 * when the component is built with invalid data
 */
function testInvalidData(data) {
  // create a IndexerPartitionRange
  render(<IndexerPartitionRange indexer={data} />);

  // there should be a default text '? - ?'
  const element = screen.getByText('? - ?');
  expect(element).toBeDefined();
}

test(`IndexerPartitionRange receives 'null' data`, async () => {
  testInvalidData(null);
});

test(`IndexerPartitionRange receives 'undefined' data`, async () => {
  testInvalidData(undefined);
});

test(`IndexerPartitionRange receives data with no 'partition'`, async () => {
  const data = {};
  testInvalidData(data);
});

test(`IndexerPartitionRange component receives data`, async () => {
  // create a IndexerPartitionRange
  const { container } = render(<IndexerPartitionRange indexer={indexerJson} />);

  // check that a correct partion range is displayed in the component
  const partitionRange =
    indexerJson.partition.min + ' - ' + indexerJson.partition.max;
  expect(screen.getByText(partitionRange)).toBeDefined();
});
