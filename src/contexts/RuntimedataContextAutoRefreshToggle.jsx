/*
 Copyright IBM Corp. 2023
*/

import { useContext } from "react";
import { RuntimedataContext } from "./RuntimedataContextProvider";
import { Stack, Toggle, InlineLoading } from "@carbon/react";

/**
 * A toggle to activate or deactivate the autorefresh process of runtimedata, using RuntimedataContext data and functions
 * 
 * @param {string} id Id of the toggle
 * @returns a component containing a toggle and miscellaneous information
 */
function RuntimedataContextAutoRefreshToggle({ id }) {

    const {
        autoRefreshEnabled,
        setAutoRefreshEnabled,
        loadingRuntimedata
    } = useContext(RuntimedataContext);

    function handleAutoRefreshToggle(value) {
        setAutoRefreshEnabled(value);
    }


    return (
        <Stack gap={8} orientation="horizontal">
            <Toggle
                id={id}
                labelText="Autorefresh"
                labelA="Off"
                labelB="On"
                toggled={autoRefreshEnabled}
                onToggle={handleAutoRefreshToggle}
            />
            {loadingRuntimedata ? (
                <InlineLoading description="Loading data..." />
            ) : null}
        </Stack>

    );
}

export default RuntimedataContextAutoRefreshToggle