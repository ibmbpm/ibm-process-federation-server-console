/*
 Copyright IBM Corp. 2023
*/

import React from 'react';
import { 
    StructuredListWrapper,
    StructuredListHead,
    StructuredListBody,
    StructuredListRow,
    StructuredListCell
} from '@carbon/react';

/**
 * Component that displays an array of properties
 * Example of input values:
 * title = "People"
 * headers = ['id', 'gender', 'first name', 'last name']
 * rows = [
 *  ['id1', ['id1', 'male', 'John', 'Doe']],
 *  ['id2', ['id2', 'female', 'Jane', 'Doe'], "my-optional-className-for-this-row"]
 * ]
 * @param {*} headers an array of headers for the array of properties column headers
 * @param {*} rows an array of rows. Each row itself is an array with two or three values: the key for the row and an array of values (one per column), and optionally a CSS class name to use for the row.
 * @param {func} rowClickHandler optional handler called when a row is clicked (rows are not clickable if this value is not provided).
 *                               The row key is provided to the handler when a row is clicked.
 * @param {string} rowClickTooltip a simple tooltip text to explain what happen if a row is clicked
 * @returns 
 */
function PropertiesArray({title, headers, rows, rowClickHandler, rowClickTooltip }) {

    var titleComponent = <></>;
    if (title !== null && title !== undefined) {
        titleComponent = <h5 className="properties-array-title">{title}</h5>;
    }
    var headersList = headers.map(function (header, index) {
        return (
            <StructuredListCell noWrap head key={index}>
                {header}
            </StructuredListCell>
        );
    });

    var rowsList = rows.map(function (row, index) {

        var cellsList = row[1].map(function(value, index) {
            return (
                <StructuredListCell noWrap key={row[0] + '-' + index}>{value}</StructuredListCell>
            );
        });

        var rowClassName = "";
        if (row.length > 2) {
            rowClassName = row[2];
        }

        var rowComponent = (
            <StructuredListRow
                tabIndex={0}
                className={rowClassName}
                key={row[0]}>
                    {cellsList}
            </StructuredListRow>
        );

        if (rowClickHandler) {
            // Wrap the row in a clickable div
            rowComponent = <div
                            title={rowClickTooltip}
                            className="properties-array-row-wrapper"
                            onClick={() => rowClickHandler(row[0])}
                            key={row[0]}>
                    {rowComponent}
                </div>
        }

        return rowComponent;
    });

    return (
        <>
        {titleComponent}
        <StructuredListWrapper
            aria-label="array of properties"
            className="properties-array">
            <StructuredListHead>
                <StructuredListRow head tabIndex={0}>
                    {headersList}
                </StructuredListRow>
            </StructuredListHead>
            <StructuredListBody>
                {rowsList}
            </StructuredListBody>
        </StructuredListWrapper>
        </>
    );
}

export default PropertiesArray;