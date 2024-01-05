/*
 Copyright IBM Corp. 2023
*/

import React from 'react';
import {
  DataTable,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableExpandHeader,
  TableHeader,
  TableBody,
  TableExpandRow,
  TableCell,
  TableExpandedRow,
} from '@carbon/react';

/**
 * DataTable component to display monitored data
 * @param {string} title the title of the DataTable
 * @param {string} description the desciption of the DataTable
 * @param {array} headers headers to display
 * @param {array} rows array of rows to display.
 *                If a row has the isExpanded attribute set to true it will be expanded
 *                If a row has an expandedContent attribute, its value will be displayed in the DataTable when the corresponding row is expanded
 *                If a row has an error attribute set to true then class "problematic" will be added to the row
 *                This array can be empty; in that case no data will be displayed.
 * @param {function} expandHandler a handler function that is called when the expand arrow is clicked on the table, providing the row id as parameter
 *                   The role of this function is to handle the event by toggling the state of the isExpanded attribute of the row in the component's
 *                   rows property on order to toggle the expansion of this row. This handler is called with the id of the row as the input attribute.
 * @param {node} emptyRowsPanel component displayed in the table when there are no rows
 * @returns
 */
function MonitoringDataTable({
  title,
  description,
  headers,
  rows,
  expandHandler,
  emptyRowsPanel
}) {
  /**
   * Find a row in the rows property
   * @param {*} rowId the id of the row
   * @returns
   */
  function findRow(rowId) {
    // Use the rowId to retrieve the corresponding row in the component properties
    return rows.find(row => row.id === rowId);
  }

  function getRowClassName(rowId) {
    const row = findRow(rowId);
    if (row && row.error === true) {
      return 'problematic';
    } else {
      return '';
    }
  }

  function getIsExpanded(rowId) {
    const row = findRow(rowId);
    return row && row.isExpanded;
  }

  function getExpandedRowContent(rowId) {
    const row = findRow(rowId);
    if (row && row.expandedContent) {
      return row.expandedContent;
    } else {
      return <p>No additional information available.</p>;
    }
  }

  return (
    <DataTable
      rows={rows}
      headers={headers}
      render={({
        rows,
        headers,
        getHeaderProps,
        getRowProps,
        getTableProps,
        expandRow,
      }) => (
        <TableContainer title={title} description={description}>
          <Table {...getTableProps()}>
            <TableHead>
              <TableRow>
                <TableExpandHeader />
                {headers.map(header => (
                  <TableHeader {...getHeaderProps({ header })}>
                    {header.header}
                  </TableHeader>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(function(row) {
                // Expand row if explicitely requested
                row.isExpanded = getIsExpanded(row.id);
                if (row.isExpanded == undefined) {
                  row.isExpanded = false;
                }
                return (
                  <React.Fragment key={row.id}>
                    <TableExpandRow
                      {...getRowProps({ row })}
                      className={getRowClassName(row.id)}
                      onExpand={function(event) {
                        if (expandHandler) {
                          expandHandler(row.id);
                        }
                      }}>
                      {row.cells.map(function(cell) {
                        return (
                          <TableCell key={cell.id} className="monitoring-data-table-cell">{cell.value}</TableCell>
                        );
                      })}
                    </TableExpandRow>
                    <TableExpandedRow colSpan={headers.length + 1} className={getRowClassName(row.id)}>
                      {getExpandedRowContent(row.id)}
                    </TableExpandedRow>
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
          { rows.length===0 && emptyRowsPanel }
        </TableContainer>
      )}
    />
  );
}

export default MonitoringDataTable;
