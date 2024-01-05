/*
 Copyright IBM Corp. 2023
*/

import React from "react";
import PropertiesList from "../../components/PropertiesList";
import InlineWarning from "../../components/InlineWarning";

/**
 * Component that displays the properties of a retriever
 * @param {*} retriever 
 */
function RetrieverProperties({retriever}) {
    if (retriever) {
        var message = retriever && !retriever.isRunning ? <InlineWarning title="This retriever is not running" subtitle="No runtime properties are available"/> : "";
        const properties = {
            'display id': retriever['config.displayId'],
            'internal rest url prefix': retriever.internalRestUrlPrefix,
            'connect timeout': retriever.connectTimeout + ' ms',
            'read timeout': retriever.readTimeout + ' ms',
            'propagated cookie names': retriever.propagateCookieNames,
            'propagated header names': retriever.propagateHeaderNames,
            'additional headers': retriever.additionalHeaders,
        };
        return (
            <>
            {message}
            <PropertiesList properties={properties} />
            </>
        );
    } else {
        return null;
    }
}

export default RetrieverProperties;