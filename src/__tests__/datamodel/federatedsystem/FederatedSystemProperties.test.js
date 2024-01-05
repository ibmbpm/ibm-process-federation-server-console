/*
 Copyright IBM Corp. 2023
*/

import { render, screen } from '@testing-library/react';
import { FederatedSystemProperties } from '../../../datamodel/federatedsystem';

import systemJson from './system.json';

/**
 * Check component's content when is is built with invalid data
 */
function testInvalidData(data) {
  // create a FederatedSystemProperties component
  const { container } = render(<FederatedSystemProperties system={data} />);

  // there should be ONLY one <div> element in <body>
  expect(document.querySelectorAll('body *').length).toEqual(1);
  expect(document.body.children[0].nodeName).toEqual('DIV');
}

test(`FederatedSystemProperties receives null data `, async () => {
  testInvalidData(null);
});

test(`FederatedSysFederatedSystemPropertiestemIndexers receives valid data' `, async () => {
  // create a FederatedSystemProperties:
  render(<FederatedSystemProperties system={systemJson} />);

  // check general structure of the component
  const table = screen.getByRole('table');
  expect(table).toBeDefined();
  expect(table).toHaveClass('properties-list');

  // create a list of properties that should be displayed. This is very specific to the test data from systemJson
  var properties = [
    'system ID ' + systemJson.systemID,
    'REST base url ' + systemJson.restUrlPrefix,
    'task completion url prefix ' + systemJson.taskCompletionUrlPrefix,
    'version ' + systemJson.version,
    'index ' + systemJson.indexName,
    'number of replicas ' + systemJson['index.number_of_replicas'],
    'number of shards ' + systemJson['index.number_of_shards'],
    'index process instances ' + systemJson.indexProcessInstances,
    'index refresh interval ' + systemJson['index.refresh_interval'],
    'client refresh interval ' + systemJson.indexRefreshIntervalForClients,
    'launch list priority ' + systemJson.launchListPriority,
    'allowed origins ' + systemJson.allowedOrigins,
    'authentication mechanism ' + systemJson.authenticationMechanism,
  ];
  // there should be an element of role 'row' with a 'name' corresponding to each property created above
  properties.forEach(property => {
    expect(screen.getByRole('row', { name: property.trim() })).toBeDefined();
  });
});
