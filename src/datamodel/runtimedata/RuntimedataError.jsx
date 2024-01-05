/*
 Copyright IBM Corp. 2023
*/

import { CloudyDewy, Folder } from '@carbon/pictograms-react';

/**
 * Component to display error regarding runtimedata set
 * 
 * @param {*} data the runtimedata to analyse 
 * @returns 
 */
function RuntimeDataError({ data }) {

    // error details to display
    let title = 'No data';
    let message = 'Unknown error. No data to display';
    let icon = <Folder/>;    

    // analyse data to set error type and message
    if (data === null || data === undefined) {
        title = 'No data';
        message = 'The Process Federation Server did not return data. Contact your administrator';
    } 
    else if (data.error) {
        icon = <Folder/>;
        title = 'Error';
        message = data.error;

        if (data.errorResponse) {
            switch (data.errorResponse.status) {
                case 500:
                    icon = <CloudyDewy/>;
                    title = "Server error";
                    message = `${data.errorResponse.statusText}. The Process Federation Server did not respond. The URL may be wrong or PFS is down. Check the log files and/or contact your administrator`;
                    break;
            }
        }
    }
    else {
        return null;
    }


    return (
        < div className='runtimedata-error-panel'>
            {icon}<br />
            <h5 className="runtimedata-error-panel-title">{title}</h5>
            <span className="runtimedata-error-panel-message">{message}</span>
        </div>

    );

}

export default RuntimeDataError