/*
 Copyright IBM Corp. 2023
*/

import React from "react";
import {
  Grid,
  Column
} from '@carbon/react';
import {
  FederatedSystemName,
  FederatedSystemProperties,
  FederatedSystemDatabaseProperties,
  FederatedSystemIndexers,
  FederatedSystemRetrievers
} from '.';

/**
 * Component that displays detailed information about a federated system
 * @param {*} system
 * @param {boolean} includeSystemName
 * @returns
 */
function FederatedSystemInformation({ system, includeSystemName = true }) {
    if (system) {
      return (
        <Grid className="federated-system-information">
          {includeSystemName &&
          <Column lg={16} className="federated-system-information-r1">
            <h4><FederatedSystemName system={system}/></h4>
          </Column>}
          <Column lg={16} className="federated-system-information-r2">
            <Grid>
              <Column lg={8}>
                <FederatedSystemProperties system={system} />
              </Column>
              <Column lg={8}>
                <FederatedSystemDatabaseProperties system={system} />
              </Column>
            </Grid>
          </Column>
          <Column lg={16} className="federated-system-information-r3">
            <FederatedSystemRetrievers system={system} />
          </Column>
          <Column lg={16} className="federated-system-information-r4">
            <FederatedSystemIndexers system={system} />
          </Column>
        </Grid>
      );
    } else {
      return <span>No Federated System information to display</span>;
    }
}

export default FederatedSystemInformation;