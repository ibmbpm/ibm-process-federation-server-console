import React, { } from 'react';
import InlineError from '../../components/InlineError';
import {
    Error,
    Launch,
} from '@carbon/icons-react';


/**
 * Component that displays the name of a given federated data repository (let's call it fdr).
 * If a name can not be determined (no connection to the underlaying fdr) a error message is used instead.
 * 
 * @param {Object} federatedDataRepository The federated data repository
 * @returns a component representing the name of the data repository
 */
function FederatedDataRepositoryName({ federatedDataRepository }) {
    let name = "";
    const fdr = federatedDataRepository;

    if (!fdr.isAvailable) {
        var icon = <Error className="icon-with-text" />;
        var errorDetails = null;
        if (fdr.communicationException) {
            errorDetails = <><br/>({fdr.communicationException})</>;
        }
        var title = <>Federated data repository is not connected {errorDetails}</>;
        name = <InlineError title={title} subtitle="Without a Federated Data Repository connection, this server cannot start any indexer, retriever and REST service." />;
    } else {
        const label = `${fdr.vendor} ${fdr.version}`;
        name = <span className="name" >{label}</span>
    }

    return (
        <div className="federated-data-repository">{name}</div>
    );
}

/*
 Copyright IBM Corp. 2023
*/

export default FederatedDataRepositoryName