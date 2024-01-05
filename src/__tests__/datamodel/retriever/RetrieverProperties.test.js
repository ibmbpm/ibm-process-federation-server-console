/*
 Copyright IBM Corp. 2023
*/

import { render, screen } from '@testing-library/react';
import { RetrieverProperties } from '../../../datamodel/retriever';
import retrieversJson from './retrievers.json';

/**
 * Check existence of inline notification component with role 'status'
 * when the component is built with invalid data
 */
function testInvalidData(data) {
  // create a RetrieverProperties with given data
  render(<RetrieverProperties retriever={data} />);

  // there should be NO property list
  expect(
    screen.queryByRole('table', { name: 'Structured list section' })
  ).toBeNull();
}

test(`RetrieverProperties component receives 'null' data`, async () => {
  testInvalidData(null);
});

test(`RetrieverProperties component receives 'undefined' data`, async () => {
  testInvalidData(undefined);
});

test(`RetrieverProperties component receives data with retriever.isRunning set to 'false'`, async () => {
  // override data
  retrieversJson.isRunning = false;

  // create a RetrieverProperties
  const { container } = render(
    <RetrieverProperties retriever={retrieversJson} />
  );

  // there should be an inline warning
  const element = screen.queryByRole('status');
  expect(element).not.toBeNull();
  expect(element).toHaveTextContent('This retriever is not running');
});

test(`RetrieverProperties component receives data`, async () => {
  // create a RetrieverProperties
  const { container } = render(
    <RetrieverProperties retriever={retrieversJson} />
  );

  // there should be a property list
  expect(
    screen.getByRole('table', { name: 'Structured list section' })
  ).toBeDefined();

  // check that retriever's properties are displayed
  expect(
    screen.getByRole('row', {
      name: `display id ${retrieversJson['config.displayId']}`.trim(),
    })
  ).toBeDefined();
  expect(
    screen.getByRole('row', {
      name: `internal rest url prefix ${
        retrieversJson.internalRestUrlPrefix
      }`.trim(),
    })
  ).toBeDefined();
  expect(
    screen.getByRole('row', {
      name: `connect timeout ${retrieversJson.connectTimeout} ms`.trim(),
    })
  ).toBeDefined();
  expect(
    screen.getByRole('row', {
      name: `read timeout ${retrieversJson.readTimeout} ms`.trim(),
    })
  ).toBeDefined();
  expect(
    screen.getByRole('row', {
      name: `propagated cookie names ${
        retrieversJson.propagateCookieNames
      }`.trim(),
    })
  ).toBeDefined();
  expect(
    screen.getByRole('row', {
      name: `propagated header names ${
        retrieversJson.propagateHeaderNames
      }`.trim(),
    })
  ).toBeDefined();
  expect(
    screen.getByRole('row', {
      name: `additional headers ${retrieversJson.additionalHeaders}`.trim(),
    })
  ).toBeDefined();
});
