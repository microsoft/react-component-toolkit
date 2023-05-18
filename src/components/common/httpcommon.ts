// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import axios from "axios";

export default axios.create({
  headers: {
    "Content-type": "application/json"
  }
});