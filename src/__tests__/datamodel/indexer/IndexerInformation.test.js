/*
 Copyright IBM Corp. 2023
*/

import { render, screen } from '@testing-library/react';
import indexerJson from './indexers.json';
import { IndexerInformation } from '../../../datamodel/indexer';

test(`IndexerInformation component receives data`, async () => {
  // create a IndexerInformation component
  const { container } = render(<IndexerInformation indexer={indexerJson} />);

  // there should be a tab list, containing 4 tabs
  expect(screen.getByRole('tablist')).toBeDefined();
  expect(screen.getByRole('tab', { name: 'KPI' })).toBeDefined();
  expect(screen.getByRole('tab', { name: 'Last Cycles' })).toBeDefined();
  expect(screen.getByRole('tab', { name: 'Errors' })).toBeDefined();
  expect(screen.getByRole('tab', { name: 'Warnings' })).toBeDefined();
  expect(
    screen.getByRole('tab', { name: 'Maintenance Operations' })
  ).toBeDefined();
  expect(screen.getByRole('tab', { name: 'Properties' })).toBeDefined();

  // check that some subcomponents are created
  // NOTE: expect(container.querySelector('KPI')).not.toBeNull(); // --> component IndexerKPI has no specific element/id/field/text/ to allow quick and easy indentification
  expect(container.querySelector('.indexer-last-cycles')).not.toBeNull(); // component IndexerLastCyclces
  expect(container.querySelector('.indexer-errors')).not.toBeNull(); // component IndexerErrors
  expect(container.querySelector('.indexer-warnings')).not.toBeNull(); // component IndexerWarnings
  // NOTE: expect(container.querySelector('.MAINTENANCEOPS')).not.toBeNull(); //--> component IndexerMaintenanceOperations has no specific element/id/field/text/ to allow quick and easy indentification
  // NOTE: expect(container.querySelector('.PROPERTIES')).not.toBeNull(); //--> component IndexerProperties has no specific element/id/field/text/ to allow quick and easy indentification
});
