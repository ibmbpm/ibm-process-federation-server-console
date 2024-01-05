/*
 Copyright IBM Corp. 2023
*/

import React from 'react';
import {
  StructuredListWrapper,
  StructuredListBody,
  StructuredListRow,
  StructuredListCell,
} from '@carbon/react';

/**
 * Component that displays a list of properties
 * @param {*} title a title for the list of properties
 * @param {*} properties a key / values object to display (properties with null and undefined values will not be displayed)
 * @param {*} styles an optional key / values object that define CSS styles to apply to each property row: the key is the property name and the value is the className to use for this property (null or undefined classNames are ignored)
 * @returns
 */
function PropertiesList({ title, properties, styles }) {
  function getRow(property, value) {
    var rowClassName = "";
    if (styles && styles.hasOwnProperty(property)) {
      rowClassName = styles[property];
    }
    return (
      <StructuredListRow key={property} className={rowClassName}>
        <StructuredListCell noWrap>{property}</StructuredListCell>
        <StructuredListCell>{value}</StructuredListCell>
      </StructuredListRow>
    );
  }

  var rows = [];

  for (const p in properties) {
    let value = properties[p];
    if (value !== undefined && value !== null) {
      if (typeof value === 'boolean') {
        value = value ? 'true' : 'false';
      }
      rows.push(getRow(p, value));
    }
  }
  return (
    <>
      {title ? (
        <>
          <h5 className="properties-list-title">{title}</h5>
          <br />
        </>
      ) : (
        ''
      )}
      <StructuredListWrapper
        className="properties-list"
        isCondensed={true}
        isFlush={true}>
        <StructuredListBody>{rows}</StructuredListBody>
      </StructuredListWrapper>
    </>
  );
}

export default PropertiesList;
