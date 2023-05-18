// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import fs from 'fs';
import path from 'path';
import readline from 'readline';

console.log("React Component Toolkit - Remove Existing Component");

if (process.argv.length !== 3) {
    console.log("Usage: npm run removecomponent <component name>");
    console.log("");
    process.exit(0);
}

const componentName = process.argv[2].toLowerCase();

console.log("");
console.log("Deleting Component : " + componentName);
console.log("");

const componentDir = ("./src/components/" + componentName);
const rollupComponentDir = componentDir.substring(2);

const outputDistDir = "./dist/azure-api-management-widget-" + componentName;
const outputStoriesPath = "./src/stories/";
const outputUnitTestSnapshot = "./src/unittests/__snapshots__/";
const outputUnitTestPath = "./src/unittests/";

const outputStories = path.join(outputStoriesPath, componentName + ".stories.tsx");
const outputUnitTest = path.join(outputUnitTestPath, componentName + ".test.tsx");
const outputSnapShot = path.join(outputUnitTestSnapshot, componentName + ".test.tsx.snap");

const componentEntry = (`\n    ${componentName}: '${rollupComponentDir}/index.ts',`);

const rollupConfigPath = "./rollup.config.js";
const rollupConfigBackupPath = rollupConfigPath + ".backup";

var rl = readline.createInterface(process.stdin, process.stdout);
rl.question(`Type 'yes' to DELETE the component ${componentDir} and associated unit tests and stories : ? [yes]/no: `, function (answer) {
    if (answer === 'yes') {
        if (fs.existsSync(componentDir)) {
            console.log("  [DELETE] Removing Component :  " + componentDir);
            fs.rmdirSync(componentDir, { recursive: true, force: true });
        };
        if (fs.existsSync(outputDistDir)) {
            console.log("  [DELETE] Removing Widget : " + outputDistDir);
            fs.rmdirSync(outputDistDir, { recursive: true, force: true });
        };
        if (fs.existsSync(outputStories)) {
            console.log("  [DELETE] Removing Story :  " + outputStories);
            fs.rmSync(outputStories, { force: true });
        }
        if (fs.existsSync(outputUnitTest)) {
            console.log("  [DELETE] Removing Unit Test :  " + outputUnitTest);
            fs.rmSync(outputUnitTest, { force: true });
        }
        if (fs.existsSync(outputSnapShot)) {
            console.log("  [DELETE] Removing Snapshot :  " + outputSnapShot);
            fs.rmSync(outputSnapShot, { force: true });
        }
        rl.close();

        const rollupConfigFile = fs.readFileSync(rollupConfigPath, 'utf8');
        if (rollupConfigFile.includes(componentEntry)) {
            console.log("  [BACKING UP] Rollup Configuration to " + rollupConfigBackupPath);
            fs.writeFileSync(rollupConfigBackupPath, rollupConfigFile, 'utf-8');

            console.log("  [UPDATING] Rollup Configuration");
            const newRollupConfigFile = rollupConfigFile.replace(componentEntry, "");
            fs.writeFileSync(rollupConfigPath, newRollupConfigFile, 'utf-8');
        }

        console.log("");
        console.log(`All done, component ${componentName} was removed from : ${componentDir}`);
        console.log("");
        process.exit(0);
    }
    else {
        rl.close();
        console.log("");
        console.log("Aborted, no changes made.");
        process.exit(1);
    }
});
