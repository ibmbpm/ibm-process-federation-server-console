/*
 Copyright IBM Corp. 2023
*/

import React from "react";
import { Launch } from "@carbon/icons-react";

/**
 * Component that displays an external link that should open in another browser tab when clicked
 * param {string} href the link href
 */
function ExternalLink({href, children}) {
    return <a className="cds--link"
        href={href}
        rel="noreferrer"
        target="_blank">
        {children}
        {href && <>&nbsp;<Launch className="external-link-launch-icon"/></>}
    </a>;
}

export default ExternalLink;