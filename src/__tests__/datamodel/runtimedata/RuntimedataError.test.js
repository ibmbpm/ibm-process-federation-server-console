/*
 Copyright IBM Corp. 2023
*/

import { render, screen } from '@testing-library/react';
import RuntimeDataError from '../../../datamodel/runtimedata/RuntimedataError';
import runtimedataJSON from './runtimedata.json';

test(`RuntimedataError receives null`, async () => {
  // create a RuntimedataError panel from "null" data
  const { container } = render(<RuntimeDataError data={null} />);

  // there should be a 'No data' title and a message;
  expect(screen.getByRole('heading', { name: 'No data' })).toBeDefined();
  expect(
    screen.getByText(
      'The Process Federation Server did not return data. Contact your administrator'
    )
  ).toBeDefined();
});

test(`RuntimedataError receives undefined data`, async () => {
  // create a RuntimedataError panel from "null" data
  const { container } = render(<RuntimeDataError data={undefined} />);

  // there should be a 'No data' title and a message;
  expect(screen.getByRole('heading', { name: 'No data' })).toBeDefined();
  expect(
    screen.getByText(
      'The Process Federation Server did not return data. Contact your administrator'
    )
  ).toBeDefined();
});

test(`RuntimedataError does not display error when data is valid`, async () => {
  // create a RuntimedataError panel from valid data
  const { container } = render(<RuntimeDataError data={runtimedataJSON} />);

  // should not contain a panel
  expect(container.querySelector('.runtimedata-error-panel')).toBeNull();
});

test(`RuntimedataError displays a generic error`, async () => {
  // create data with error
  const data = { error: 'Error Test' };

  // create a RuntimedataError panel from data with error
  const { container } = render(<RuntimeDataError data={data} />);

  // should contain a panel, a 'Error' heading  and a message equals to the data.error field
  expect(container.querySelector('.runtimedata-error-panel')).not.toBeNull();
  expect(screen.getByRole('heading', { name: 'Error' })).toBeDefined();
  expect(screen.getByText(data.error)).toBeDefined();
});

test(`RuntimedataError displays a server error`, async () => {
  // create data with server error
  const data = {
    error: 'Server error Test',
    errorResponse: {
      status: 500,
      statusText: 'Internal Server Error',
    },
  };

  // create a RuntimedataError panel from data with server error
  const { container } = render(<RuntimeDataError data={data} />);

  // should contain a panel, a 'Server error' heading  and a message
  const msg = `${
    data.errorResponse.statusText
  }. The Process Federation Server did not respond. The URL may be wrong or PFS is down. Check the log files and/or contact your administrator`;
  expect(container.querySelector('.runtimedata-error-panel')).not.toBeNull();
  expect(screen.getByRole('heading', { name: 'Server error' })).toBeDefined();
  expect(screen.getByText(msg)).toBeDefined();
});
