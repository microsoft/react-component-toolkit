// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IGraphData } from "./igraphdata";
import http from "../common/httpcommon"

const getBySearchTerm = (baseurl: string, term: string) => {
    const url = `${baseurl}/${term}`;
    return http.get<IGraphData>(url);
}

const DataService = {
    getBySearchTerm
}

export default DataService;