/*
 Copyright IBM Corp. 2023
*/

import { Dropdown, Stack } from "@carbon/react";


/**
 * This component is a specific heading for modal dialogs about indexers or retriever details. 
 * It displays an icon, a dropdown list of Strings identifiying indexers/retrievers/..., and a label. 
 * When the user chooses an item in the dropdown a callback function is called with the new selected item as parameter.
 * 
 * @param {Node} icon 
 * @param {String} label 
 * @param {Array} items an array of strings to display in the Dropdown
 * @param {String} selectedItem the item to select in the Dropdown component 
 * @param {*} changeHandler a callback function called when user selects an item in the Dropdown. This function receives a String parameter 
 * 
 * @returns the heading component
 */
function FederatedSystemModalHeading({icon,label,items,selectedItem,changeHandler}) {

    return (
        <Stack className="federated-system-modal-heading-stack" orientation="horizontal" gap="8px">
            {icon}
            <Dropdown id="federated-system-modal-heading-dropdown" label="Select component" items={items} selectedItem={selectedItem} onChange={(e) => changeHandler(e.selectedItem)}></Dropdown>
            {label}
        </Stack>
    );
}

export default FederatedSystemModalHeading;