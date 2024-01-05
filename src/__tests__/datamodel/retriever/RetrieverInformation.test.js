/*
 Copyright IBM Corp. 2023
*/

import { render, screen } from '@testing-library/react';
import { RetrieverInformation } from '../../../datamodel/retriever';
import retrieversJson from './retrievers.json';

test(`RetrieverInformation component receives data`, async () => {
  // create a RetrieverInformation component
  const { container } = render(
    <RetrieverInformation retriever={retrieversJson} />
  );

  // there should be a tab list, containing 4 tabs
  expect(screen.getByRole('tablist')).toBeDefined();
  expect(screen.getByRole('tab', { name: 'KPI' })).toBeDefined();
  expect(
    screen.getByRole('tab', { name: 'Last REST API Calls' })
  ).toBeDefined();
  expect(screen.getByRole('tab', { name: 'Errors' })).toBeDefined();
  expect(screen.getByRole('tab', { name: 'Properties' })).toBeDefined();

  // check that subcomponents are created
  expect(container.querySelector('.retriever-kpi')).not.toBeNull(); // component RetrieverKPI
  expect(container.querySelector('.retriever-last-calls')).not.toBeNull(); // component RetrieverLastRestAPICalls
  expect(container.querySelector('.retriever-errors')).not.toBeNull(); // component RetrieverErrors
});
