// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {  MouseEventHandler } from "react"
export interface BingMapsProps {
    id: string,
    handleClick?: React.MouseEventHandler<HTMLDivElement>,
    bingMapsKey: string
}