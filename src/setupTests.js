/*
 Copyright IBM Corp. 2023
*/

// react-testing-library renders your components to document.body,
// this adds jest-dom's custom assertions
import '@testing-library/jest-dom';

import { TextEncoder } from 'util';
globalThis.TextEncoder = TextEncoder;
