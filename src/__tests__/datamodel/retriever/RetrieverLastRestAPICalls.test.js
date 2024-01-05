/*
 Copyright IBM Corp. 2023
*/

import { render, screen } from '@testing-library/react';
import { RetrieverLastRestAPICalls } from '../../../datamodel/retriever';
import retrieversJson from './retrievers.json';

/**
 * Check existence of inline notification component with role 'status'
 * when the component is built with invalid data
 */
function testInvalidData(data) {
  // create a RetrieverLastRestAPICalls with given data
  render(<RetrieverLastRestAPICalls retriever={data} />);

  // there should be an inline warning
  const element = screen.queryByRole('status');
  expect(element).not.toBeNull();
  expect(element).toHaveTextContent('No REST API calls recorded');
}

test(`RetrieverLastRestAPICalls component receives 'null' data`, async () => {
  testInvalidData(null);
});

test(`RetrieverLastRestAPICalls component receives 'undefined' data`, async () => {
  testInvalidData(undefined);
});

test(`RetrieverLastRestAPICalls component receives missing 'kpi' data`, async () => {
  // retriever's data with missing 'kpi' info should result in displaying an inline warning
  testInvalidData({});
});

test(`RetrieverLastRestAPICalls component receives missing 'kpi' data`, async () => {
  // retriever's data with empty 'kpi' should result in displaying an inline warning
  testInvalidData({ kpi: {} });
});

test(`RetrieverLastRestAPICalls component receives empty 'kpi.lastRestAPICalls' data array`, async () => {
  // retriever's data with empty 'kpi.lastRestAPICalls' should result in displaying an inline warning
  testInvalidData({ kpi: { lastRestAPICalls: [] } });
});

test(`RetrieverLastRestAPICalls component receives data`, async () => {
  // create a RetrieverLastRestAPICalls
  const { container } = render(
    <RetrieverLastRestAPICalls retriever={retrieversJson} />
  );

  // check structure: a <div> with class 'retriever-last-calls' containing a array of property
  const div = container.querySelector('.retriever-last-calls');
  const array = screen.getByRole('table', { name: 'array of properties' });
  expect(div).not.toBeNull();
  expect(array).toBeDefined();
  expect(div).toContainElement(array);
});
