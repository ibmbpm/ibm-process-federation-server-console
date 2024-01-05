/*
 Copyright IBM Corp. 2023
*/

import { render, screen } from '@testing-library/react';
import { RetrieverKPI } from '../../../datamodel/retriever';
import retrieversJson from './retrievers.json';

/**
 * Check existence of inline notification component with role 'status'
 * when the component is built with invalid data
 */
function testInvalidData(data) {
  // create a RetrieverKPI with given data
  render(<RetrieverKPI retriever={data} />);

  // there should be a inline warning with role 'status' and specific message
  const element = screen.getByRole('status');
  expect(element).toBeDefined();
  expect(element).toHaveTextContent('No KPI available.');
}

test(`RetrieverKPI component receives 'null' data`, async () => {
  testInvalidData(null);
});

test(`RetrieverKPI component receives data without kpi`, async () => {
  const data = {};
  testInvalidData(null);
});

test(`RetrieverKPI component receives data`, async () => {
  // create a RetrieverKPI
  const { container } = render(<RetrieverKPI retriever={retrieversJson} />);

  // should contain a <div> with class 'retriever-kpi'
  expect(container.querySelector('.retriever-kpi')).not.toBeNull();

  // should contain two elements with role 'table'
  expect(
    screen.getByRole('table', { name: 'Structured list section' })
  ).toBeDefined();
  expect(
    screen.getByRole('table', { name: 'array of properties' })
  ).toBeDefined();
});
