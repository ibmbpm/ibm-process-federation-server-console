/*
 Copyright IBM Corp. 2023
*/

import { render, screen } from '@testing-library/react';
import FederatedDataRepositoryName from '../../../datamodel/federateddatarepository/FederatedDataRepositoryName';

test(`FederatedDataRepositoryName receives valid data for available federated data repository`, async () => {
  const fdr = {
    isAvailable: true,
    vendor: 'TEST_VENDOR',
    version: 'TEST_VERSION_1',
  };

  // create a FederatedSystemName component from valid json data
  const { container } = render(
    <FederatedDataRepositoryName federatedDataRepository={fdr} />
  );

  // check structure
  expect(container.querySelector('.federated-data-repository')).not.toBeNull();
  expect(container.querySelector('.name')).not.toBeNull();

  // check that a text containing vendor and version, as created by FederatedDataRepositoryName, exists
  const textToCheck = `${fdr.vendor} ${fdr.version}`;
  expect(screen.getByText(textToCheck)).toBeDefined();
});

test(`FederatedDataRepositoryName receives valid data for NOT available federated data repository`, async () => {
  const fdr = {
    isAvailable: false,
    vendor: 'TEST_VENDOR',
    version: 'TEST_VERSION_1',
    communicationException: 'TEST_COMMUNICATION_EXCEPTION',
  };

  // create a FederatedSystemName component from valid json data
  const { container } = render(
    <FederatedDataRepositoryName federatedDataRepository={fdr} />
  );

  // there should be a 'status' element , and a text with the exception description
  expect(screen.getByRole('status')).toBeDefined();
  const errorDetails = `(${fdr.communicationException})`;
  expect(screen.getByText(errorDetails, { exact: false })).toBeDefined();
});
