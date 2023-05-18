// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import http from "../common/httpcommon"

const getPOSTRequest = (actionUrl: string, data: FormData) => {
    return http.post(actionUrl, data);
}

const SignInDataService = {
    getPOSTRequest
}

export default SignInDataService;