/*
 Copyright IBM Corp. 2023
*/

import { render, screen } from '@testing-library/react';
import FederatedSystemType from '../../../datamodel/federatedsystem/FederatedSystemType';

function testSystemType(type, label) {
  // create system test data
  const system = {
    systemType: type,
  };

  // create a FederatedSystemType component from data
  render(<FederatedSystemType system={system} />);

  // check that a text corresponds to the given label
  expect(screen.getByText(label)).toBeDefined();
}

test(`FederatedSystemType for BPD system`, async () => {
  testSystemType('SYSTEM_TYPE_WLE', 'BPD System');
});

test(`FederatedSystemType for BPEL system`, async () => {
  testSystemType('SYSTEM_TYPE_WPS', 'BPEL System');
});

test(`FederatedSystemType for Case system`, async () => {
  testSystemType('SYSTEM_TYPE_CASE', 'Case System');
});

test(`FederatedSystemType for dummy system type`, async () => {
  testSystemType('DUMMY_TYPE', 'Unknown type');
});

test(`FederatedSystemType receives 'null' data`, async () => {
  // create a FederatedSystemType component from data
  render(<FederatedSystemType system={null} />);

  // check that a 'Unknown type' text exists
  expect(screen.getByText('Unknown type')).toBeDefined();
});
