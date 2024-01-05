/*
 Copyright IBM Corp. 2023
*/

import React from "react";
import PropertiesList from "../../components/PropertiesList";
import { FederatedSystemType, FederatedSystemTypeIcon } from ".";
import { hasMultipleValues, getPropertyDisplayValue } from "../../utils/multi-valued-properties";

/**
 * Component that displays the properties of a federated system
* @param {*} param0
* @returns
*/
function FederatedSystemProperties({ system }) {

  const RED_STATUS_CSS_CLASS = "status-red";

  if (system) {

    var styles = {
      'REST base url': hasMultipleValues(system, "restUrlPrefix") ? RED_STATUS_CSS_CLASS : "",
      'task completion url prefix': hasMultipleValues(system, "taskCompletionUrlPrefix") ? RED_STATUS_CSS_CLASS : "",
      'index': hasMultipleValues(system, "indexName") ? RED_STATUS_CSS_CLASS : "",
      'number of replicas': hasMultipleValues(system, "index.number_of_replicas") ? RED_STATUS_CSS_CLASS : "",
      'number of shards': hasMultipleValues(system, "index.number_of_shards") ? RED_STATUS_CSS_CLASS : "",
      'index process instances': hasMultipleValues(system, "indexProcessInstances") ? RED_STATUS_CSS_CLASS : "",
      'index refresh interval': hasMultipleValues(system, "index.refresh_interval") ? RED_STATUS_CSS_CLASS : "",
      'client refresh interval': hasMultipleValues(system, "indexRefreshIntervalForClients") ? RED_STATUS_CSS_CLASS : "",
      'launch list priority': hasMultipleValues(system, "launchListPriority") ? RED_STATUS_CSS_CLASS : "",
      'allowed origins': hasMultipleValues(system, "allowedOrigins") ? RED_STATUS_CSS_CLASS : "",
      'authentication mechanism': hasMultipleValues(system, "authenticationMechanism") ? RED_STATUS_CSS_CLASS : "",
    };

    var properties = {
      'system ID': system.systemID,
      'REST base url': getPropertyDisplayValue(system, "restUrlPrefix"),
      'task completion url prefix': getPropertyDisplayValue(system, "taskCompletionUrlPrefix"),
      'version': system.version,
      'index': getPropertyDisplayValue(system, "indexName"),
      'number of replicas': getPropertyDisplayValue(system, "index.number_of_replicas"),
      'number of shards': getPropertyDisplayValue(system, "index.number_of_shards"),
      'index process instances': getPropertyDisplayValue(system, "indexProcessInstances"),
      'index refresh interval': getPropertyDisplayValue(system, "index.refresh_interval"),
      'client refresh interval': getPropertyDisplayValue(system, "indexRefreshIntervalForClients"),
      'launch list priority': getPropertyDisplayValue(system, "launchListPriority"),
      'allowed origins': getPropertyDisplayValue(system, "allowedOrigins"),
      'authentication mechanism': getPropertyDisplayValue(system, "authenticationMechanism"),
    };

    return (
      <PropertiesList
        title={<><FederatedSystemTypeIcon system={system} className="icon-with-text" /> <FederatedSystemType system={system} /></>}
        properties={properties}
        styles={styles}
      />
    );
  } else {
    return null;
  }
}

export default FederatedSystemProperties;