/*
 Copyright IBM Corp. 2023
*/

import { render, screen } from '@testing-library/react';
import { IndexerProperties } from '../../../datamodel/indexer';
import indexerJson from './indexers.json';

/**
 * Check existence of inline notification component with role 'status'
 * when the component is built with invalid data
 */
function testInvalidData(data) {
  // create a IndexerProperties with given data
  render(<IndexerProperties indexer={data} />);

  // there should be NO property list
  expect(
    screen.queryByRole('table', { name: 'Structured list section' })
  ).toBeNull();
}

test(`IndexerProperties component receives 'null' data`, async () => {
  testInvalidData(null);
});

test(`IndexerProperties component receives 'undefined' data`, async () => {
  testInvalidData(undefined);
});

test(`IndexerProperties component receives data with indexer.isRunning set to 'false'`, async () => {
  // override data
  indexerJson.isRunning = false;

  // create a RetrieverProperties
  const { container } = render(<IndexerProperties indexer={indexerJson} />);

  // there should be an inline warning
  const element = screen.queryByRole('status');
  expect(element).not.toBeNull();
  expect(element).toHaveTextContent(
    'Only configuration properties are available when the indexer is not running'
  );
});

test(`IndexerProperties component receives data`, async () => {
  // create a IndexerProperties
  const { container } = render(<IndexerProperties indexer={indexerJson} />);

  // there should be a property list
  expect(
    screen.getByRole('table', { name: 'Structured list section' })
  ).toBeDefined();

  // create a list of properties and check that there's a 'row' for each of them
  const properties = {
    type: indexerJson.type,
    'display id': indexerJson['config.displayId'],
    id: indexerJson.id,
    'server timezone': indexerJson.bpdServerTimezone,
    'indexing interval (ms)': indexerJson.indexingInterval,
    // 'partition range': <IndexerPartitionRange indexer={indexerJson} />,   // value depends on IndexerPartitionRange component
    'database schema': indexerJson.schemaName,
    'consumer column':
      indexerJson.database && indexerJson.database.consumerColumn,
    'database driver name':
      indexerJson.database && indexerJson.database.driverName,
    'database driver version':
      indexerJson.database && indexerJson.database.driverVersion,
  };
  for (const property in properties) {
    expect(
      screen.getByRole('row', {
        name: `${property} ${properties[property]}`.trim(),
      })
    );
  }
});
