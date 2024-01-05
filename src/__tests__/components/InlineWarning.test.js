/*
 Copyright IBM Corp. 2023
*/

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import InlineWarning from '../../components/InlineWarning';

const title = 'InlineWarning title';
const subtitle = 'InlineWarning subtitle';

beforeEach(() => {
  render(<InlineWarning title={title} subtitle={subtitle} />);
});

test('InlineWarning is created', async () => {
  // there should be an element with 'status" role
  expect(screen.getByRole('status')).toBeDefined();
});

test('element is a "warning"', async () => {
  // there should be an element with 'status" role and 'cds--inline-notification--warning' class (that correspond to 'kind' attribute set to "warning")
  expect(screen.getByRole('status')).toHaveClass(
    'cds--inline-notification--warning'
  );
});

test('title exists', async () => {
  //ensure that an element containing the title text exists
  expect(screen.getByText(title)).toBeDefined();
});

test('subtitle exists', async () => {
  // ensure that an element containing the subtitle text exists
  expect(screen.getByText(subtitle)).toBeDefined();
});

test('warning icon exists', async () => {
  // ensure that there is an element containing 'error icon'
  expect(screen.getByTitle('warning icon')).toBeDefined();
});
