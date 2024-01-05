/*
 Copyright IBM Corp. 2023
*/

import { render, screen } from '@testing-library/react';
import FederatedSystemName from '../../../datamodel/federatedsystem/FederatedSystemName';
import system from './system.json';

test(`FederatedSystemName receives valid data to display name`, async () => {
  // create a FederatedSystemName component from valid json data
  render(<FederatedSystemName system={system} />);

  // check that a text containing either displayName or systemID, as created by FederatedSystemName, exists
  const textToCheck = system.displayName || system.systemID;
  expect(screen.getByText(textToCheck)).toBeDefined();
});
