/*
 Copyright IBM Corp. 2023
*/

import { render, screen } from '@testing-library/react';
import { RetrieverErrors } from '../../../datamodel/retriever';
import retrieversJson from './retrievers.json';

/**
 * Check existence of inline notification component with role 'status'
 * when the component is built with invalid data
 */
function testInvalidData(data) {
  // create a RetrieverErrors
  render(<RetrieverErrors retriever={data} />);

  // there should be an inline notification with role 'status' and specific message
  const element = screen.getByRole('status');
  expect(element).toBeDefined();
  expect(element).toHaveTextContent('No error recorded');
}

test(`RetrieverError receives 'null' data`, async () => {
  testInvalidData(null);
});

test(`RetrieverError receives 'undefined' data`, async () => {
  testInvalidData(undefined);
});

test(`RetrieverError receives data with no KPI`, async () => {
  const data = {};
  testInvalidData(data);
});

test(`RetrieverError receives data with no KPI.errors`, async () => {
  const data = {
    kpi: {},
  };
  testInvalidData(data);
});

test(`RetrieverError receives data with no KPI.errors.lastRestAPICallsWithError`, async () => {
  const data = {
    kpi: {
      errors: {},
    },
  };
  testInvalidData(data);
});

test(`RetrieverError receives valid data `, async () => {
  // create a RetrieverErrors panel from valid json data
  const { container } = render(<RetrieverErrors retriever={retrieversJson} />);

  // there should be NO inline notification component with role 'status'
  const element = screen.queryByRole('status');
  expect(element).toBeNull();

  // should contains a <div> of class 'retriever-errors' containing, a <Tag> with text 'since start' and a <PropertyArray>
  const parent = container.querySelector('.retriever-errors');
  const tag = container.querySelector('.cds--tag--red');
  const table = screen.getByRole('table', { name: 'array of properties' });

  expect(parent).not.toBeNull();
  expect(tag).not.toBeNull();
  expect(table).toBeDefined();
  expect(table).toHaveClass(' properties-array');

  expect(parent).toContainElement(tag);
  expect(parent).toContainElement(table);

  // quick check of table's content
  const cells = screen.getAllByRole('cell');
  expect(cells).toBeDefined();
  expect(cells.length).toEqual(6);

  // check non-computed cell's contents
  expect(screen.getByRole('cell', { name: 'TYPE' })).toBeDefined();
  expect(screen.getByRole('cell', { name: 'PATH' })).toBeDefined();
  expect(screen.getByRole('cell', { name: 'USER' })).toBeDefined();
  expect(screen.getByRole('cell', { name: 'STATUS' })).toBeDefined();
});
