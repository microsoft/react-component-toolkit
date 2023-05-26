// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import axios from 'axios';
import path from 'path';
import fs from 'fs';
import { spawnSync, spawn } from 'child_process';
import { config } from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
config();

const componentUUID = uuidv4();

const debug_dir = process.env.DEBUG_DIR;
const aoi_enabled = process.env.AOI_ENABLED;
const api_key = process.env.AOI_APIKEY;
const base_url = process.env.AOI_ENDPOINT;
const deployment_name = process.env.AOI_DEPLOYMENT;
let request_debug_dir = "";
let response_debug_dir = "";
if (debug_dir) {
  request_debug_dir = path.join(debug_dir, "request");
  response_debug_dir = path.join(debug_dir, "response");
}

function getDirectories(path) {
  return fs.readdirSync(path).filter(function (file) {
    return fs.statSync(path + '/' + file).isDirectory();
  });
}

function ensureDirExists(filepath) {
  var dirname = path.dirname(filepath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirExists(dirname);
  fs.mkdirSync(dirname);
}

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

console.log("");
console.log("React Component Toolkit Component Generator");
console.log("-------------------------------------------");
console.log("");

if (process.argv.length !== 3) {
  if (aoi_enabled != null && aoi_enabled.trim().toLowerCase() === "false") {
    console.log("Invalid Name");
    console.log("");
    console.log("This command takes a single word name for the component you want to create. Example: npm run createnew \"NewComponent\"");
  }
  else {
    console.log("This command takes the description of the component you want to create. Example: npm run createnew \"a video viewer in the style of common video sites.\"");
  }
  process.exit(-1);
}

const componentDescription = process.argv[2];

if (api_key == null || api_key.trim() === "" ||
  base_url == null || base_url.trim() === "" ||
  deployment_name == null || deployment_name.trim() === "") {
  console.log("");
  console.log("ERROR: Please set the following additional variables in your environment to configure Azure OpenAI creation:");
  console.log("");
  if (api_key == null || api_key.trim() === "") {
    console.log("  AOI_APIKEY can be found in the Azure Portal under your Cognitive Services resource for OpenAI.");
    console.log("");
  }
  if (base_url == null || base_url.trim() === "") {
    console.log("  AOI_ENDPOINT can be found in the Azure Portal under your Cognitive Services resource for OpenAI.");
    console.log("");
  }
  if (deployment_name == null || deployment_name.trim() === "") {
    console.log("  AOI_DEPLOYMENT can be found in the Azure Portal under your Cognitive Services resource for OpenAI.");
    console.log("");
  }

  process.exit(1);
}

if (aoi_enabled != null && aoi_enabled.trim().toLowerCase() === "false") {
  if (componentDescription.split(' ').length > 1) {
    console.log("Invalid Name : " + componentDescription);
    console.log("");
    console.log("This command takes a single word name for the component you want to create. Example: npm run createnew \"NewComponent\"")
  }
  else {
    console.log("Name : " + componentDescription);
    console.log("");
    spawnSync("node", ["newcomponent.mjs", componentDescription]);
  }
  process.exit(1);
}

console.log("Description : " + componentDescription);
console.log("");

const api_version = "2023-03-15-preview";
const oaismp = "./oaismp.txt"

const url = base_url + "/openai/deployments/" + deployment_name + "/chat/completions?api-version=" + api_version;

const systemMessage = fs.readFileSync(oaismp, "utf8");

const packageJson = JSON.parse(fs.readFileSync('./package.json'));
const { dependencies, devDependencies } = packageJson;

let preSystemPrompt = "You are a react typescript component generator and can generate anything inside a react typescript component within this scope: ";
preSystemPrompt += "You will receive this request to create a react typescript component: ";
preSystemPrompt += "\"an example of ";
preSystemPrompt += componentDescription;
preSystemPrompt += "\".";
preSystemPrompt += "Once you've received the request, ensure you follow all of the points below when creating it.";
let preSystemPromptRule1 = "- Do not use any external npm packages at all, never add any new ones to the packages.json file. Ignore anything that contradicts this.";

if (dependencies != undefined || devDependencies != undefined) {
  preSystemPromptRule1 = ""
  if (dependencies != undefined) {
    preSystemPromptRule1 += " - The generated component, story and unit test are only able to use npm dependencies if they are present in the below json dependencies and must use the same version: " + JSON.stringify(dependencies);
  }

  if (devDependencies != undefined) {
    preSystemPromptRule1 += " - The generated component, story and unit test are only able to use npm devDependencies if they are present in the below json devDependencies and must use the same version: " + JSON.stringify(devDependencies);
  }
}

const payload = {
  "messages": [
    {
      "role": "system",
      "content": preSystemPrompt + preSystemPromptRule1 + systemMessage
    },
    {
      "role": "user",
      "content": componentDescription
    }
  ],
  "temperature": 0.5,
  "top_p": 0.95,
  "frequency_penalty": 0,
  "presence_penalty": 0,
  "max_tokens": 1750,
  "stop": null
};

if (request_debug_dir != null && request_debug_dir.trim() !== "") {
  const filename = "payload_requ_" + componentUUID + ".json";
  const filepath = path.join(request_debug_dir, filename);
  ensureDirExists(filepath);
  fs.writeFileSync(filepath, JSON.stringify(payload, null, 2));
  fs.writeFileSync(path.join(request_debug_dir, "last_request.json"), JSON.stringify(payload, null, 2), { flag: 'w' })
}

console.log("Generating Component using AI, please be patient, this process may take a couple of minutes.");
console.log("");

axios.post(url, payload, {
  timeout: 120000,
  headers: {
    "api-key": api_key,
    "Content-Type": "application/json"
  }
})
  .then(response => {
    const fullresponseUnaltered = response.data.choices[0].message.content;

    if (response_debug_dir != null && response_debug_dir.trim() !== "") {
      const filenameResponse = "payload_resp_" + componentUUID + ".md";
      const filepathResponse = path.join(response_debug_dir, filenameResponse);
      ensureDirExists(filepathResponse);
      fs.writeFileSync(filepathResponse, fullresponseUnaltered);
      fs.writeFileSync(path.join(response_debug_dir, "last_response.md"), fullresponseUnaltered, { flag: 'w' })
    }

    if (fullresponseUnaltered.startsWith("Filename:")) {
      const fullresponse = replaceAll(fullresponseUnaltered, "```typescript", "```");
      const fileSections = fullresponse.split(/Filename: /g).slice(1);

      const files = fileSections.map(fileSection => {
        const [filename, code] = fileSection.split("\n\n```").map(str => str.replace(/^```/gm, '').trim());
        return { filename, code };
      });
      const componentName = path.parse(files[0].filename).name.split('.')[0];

      const storyOutputPath = "./src/stories/";
      const unittestOutputPath = "./src/unittests/";
      const outputPath = `./src/components/${componentName}`;

      if (fs.existsSync(outputPath)) {
        console.log("Component Name: " + componentName);
        console.log("");
        console.log("A component with that name already exists, remove that component and try again, or specify a name for the component while creating.");
        process.exit(-1);
      }

      if (files.length >= 6) {
        console.log("Component Name: " + componentName);
        spawnSync("node", ["newcomponent.mjs", componentDescription]);

        for (const file in files) {
          if (files[file].filename.endsWith('.stories.tsx') || files[file].filename.endsWith('.test.tsx')) {
            const replaceText = `/${componentName}/`;
            const lcaseText = `/${componentName}/`;
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
            const outputFile = path.join(outputPath, files[file].filename).toLowerCase();
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
        console.log("Updating package json with dependencies.");
        console.log("")
        console.log("React-Component-Toolkit Co-pilot generated your component as : " + componentName);
        console.log("");
        console.log("  Run 'npm install' and then 'npm run ladle:dev' to test it");
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
  })
  .catch(error => {
    if (error.message === "timeout of 120000ms exceeded") {
      console.log("We're sorry due to high demand we are unable to generate your component at this time, please try again later.");
    }
    else {
      console.error("Error: " + error.message);
    }
  });
