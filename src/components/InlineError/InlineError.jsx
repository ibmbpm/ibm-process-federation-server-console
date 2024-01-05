/*
 Copyright IBM Corp. 2023
*/

import React from 'react';
import { InlineNotification } from '@carbon/react';

/**
 * Component that displays an inline error
 * @param {string} title the title
 * @param {string} subtitle the subtitle 
 * @param {string} className a CSS class name to add to the component
 * @returns 
 */
function InlineError({title, subtitle, className}) {
    return <InlineNotification title={title} subtitle={subtitle} kind="error" lowContrast={true} hideCloseButton={true} className={className} />
}

export default InlineError;