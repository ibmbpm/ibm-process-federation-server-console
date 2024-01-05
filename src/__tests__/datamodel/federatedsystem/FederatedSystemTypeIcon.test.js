/*
 Copyright IBM Corp. 2023
*/

import { render, screen } from '@testing-library/react';
import FederatedSystemTypeIcon from '../../../datamodel/federatedsystem/FederatedSystemTypeIcon';

function testSystemTypeIcon(type, className) {
  // create system test data
  const system = {
    systemType: type,
  };

  // create a FederatedSystemType component from data
  const { container } = render(
    <FederatedSystemTypeIcon system={system} className={className} />
  );

  // check that a 'svg' with given className exists
  const selector = 'svg.' + className;
  expect(container.querySelector(selector)).not.toBeNull();
}

test(`FederatedSystemTypeIcon for BPD system`, async () => {
  testSystemTypeIcon('SYSTEM_TYPE_WLE', 'bpm-type-class');
});

test(`FederatedSystemTypeIcon for BPEL system`, async () => {
  testSystemTypeIcon('SYSTEM_TYPE_WPS', 'bpel-type-class');
});

test(`FederatedSystemTypeIcon for Case system`, async () => {
  testSystemTypeIcon('SYSTEM_TYPE_CASE', 'case-type-class');
});

test(`FederatedSystemTypeIcon for dummy system type`, async () => {
  testSystemTypeIcon('DUMMY_TYPE', 'dummy-type-class');
});

test(`FederatedSystemTypeIcon receives 'null' data`, async () => {
  const className = 'null-class';

  // create a FederatedSystemType component from data
  const { container } = render(
    <FederatedSystemTypeIcon system={null} className={className} />
  );

  // check that a 'svg' with speific className exists
  expect(container.querySelector('svg.' + className)).not.toBeNull();
});
