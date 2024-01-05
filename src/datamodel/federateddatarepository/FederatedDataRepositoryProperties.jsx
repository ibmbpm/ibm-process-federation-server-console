/*
 Copyright IBM Corp. 2023
*/

import React, { } from 'react';
import FederatedDataRepositoryName from './FederatedDataRepositoryName';
import PropertiesList from '../../components/PropertiesList';
import InlineWarning from '../../components/InlineWarning';
import ExternalLink from '../../components/ExternalLink';

/**
 * Subcomponent that displays information about the data repository related to a node

 * @param {Object} federatedDataRepository The federated data repository 
 * @returns 
 */
function FederatedDataRepositoryProperties({ federatedDataRepository }) {

    if (federatedDataRepository) {
        const title = <FederatedDataRepositoryName federatedDataRepository={federatedDataRepository} />;

        var endpoints=[];
        // Endpoints
        if (federatedDataRepository.endpoints) {
            federatedDataRepository.endpoints.split(',').forEach(function(endpoint, index) {
                endpoints.push(
                    <div key={index}>
                        <ExternalLink href={endpoint}>{endpoint}</ExternalLink>
                    </div>);
            });
        }
        var properties = {
            'endpoints': endpoints,
            'cluster name': federatedDataRepository.clusterName,
            'cluster uuid': federatedDataRepository.clusterUUID,
            'index prefix': federatedDataRepository.indexPrefix
        };
        // Other properties

        return (
            <div className="federated-data-repository-properties">
                <PropertiesList
                    title={title}
                    properties={properties}
                />
            </div>
        );
    }

    return (
        <InlineWarning title="NO AVAILABLE INFORMATION" />
    );
}

export default FederatedDataRepositoryProperties;