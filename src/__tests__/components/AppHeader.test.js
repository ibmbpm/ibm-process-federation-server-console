/*
 Copyright IBM Corp. 2023
*/

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AppHeader from '../../components/AppHeader/AppHeader';
import { HashRouter as Router } from 'react-router-dom';

beforeEach(() => {
  render(
    <Router>
      <AppHeader />
    </Router>
  );
});

test('AppHeader is created and contains a "banner" ', async () => {
  // if creation succeed a component with role 'banner' should exist
  expect(screen.getByRole('banner')).toBeDefined();
});

test('AppHeader contains a link to homepage', async () => {
  // should contain a link to the homepage
  const link = screen.getByRole('link', {
    name: 'IBM Process Federation Server',
  });
  expect(link).toBeDefined();
  expect(link).toHaveAttribute('href', '#/');
});

test('AppHeader contains links to Monitoring page', async () => {
  // should contain two links to 'Monitoring page : one in the header, one in the side menu
  const links = screen.getAllByRole('link', { name: 'Monitoring' });
  expect(links).toBeDefined();
  expect(links.length).toBe(2);
  expect(links[0]).toHaveAttribute('href', '#/monitoring');
  expect(links[1]).toHaveAttribute('href', '/monitoring');
});
