/*
 Copyright IBM Corp. 2023
*/

import React from "react";
import PropertiesList from "../../components/PropertiesList";
import InlineWarning from "../../components/InlineWarning";
import { IndexerPartitionRange } from ".";

/**
 * Component that displays the properties of an indexer
 * @param {*} indexer 
 */
function IndexerProperties({indexer}) {
    if (indexer) {
        var message = indexer && !indexer.isRunning ? <InlineWarning title="Only configuration properties are available when the indexer is not running" /> : "";
        const properties = {
            'type': indexer.type,
            'display id': indexer['config.displayId'],
            'id': indexer.id,
            'server timezone': indexer.bpdServerTimezone,
            'indexing interval (ms)': indexer.indexingInterval,
            'partition range': <IndexerPartitionRange indexer={indexer}/>,
            'database schema': indexer.schemaName,
            'consumer column': indexer.database && indexer.database.consumerColumn,
            'database driver name': indexer.database && indexer.database.driverName,
            'database driver version': indexer.database && indexer.database.driverVersion,
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

export default IndexerProperties;