// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { setupWorker, SetupWorkerApi } from "msw";

export class WorkerFactory {
    private static instance: SetupWorkerApi;

    private constructor() {}

    public static getWorker(): SetupWorkerApi {
        if (!WorkerFactory.instance) {
            WorkerFactory.instance = setupWorker();
            WorkerFactory.instance.start();
        }
        return WorkerFactory.instance;
    }
}

export default WorkerFactory;
