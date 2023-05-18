// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import fs from 'fs';
import path from 'path';

const componentName = process.argv[2].toLowerCase();

const componentDir = "./src/components/" + componentName;

const componentPlaceHolderName = "ComponentTemplate";
const componentUCTemplateName = "UCCompTemplate";
const componentIndexTsFile = "index.ts"
const componentPackageJson = "package.json";
const componentTsxFile = componentPlaceHolderName + ".tsx";
const componentTypesFile = componentPlaceHolderName + ".types.ts";
const componentStoriesFile = componentPlaceHolderName + ".stories.tsx";
const componentSnapShotFile = componentPlaceHolderName + ".test.tsx.snap";
const componentUnitTestFile = componentPlaceHolderName + ".test.tsx";

const rollupConfigPath = "./rollup.config.js";
const rollupConfigBackupPath = rollupConfigPath + ".backup";

const templateDir = "./templates/tempcomp/";
const indexTsPath = path.join(templateDir, componentIndexTsFile);
const packageJsonPath = path.join(templateDir, componentPackageJson);
const tsxPath = path.join(templateDir, componentTsxFile);
const typesPath = path.join(templateDir, componentTypesFile);
const storiesPath = path.join(templateDir, componentStoriesFile);
const snapShotPath = path.join(templateDir, componentSnapShotFile);
const unitTestPath = path.join(templateDir, componentUnitTestFile);

const outputIndexTs = path.join(componentDir, componentIndexTsFile);
const outputPackageJson = path.join(componentDir, componentPackageJson);
const outputTsx = path.join(componentDir, componentName + ".tsx");
const outputTypes = path.join(componentDir, componentName + ".types.ts");

const outputStoriesPath = "./src/stories/";
const outputUnitTestSnapshot = "./src/unittests/__snapshots__/";
const outputUnitTestPath = "./src/unittests/";

const outputStories = path.join(outputStoriesPath, componentName + ".stories.tsx");
const outputUnitTest = path.join(outputUnitTestPath, componentName + ".test.tsx");
const outputSnapShot = path.join(outputUnitTestSnapshot, componentName + ".test.tsx.snap");

console.log(`React Component Toolkit - Create New Component - ${componentName}`);
console.log("");

const addDirectImport = (text, importName, importPath) => {
    const startSectionRegex = /^const\sdirectImports\s*=\s*{/;
    const endSectionRegex = /^}/;
    const lines = text.split('\n');
    const newLines = [];
    let addComplete = false;

    lines.forEach(line => {
        if (!addComplete && startSectionRegex.test(line)) {
            newLines.push(line);
            newLines.push(`    ${importName}: '${importPath}',`);
            addComplete = true
        }
        else {
            newLines.push(line);
        }
    });

    return newLines.join('\n');
};

if (!fs.existsSync(componentDir)) {

    console.log("  [CREATE] Directory: " + componentDir);
    fs.mkdirSync(componentDir);

    const componentRegEx = new RegExp(componentPlaceHolderName, 'g');
    const componentUCTemplateRegEx = new RegExp(componentUCTemplateName, 'g');

    console.log("  [CREATE] File: " + outputIndexTs);
    const indexTsSource = fs.readFileSync(indexTsPath, 'utf8');
    const newIndexTsOutput = indexTsSource.replace(componentRegEx, componentName);
    fs.writeFileSync(outputIndexTs, newIndexTsOutput, 'utf8');

    console.log("  [CREATE] File: " + outputPackageJson);
    const packageJsonSource = fs.readFileSync(packageJsonPath, 'utf8');
    const newPackageJsonOutput = packageJsonSource.replace(componentRegEx, componentName);
    fs.writeFileSync(outputPackageJson, newPackageJsonOutput, 'utf8');

    console.log("  [CREATE] File: " + outputTsx);
    const componentTsxSource = fs.readFileSync(tsxPath, 'utf8');
    let newComponentTsxOutput = componentTsxSource.replace(componentRegEx, componentName);
    fs.writeFileSync(outputTsx, newComponentTsxOutput, 'utf8');

    console.log("  [CREATE] File: " + outputTypes);
    const componentTypesSource = fs.readFileSync(typesPath, 'utf8');
    const newComponentTypesOutput = componentTypesSource.replace(componentRegEx, componentName);
    fs.writeFileSync(outputTypes, newComponentTypesOutput, 'utf8');

    console.log("  [CREATE] File: " + outputPackageJson);
    const componentStorySource = fs.readFileSync(storiesPath, 'utf8');
    let newComponentStoryOutput = componentStorySource.replace(componentUCTemplateRegEx, capitalizeFirstLetter(componentName));
    newComponentStoryOutput = newComponentStoryOutput.replace(componentRegEx, componentName);

    fs.writeFileSync(outputStories, newComponentStoryOutput, 'utf8');

    console.log("  [CREATE] File: " + outputSnapShot);
    const componentSnapShotSource = fs.readFileSync(snapShotPath, 'utf8');
    const newComponentSnapShotOutput = componentSnapShotSource.replace(componentRegEx, componentName);
    fs.writeFileSync(outputSnapShot, newComponentSnapShotOutput, 'utf8');

    console.log("  [CREATE] File: " + outputUnitTest);
    const componentUnitTestSource = fs.readFileSync(unitTestPath, 'utf8');
    let newComponentUnitTestOutput = componentUnitTestSource.replace(componentRegEx, componentName);
    fs.writeFileSync(outputUnitTest, newComponentUnitTestOutput, 'utf8');

    console.log("  [BACKING UP] Rollup Configuration to " + rollupConfigBackupPath);
    const rollupConfigFile = fs.readFileSync(rollupConfigPath, 'utf8');
    fs.writeFileSync(rollupConfigBackupPath, rollupConfigFile, 'utf-8');

    console.log("  [UPDATING] Rollup Configuration");
    const newRollupConfig = addDirectImport(rollupConfigFile, componentName, `src/components/${componentName}/index.ts`);
    fs.writeFileSync(rollupConfigPath, newRollupConfig, 'utf-8');

    console.log("");
    console.log(`All done, your new component ${componentName} is located in : ${componentDir}`);
    console.log("");
    console.log("  To run the component, run the following command:");
    console.log("    npm run ladle:dev");
    console.log("");
}
else {
    console.log(`  [ERROR] Component already exists: ${componentDir}`);
    console.log("");
    console.log("  To remove the existing component, run the following command:");
    console.log("    npm run removecomponent " + componentName);
    console.log("");
    process.exit(1);
}

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}