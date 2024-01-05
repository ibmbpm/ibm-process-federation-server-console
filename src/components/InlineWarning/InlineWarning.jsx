/*
 Copyright IBM Corp. 2023
*/

import React from 'react';
import { InlineNotification } from '@carbon/react';

/**
 * Component that displays an inline warning
 * @param {string} title the title
 * @param {string} subtitle the subtitle 
 * @param {string} className a CSS class name to add to the component
 * @returns 
 */
function InlineWarning({title, subtitle, className}) {
    return <InlineNotification title={title} subtitle={subtitle} kind="warning" lowContrast={true} hideCloseButton={true} className={className} />
}

export default InlineWarning;