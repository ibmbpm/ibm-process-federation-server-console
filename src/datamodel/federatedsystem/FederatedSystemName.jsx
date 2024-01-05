/*
 Copyright IBM Corp. 2023
*/

import React from "react";

/**
 * Component that displays the name of a federated system
 * @param {*} system
 * @returns
 */
function FederatedSystemName({ system }) {
    return (
      <>
        {system.displayName || system.systemID}
      </>
    );
}

export default FederatedSystemName;

