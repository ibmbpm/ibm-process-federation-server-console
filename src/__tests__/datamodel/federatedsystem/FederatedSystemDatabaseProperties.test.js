/*
 Copyright IBM Corp. 2023
*/

import { render, screen } from '@testing-library/react';
import FederatedSystemDatabaseProperties from '../../../datamodel/federatedsystem/FederatedSystemDatabaseProperties';
import systemJson from './system.json';

/**
 * Check component's content when is is built with invalid data
 */
function testInvalidData(data) {
  // create a FederatedSystemDatabaseProperties component
  const { container } = render(
    <FederatedSystemDatabaseProperties system={data} />
  );

  // there should be ONLY one <div> element in <body>
  expect(document.querySelectorAll('body *').length).toEqual(1);
  expect(document.body.children[0].nodeName).toEqual('DIV');
}

test(`FederatedSystemDatabaseProperties receives null data `, async () => {
  testInvalidData(null);
});

test(`FederatedSystemDatabaseProperties receives data with NO 'database' `, async () => {
  const data = {};
  testInvalidData(data);
});

test(`FederatedSystemDatabaseProperties receives valid data to display`, async () => {
  // create a FederatedSystemDatabaseProperties component from valid json data
  render(<FederatedSystemDatabaseProperties system={systemJson} />);

  // check general structure of the component
  expect(screen.getByRole('heading', { name: 'Database' })).toBeDefined();
  const table = screen.getByRole('table');
  expect(table).toBeDefined();
  expect(table).toHaveClass('properties-list');

  // create a list of properties that should be displayed. This is very specific to the test data from systemJson
  const database = systemJson.database;
  var properties = [
    `name ${database.databaseName}`,
    `vendor ${database.vendor}`,
    `product name ${database.metadata.productName}`,
    `product version ${database.metadata.productVersion}`,
    `server ${database.serverName}`,
    `port ${database.portNumber}`,
    `user ${database.user}`,
  ];
  // there should be an element of role 'row' with a 'name' corresponding to each property created above
  properties.forEach(property => {
    expect(screen.getByRole('row', { name: property })).toBeDefined();
  });
});
