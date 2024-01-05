/*
 Copyright IBM Corp. 2023
*/

import { render, screen } from '@testing-library/react';
import FederatedDataRepositoryProperties from '../../../datamodel/federateddatarepository/FederatedDataRepositoryProperties';

/**
 * Check component's content when is is built with invalid data
 */
function testInvalidData(data) {
  // create a FederatedSystemIndexers component
  render(<FederatedDataRepositoryProperties federateddatarepository={data} />);

  // there should be a 'status' element
  expect(screen.getByRole('status')).toBeDefined();
  expect(screen.getByText('NO AVAILABLE INFORMATION')).toBeDefined();
}

test(`FederatedDataRepositoryProperties receives null data `, async () => {
  testInvalidData(null);
});

test(`FederatedDataRepositoryName receives valid data for available federated data repository`, async () => {
  const fdr = {
    endpoints: 'endpoint1,endpoint2,endpoint3',
    clusterName: 'TEST°CLUSTER°NAME',
    clusterUUID: 'TEST_CLUSTER_UUID',
    indexPrefix: 'TEST_INDEX_PREFIX',
  };

  // create a FederatedDataRepositoryProperties component from valid json data
  const { container } = render(
    <FederatedDataRepositoryProperties federatedDataRepository={fdr} />
  );
  // check structure
  expect(
    screen.getByRole('table', { name: 'Structured list section' })
  ).toBeDefined();

  //***** quick content check
  // check endpoints
  const enpointArray = fdr.endpoints.split(',');
  enpointArray.forEach(endpoint => {
    expect(screen.getByRole('link', { name: endpoint })).toBeDefined();
  });
  // there should be a 'row' elements with specific names made of property name + property value
  expect(
    screen.getByRole('row', {
      name: `endpoints ${enpointArray.join(' ')}`.trim(),
    })
  ).toBeDefined;
  expect(
    screen.getByRole('row', { name: `cluster name ${fdr.clusterName}`.trim() })
  ).toBeDefined;
  expect(
    screen.getByRole('row', { name: `cluster uuid ${fdr.clusterUUID}`.trim() })
  ).toBeDefined;
  expect(
    screen.getByRole('row', { name: `index prefix ${fdr.indexPrefix}`.trim() })
  ).toBeDefined;
});
