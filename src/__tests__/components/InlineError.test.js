/*
 Copyright IBM Corp. 2023
*/

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import InlineError from '../../components/InlineError';

const title = 'InlineError title';
const subtitle = 'InlineError subtitle';

beforeEach(() => {
  render(<InlineError title={title} subtitle={subtitle} />);
});

test('InlineError is created', async () => {
  // there should be an element with 'status" role
  expect(screen.getByRole('status')).toBeDefined();
});

test('element is an "error"', async () => {
  // there should be an element with 'status" role and 'cds--inline-notification--error' class (that correspond to 'kind' attribute set to "error")
  expect(screen.getByRole('status')).toHaveClass(
    'cds--inline-notification--error'
  );
});

test('title exists', async () => {
  // ensure that an element containing the title text exists
  expect(screen.getByText(title)).toBeDefined();
});

test('subtitle exists', async () => {
  // ensure that an element containing the subtitle text exists
  expect(screen.getByText(subtitle)).toBeDefined();
});

test('error icon exists', async () => {
  // ensure that there is an element containing 'error icon'
  expect(screen.getByTitle('error icon')).toBeDefined();
});
