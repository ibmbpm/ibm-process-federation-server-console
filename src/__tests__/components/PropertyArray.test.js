/*
 Copyright IBM Corp. 2023
*/

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PropertiesArray from '../../components/PropertiesArray';

const title = 'People';
const headers = ['id', 'gender', 'first name', 'last name'];
const rows = [
  ['id1', ['id1', 'male', 'John', 'Doe']],
  ['id2', ['id2', 'female', 'Jane', 'Doe']],
];

beforeEach(() => {
  render(<PropertiesArray title={title} headers={headers} rows={rows} />);
});

test('PropertyList is created', async () => {
  expect(screen.getByRole('table')).toBeDefined();
});

test('heading exists', async () => {
  // there should be an element with role 'heading' and corresponding text
  expect(screen.getByRole('heading', { name: title })).toBeDefined();
});

test('rows are correctly created', async () => {
  // there should be 2 elements with role set to 'rowgroup': one for the header, one for the body
  const rowGroup = screen.getAllByRole('rowgroup');
  expect(rowGroup).toBeDefined();
  expect(rowGroup.length).toBe(2);
});

test('headers are correctly created', async () => {
  // check that there is as many 'columnheader' as header array items
  const columnHeaders = screen.getAllByRole('columnheader');
  expect(columnHeaders).toBeDefined();
  expect(columnHeaders.length).toBe(headers.length);
});

test('cells are correctly created', async () => {
  const allCells = screen.getAllByRole('cell');
  expect(allCells).toBeDefined();
  expect(allCells.length).toBe(8);
});
