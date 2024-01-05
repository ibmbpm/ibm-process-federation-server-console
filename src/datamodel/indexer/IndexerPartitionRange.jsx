/*
 Copyright IBM Corp. 2023
*/

import React from "react";

/**
 * Component that displays the partition range for an indexer
 * @param {*} param0 
 */
function IndexerPartitionRange({indexer}) {
    let partitionRange = '? - ?';
    if (indexer && indexer.partition) {
        partitionRange =
          indexer.partition.min +
          ' - ' +
          indexer.partition.max;
      }
    return partitionRange;
}

export default IndexerPartitionRange;