/*
 Copyright IBM Corp. 2023
*/

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DateTime from '../../components/DateTime';

const humandate = '2023-10-31T01:01:01';

test('date year is displayed', async () => {
  render(<DateTime datetime={humandate} />);
  expect(screen.getByText(/2023/i)).toBeInTheDocument();
});

test('date month is displayed', async () => {
  render(<DateTime datetime={humandate} />);
  expect(screen.getByText(/10/i)).toBeInTheDocument();
});

test('date day is displayed', async () => {
  render(<DateTime datetime={humandate} />);
  expect(screen.getByText(/31/i)).toBeInTheDocument();
});

test('date time is displayed', async () => {
  render(<DateTime datetime={humandate} />);
  expect(screen.getByText(/1:01:01 AM/i)).toBeInTheDocument();
});

test('date invalid', async () => {
  render(<DateTime datetime="foo-date" />);
  expect(screen.getByText('Invalid Date')).toBeInTheDocument();
});
