/*
 Copyright IBM Corp. 2023
*/

import React from "react";
import { Db2Database } from "@carbon/icons-react";
import PropertiesList from "../../components/PropertiesList";
import { hasMultipleValuedProperties, hasMultipleValues, getPropertyDisplayValue } from "../../utils/multi-valued-properties";
import InlineWarning from "../../components/InlineWarning";

/**
 * Component that displays the properties of a federated system database
 * @param {*} system
 * @returns
 */
function FederatedSystemDatabaseProperties({ system }) {

    const RED_STATUS_CSS_CLASS = "status-red";

    let database = system && system.database;
    if (database) {

      var styles = {
        name: hasMultipleValues(database, "databaseName") ? RED_STATUS_CSS_CLASS : "",
        vendor: hasMultipleValues(database, "vendor") ? RED_STATUS_CSS_CLASS : "",
        server: hasMultipleValues(database, "serverName") ? RED_STATUS_CSS_CLASS : "",
        port: hasMultipleValues(database, "portNumber") ? RED_STATUS_CSS_CLASS : "",
        user: hasMultipleValues(database, "user") ? RED_STATUS_CSS_CLASS : "",
      };
  
      var properties = {
        name: getPropertyDisplayValue(database, "databaseName"),
        vendor: getPropertyDisplayValue(database, "vendor"),
        'product name': database.metadata && database.metadata.productName,
        'product version': database.metadata && database.metadata.productVersion,
        server: getPropertyDisplayValue(database, "serverName"),
        port: getPropertyDisplayValue(database, "portNumber"),
        user: getPropertyDisplayValue(database, "user"),
      };

      var warning = null;
      if (hasMultipleValuedProperties(database)) {
        warning = <InlineWarning className="database-warning" title="Note:" subtitle="For a Process Federation Server node to take into account a change in a datasource configuration, this node must be restarted."/>
      }

      return <PropertiesList title={<><Db2Database className="icon-with-text"/> Database{warning}</>} properties={properties} styles={styles} />;

    } else {
      return <></>;
    }
}

export default FederatedSystemDatabaseProperties;
