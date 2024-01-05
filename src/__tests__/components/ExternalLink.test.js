/*
 Copyright IBM Corp. 2023
*/

import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ExternalLink from '../../components/ExternalLink/ExternalLink';

const url = 'http://www.ibm.com';
const linktext = 'Text link';

test('link creation', async () => {
  render(<ExternalLink href={url}>{linktext}</ExternalLink>);

  // ensure that there is an element with role 'link' and given text
  expect(screen.getByRole('link', { name: linktext })).toBeDefined();
});

test('link href is correct', async () => {
  render(<ExternalLink href={url}>{linktext}</ExternalLink>);

  // the link should have a 'href' attribute set to the given url
  expect(screen.getByRole('link')).toHaveAttribute('href', url);
});

test('link target is _blank', async () => {
  render(<ExternalLink href={url}>{linktext}</ExternalLink>);

  // the link should have a 'target' attribute set '_blank'
  expect(screen.getByRole('link')).toHaveAttribute('target', '_blank');
});

test('link has icon', async () => {
  const { container } = render(
    <ExternalLink href={url}>{linktext}</ExternalLink>
  );

  // ensure that there is a element with css class 'external-link-launch-icon'
  const icon = container.querySelector('.external-link-launch-icon');
  expect(icon).not.toBeNull();
});

test('link with no href', async () => {
  // create link without href
  const { container } = render(<ExternalLink>no href link</ExternalLink>);

  // no element should have role 'link'
  expect(screen.queryByRole('link')).toBeNull();

  // ensure that there is NO element corresponding to an icon
  const icon = container.querySelector('.external-link-launch-icon');
  expect(icon).toBeNull();
});
