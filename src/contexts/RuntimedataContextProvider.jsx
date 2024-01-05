/*
 Copyright IBM Corp. 2023
*/

import React, { createContext, useCallback, useEffect, useRef, useState } from "react";


/**
 * This Context provides data from the /console/api/v1/cluster/runtimedata API
 *  - runtimedata
 * 
 * It also provides control over a built-in autorefreshing mechanism:
 *  - loadingRuntimedata: A boolean indicating that data is being loaded
 *  - autoRefreshEnabled: A boolean indicating that the autorefresh is enabled
 *  - setAutoRefreshEnabled(bool): A function to enable or to disable the autorefresh
 * 
 */

export const RuntimedataContext = createContext(null);

const RuntimedataContextProvider = ({ children }) => {

    const [runtimedata, setRuntimedata] = useState(null);

    // Timer management
    const AUTOREFRESH_INTERVAL = 5000;
    const timeout = useRef(-1) // -1 to indicate that it has not yet been set: will be set to positive integer by setTimeout
    const [loadingRuntimedata, setLoadingRuntimedata] = useState(false);
    const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(false);
    let autoRefreshEnabledRef = useRef(false);

    async function fetchRuntimedata() {
        try {
            setLoadingRuntimedata(true);
            const URL = '/pfsconsole/api/v1/cluster/runtimedata';
            const response = await fetch(URL);
            if (response.ok) {
                const data = await response.json();
                setRuntimedata(data);
                console.log('Data loaded from ' + URL + ': ', data);
            } else {
                console.log('Error loading data from ' + URL + ': ', response);
                setRuntimedata({
                    error: response.status + ' ' + response.statusText,
                    errorResponse: response
                });
            }
        } catch (error) {
            console.error(error);
            const msg = (error && error.message) ? `An error occured while fetching runtimedata: ${error.message}`: "An unknown error occured while fetching runtimedata";
            setRuntimedata({
                error: msg
            });
        } finally {
            setLoadingRuntimedata(false);

            if(autoRefreshEnabledRef.current) {
                clearTimeout(timeout.current);
                timeout.current = setTimeout( refreshRuntimedata, AUTOREFRESH_INTERVAL);
            }

        }
    }


    const refreshRuntimedata = useCallback( ()=>{
            console.log('TIMEOUT: refresh', timeout.current)
            fetchRuntimedata();
    },[]);
    
    
    useEffect(() => {      
        autoRefreshEnabledRef.current = autoRefreshEnabled;
        if( autoRefreshEnabled ){
            console.log('TIMEOUT: set and start immediatly');
            clearTimeout(timeout.current);
            timeout.current = setTimeout( refreshRuntimedata);
        }else if( timeout.current>=0 ){
            console.log('TIMEOUT: stop and cleanup', timeout.current)
            clearTimeout(timeout.current);
        }
    },[autoRefreshEnabled]);
    
    
    useEffect(() => {
        console.log('MOUNT context provider')
        fetchRuntimedata();
        
        if(autoRefreshEnabledRef.current) {
            console.log('TIMEOUT: initial set')
            timeout.current = setTimeout( refreshRuntimedata, AUTOREFRESH_INTERVAL);
        }

        return ()=>{
            clearTimeout(timeout.current);
        }

    }, [])


    return (
        <RuntimedataContext.Provider value={{ runtimedata, loadingRuntimedata, autoRefreshEnabled, setAutoRefreshEnabled }}>
            {children}
        </RuntimedataContext.Provider>
    )
}

export default RuntimedataContextProvider;