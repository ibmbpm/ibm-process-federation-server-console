/*
 Copyright IBM Corp. 2023
*/

import React from "react";
import {
    Schematics,
    Xml,
    Portfolio,
    Unknown
} from '@carbon/icons-react';

/**
 * Component that displays the icon for the type of a federated system
* @param {*} system the federated system
* @returns
*/
function FederatedSystemTypeIcon({ system, className }) {
    if (system && system.systemType === 'SYSTEM_TYPE_WLE') {
        return <Schematics className={className} />;
    } else if (system && system.systemType === 'SYSTEM_TYPE_WPS') {
        return <Xml className={className} />;
    } else if (system && system.systemType === 'SYSTEM_TYPE_CASE') {
        return <Portfolio className={className} />;
    } else {
        return <Unknown className={className} />;
    }
}

export default FederatedSystemTypeIcon;
