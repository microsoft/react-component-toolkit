// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IGraphData } from "./igraphdata";

export interface GraphikleProps {
    id: string,
    baseurl: string,
    searchterm: string,
    graphdata?: IGraphData,
    nodeClick?: (nodeId: string, event: MouseEvent) => void,
    nodeRightClick?: (nodeId: string, event: MouseEvent) => void,
    nodeHover?: (nodeId: string, previousNodeId: string) => void,
    nodeDrag?: (nodeId: string, x: number, y: number) => void,
    nodeDragEnd?: (nodeId: string, x: number, y: number) => void,
    linkClick?: (linkSourceId: string, linkDestinationId:string, event: MouseEvent) => void,
    linkRightClick?: (linkSourceId: string, linkTargetId:string, event: MouseEvent) => void,
    linkHover?: (linkSourceId: string, linkTargetId: string, previousLinkSourceId: string, previousLinkTargetId: string) => void,
    backgroundClick?: (event: MouseEvent) => void,
    backgroundRightClick?: (event: MouseEvent) => void
}
