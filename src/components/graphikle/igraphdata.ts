// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

export interface Node {
    id: string;
    name: string;
}

export interface Link {
    source: string;
    target: string;
}

export interface IGraphData {
    nodes: Node[];
    links: Link[];
}