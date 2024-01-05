/*
 Copyright IBM Corp. 2023
*/

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PropertiesList from '../../components/PropertiesList';

const title = 'PropertyList title';
const properties = { key1: 'value1', key2: 'value2' };

beforeEach(() => {
  render(<PropertiesList title={title} properties={properties} />);
});

test('PropertyList is created', async () => {
  // there should be an element with role 'table'
  expect(screen.getByRole('table')).toBeDefined();
});

test('heading exists', async () => {
  // there should be an element with role 'heading'
  expect(screen.getByRole('heading', { name: title })).toBeDefined();
});

test('rows are created', async () => {
  // there should be one 'rowgroup' that contains the list
  expect(screen.getByRole('rowgroup')).toBeDefined();
});

test('rows match the given data', async () => {
  // test rows in the list. There should be one row per data key
  const allRows = screen.getAllByRole('row');
  expect(allRows).toBeDefined();
  expect(allRows.length).toBe(Object.keys(properties).length);
});

test('cells match the given data', async () => {
  // test cells. number of cells should be equal to number of data's keys plus data's value
  const allCells = screen.getAllByRole('cell');
  expect(allCells).toBeDefined();
  expect(allCells.length).toBe(
    Object.keys(properties).length + Object.values(properties).length
  );
});
