/*
 Copyright IBM Corp. 2023
*/

import React from "react";

/**
 * Component that display date and time information
 * @param {string} datetime
 */
function DateTime({datetime}) {
    let d = new Date();
    d.setTime(Date.parse(datetime));
    return d.toLocaleString();
}

export default DateTime;