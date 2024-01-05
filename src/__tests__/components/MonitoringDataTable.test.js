/*
 Copyright IBM Corp. 2023
*/

import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MonitoringDataTable from '../../components/MonitoringDataTable';

const title = 'MonitoringDataTable Title';
const description = 'MonitoringDataTable description';
const headers = [
  {
    key: 'header1',
    header: 'Header 1',
  },
  {
    key: 'header2',
    header: 'Header 2',
  },
  {
    key: 'header3',
    header: 'Header 3',
  },
];
const rows = [
  {
    id: 'row1',
    header1: 'Content 1',
    header2: 'Content 2',
    header3: 'Content 3',
    expandedContent: 'Expanded Content',
  },
];

const handleClickExpand = jest.fn();
let container;

beforeEach(() => {
  const res = render(
    <MonitoringDataTable
      title={title}
      description={description}
      headers={headers}
      rows={rows}
      expandHandler={handleClickExpand}
    />
  );
  container = res.container;
});

test('MonitoringDataTable is created', async () => {
  // an element with role 'table' should exist
  expect(screen.getByRole('table')).toBeDefined();
});

test('heading exist', async () => {
  // an element with role 'heading' and containing the title text should exist
  expect(screen.getByRole('heading', { name: title })).toBeDefined();
});

test('row group is correctly created to contain headers and body', async () => {
  // there should be two 'rowgroup' elements: one for the header , one for the body (content + expanded content)
  const rowGroup = screen.getAllByRole('rowgroup');
  expect(rowGroup).toBeDefined();
  expect(rowGroup.length).toBe(2);
});

test('rows are correctly created', async () => {
  // should contain 3 rows: headers, content, expanded content
  const rows = screen.getAllByRole('row');
  expect(rows).toBeDefined();
  expect(rows.length).toBe(3);
});

test('column headers are correctly created', async () => {
  // one header for the expand button: an element with class ".cds--table-expand" should exist
  const expandheader = container.querySelector('.cds--table-expand');
  expect(expandheader).not.toBeNull();

  // other headers: there should be a 'columnheader' element for each item of the header array
  headers.forEach(item => {
    expect(
      screen.getByRole('columnheader', { name: item.header })
    ).toBeDefined();
  });
});

test('cells are correctly created', async () => {
  // there should be 5 cells : one for expand button, one per row's content, including expanded content
  const allCells = screen.getAllByRole('cell');
  expect(allCells).toBeDefined();
  expect(allCells.length).toBe(5);
});

test('click on expand button trigger the expandHandler', async () => {
  const btn = screen.getByRole('button', { name: 'Expand current row' });
  expect(btn).toBeDefined();
  fireEvent.click(btn);
  expect(handleClickExpand).toHaveBeenCalledTimes(1);
});
