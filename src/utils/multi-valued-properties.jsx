/*
 Copyright IBM Corp. 2023
*/

import React from "react";

////////////////////////////////
// This module provides methods to deal with multivalued properties (an object property that have different values depending 
// on the context).
//
// An exemple of multi valued properties in the PFS console is the configuration properties of a federated systems across different
// PFS nodes: a same configuration property for federated system X can have different values in each PFS node configuration file. In
// this example, the context of each value is the PFS node on which the value is defined.
//
////////////////////////////////

/**
 * This utility collect property values on different contexts:
 * - The value of property propertyName is retrieved from the object
 * - This value is added to the collector object: the collector object has one property per
 *   collected property (which has the same name), the value itself is an array that contains
 *   objects with the following schema:
 *   {
 *      value: [...], // A value collected for the property
 *      contexts: { // An object that has one property with the name of each context from which this value was collected
 *         "context XXXX": true,
 *         "context YYYY": true 
 *      } 
 *   }
 * 
 * @param {object} collector the object in which the property values are collected
 * @param {object} object the object from which the property value is collected
 * @param {string} propertyName the name of the property to collect from current
 * @param {string} context the context for this value
 */
function collectPropertyValueOnObjectForContext(collector, object, context, propertyName) {
    if (!collector.hasOwnProperty(propertyName)) {
        collector[propertyName] = [];
    }
    var previouslyRecordedValue = collector[propertyName].find(function (entry) {
        return entry.value === object[propertyName];
    });
    if (previouslyRecordedValue) {
        // There is already a context that use this value for the property
        // Register the fact that this context also use this value
        previouslyRecordedValue.contexts[context] = true;
    } else {
        // No other context use this value for the property: add this value
        var newValue = {
        value: object[propertyName],
        contexts: {}
        };
        newValue.contexts[context] = true;
        collector[propertyName].push(newValue);
    }
}

/**
 * Merge values previously collected with the collectPropertyValueOnObjectForContext method.
 * For each property which values have been collected in the collector:
 * - if there is a single value then add it to the target object
 * - if there is more than one value then add those to a _multiValuedProperties property on the target object.
 *   The _multiValuedProperties property is an object that have one property per multi valued properties (with the same property name),
 *   which value is the array value collected with method collectPropertyValueOnObjectForContext (see the documentation for this method)
 * @param {*} collector the collector
 * @param {*} target  the target object on which to merge the values
 */
function mergeCollectedValues(collector, target) {
    for (let propertyName in collector) {
        var propertyValues = collector[propertyName];
        if (propertyValues.length === 1) {
        // Expected case: there is a single property value
        target[propertyName] = propertyValues[0].value;
        } else {
        // There is more than one value for this property, which is an issue: store the different values in the _multiValuedProperties attribute
        if (!target._multiValuedProperties) {
            target._multiValuedProperties = {};
        }
        target._multiValuedProperties[propertyName] = propertyValues;
        }
    }
}

/**
 * This utility check if an object, that was previously used as the target for method mergeCollectedValues,
 * has multiple valued properties
 * @param {*} object the object
 * @returns true or false
 */
function hasMultipleValuedProperties(object) {
    return !!(object && object._multiValuedProperties);
}

/**
 * This utility check if the property of an object, that was previously used as the target for method mergeCollectedValues,
 * has multiple values
 * @param {*} object the object
 * @param {*} propertyName the name of the property to check on the object
 * @returns true or false
 */
function hasMultipleValues(object, propertyName) {
    return !!(propertyName && hasMultipleValuedProperties(object) && object._multiValuedProperties.hasOwnProperty(propertyName));
}

/**
 * This method return a react element that displays the value of a property. It supports multi valued properties
 * collected with collectPropertyValueOnObjectForContext and merged with mergeCollectedValues and return a react element
 * that displays each value with its corresponding context in case the requested property has multiple values.
 * @param {*} object the object on which the property is defined
 * @param {*} propertyName the name of the property
 * @returns 
 */
function getPropertyDisplayValue(object, propertyName) {
    if (object.hasOwnProperty(propertyName)) {
        // There is a single value for this property: return it
        return _getPropertyDisplayValue(object[propertyName]);
    } else {
        // Check if there are multiple values for this property
        if (hasMultipleValues(object, propertyName)) {
            var valuesOfPropertyWithConfigurationIssues = object._multiValuedProperties[propertyName];
            var jsxValues = [];
            for (let currentValue of valuesOfPropertyWithConfigurationIssues) {
                for (let context in currentValue.contexts) {
                jsxValues.push(<><span className="alternate-value">{_getPropertyDisplayValue(currentValue.value)} ({context})</span><br/></>)
                }
            }
            return <div className="problematic">{jsxValues}</div>;
        } else {
            return undefined;
        }
    }
}

/**
 * Internal method: return a string to display a single property value
 * @param {*} propertyValue the property value
 * @returns 
 */
function _getPropertyDisplayValue(propertyValue) {
    if (typeof propertyValue === 'boolean') {
        return propertyValue ? 'true' : 'false';
    } else {
        return propertyValue;
    }
}

export { collectPropertyValueOnObjectForContext, mergeCollectedValues, hasMultipleValuedProperties, hasMultipleValues, getPropertyDisplayValue };
