// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import path from 'path';
import fs from 'fs';
import { spawnSync, spawn } from 'child_process';
import { config } from 'dotenv';
config();

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

console.log("");
console.log("React Component Toolkit Component Generator - Replay");
console.log("----------------------------------------------------");
console.log("");

const replayRequestFile = "last_request.json";
const replayResponseFile = "last_response.md";

console.log("Replay Request Json File : " + replayRequestFile);

let replayRequestPath = path.join(process.env.DEBUG_DIR, "request");
replayRequestPath = path.join(replayRequestPath, replayRequestFile)

let replayResponsePath = path.join(process.env.DEBUG_DIR, "response");
replayResponsePath = path.join(replayResponsePath, replayResponseFile)

const replayRequestJson = fs.readFileSync(replayRequestPath, "utf8");
console.log(replayRequestJson);
console.log("");
console.log("Replay Response File is : " + replayResponseFile);
console.log("");

const fullresponseUnaltered = fs.readFileSync(replayResponsePath, "utf8");

if (fullresponseUnaltered.startsWith("Filename:")) {
  const fullresponse = replaceAll(fullresponseUnaltered, "```typescript", "```");
  const fileSections = fullresponse.split(/Filename: /g).slice(1);

  const files = fileSections.map(fileSection => {
    const [filename, blank, code] = fileSection.split(/(\n\n```|\n```)/g).map(str => str.replace(/^```/gm, '').trim());
    return { filename, blank, code };
  });
  const componentName = path.parse(files[0].filename).name.split('.')[0];

  const storyOutputPath = "./src/stories/";
  const unittestOutputPath = "./src/unittests/";
  const outputPath = `./src/components/${componentName.toLowerCase()}`;

  if (fs.existsSync(outputPath)) {
    console.log("Component Name: " + componentName);
    console.log("");
    console.log("A component with that name already exists, remove that component and try again, or specify a name for the component while creating.");
    process.exit(-1);
  }

  if (files.length >= 6) {
    console.log("Component Name: " + componentName);
    spawnSync("npm", ["run", "createtemplate", componentName]);

    for (const file in files) {
      if (files[file].filename.endsWith('.stories.tsx') || files[file].filename.endsWith('.test.tsx')) {
        const replaceText = `/${componentName}/`;
        const lcaseText = `/${componentName.toLowerCase()}/`;
        const newFileContent = replaceAll(files[file].code, replaceText, lcaseText);

        if (files[file].filename.endsWith('.stories.tsx')) {
          const storyOutputFile = path.join(storyOutputPath, files[file].filename);
          fs.writeFileSync(storyOutputFile, newFileContent, 'utf-8');
        }
        else {
          const unittestOutputFile = path.join(unittestOutputPath, files[file].filename);
          fs.writeFileSync(unittestOutputFile, newFileContent, 'utf-8');
        }
      }
      else if (files[file].filename.endsWith('.tsx') ||
        files[file].filename.endsWith('.types.ts') ||
        files[file].filename === "index.ts" ||
        files[file].filename === "package.json") {
        const outputFile = path.join(outputPath, files[file].filename);
        const outputCode = files[file].code;
        if (outputFile.endsWith(".types.ts")) {
          const newOutputCode = replaceAll(files[file].code, ';', ',');
          fs.writeFileSync(outputFile, newOutputCode, 'utf-8');
        }
        else {
          fs.writeFileSync(outputFile, files[file].code, 'utf-8');
        }
      }
      else {
        console.log("Additional files generated, showing but not saving.");
        console.log("Name: " + files[file].filename);
        console.log("Content: " + files[file].code);
      }
    }

    const outputUnitTestSnapshot = "./src/unittests/__snapshots__/";
    const outputSnapShot = path.join(outputUnitTestSnapshot, componentName + ".test.tsx.snap");
    if (fs.existsSync(outputSnapShot)) {
      fs.unlinkSync(outputSnapShot);
    }

    console.log("");
    console.log("Updating package json with dependencies and installing");
    const npminst = spawnSync('node', ['install.mjs']);
    console.log("")
    console.log("React-Component-Toolkit Co-pilot generated your component as : " + componentName);
    console.log("");
    console.log("  'npm run ladle:dev' to test it");
  }
  else {
    console.log("We weren't able to create that component, change up your description and try again.");
    console.log("");
    process.exit(-1);
  }
}
else {
  console.log(fullresponseUnaltered);
}