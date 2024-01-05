/*
 Copyright IBM Corp. 2023
*/

import React from "react";

/**
 * Component that displays the type of a federated system
* @param {*} system
* @returns
*/
function FederatedSystemType({ system }) {
    if (system && system.systemType === 'SYSTEM_TYPE_WLE') {
      return <>BPD System</>;
    } else if (system && system.systemType === 'SYSTEM_TYPE_WPS') {
      return <>BPEL System</>;
    } else if (system && system.systemType === 'SYSTEM_TYPE_CASE') {
      return <>Case System</>;
    } else {
      return <>Unknown type</>;
    }
};

export default FederatedSystemType;