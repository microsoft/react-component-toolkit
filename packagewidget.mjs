// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { config } from 'dotenv';
config();

let npmCmd = "npm";
let npxCmd = "npx";

if (process.platform === 'win32') {
  npmCmd = "npm.cmd";
  npxCmd = "npx.cmd";
}

const scaffoldingNpm = "@azure/api-management-custom-widgets-scaffolder";
const manageEndpointApi = "management.azure.com";
const techonologyId = "react";
const distPath = "./dist";

const scaffoldWidgetPrefix = "azure-api-management-widget-";

const valuesPlaceHolder = "[RCT_VALUES]";
const valuesDefaultsPlaceHolder = "[RCT_VALUES_DEFAULT]";
const editorInputFieldsPlaceHolder = "[EDITOR_INPUT_FIELDS]";
const appWidgetComponentPlaceHolder = "[WIDGET_COMPONENT]";

const componentName = process.argv[2].toLowerCase();
const openUrl = process.env.APIM_OPENURL;
const resourceId = process.env.APIM_RESOURCEID;

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

function getWidgetScaffoldPath(componentName) {
  const scaffoldWidgetName = scaffoldWidgetPrefix + componentName.toLowerCase();
  const scaffoldWidgetPath = path.join(distPath, scaffoldWidgetName);
  return scaffoldWidgetPath;
}

function installScaffolding(componentName, openUrl, resourceId, technology, managementApiEndpoint) {
  const param1 = "--yes";
  const param2 = scaffoldingNpm;
  const param3 = "--displayName=\"" + componentName.toLowerCase() + "\"";
  const param4 = "--openUrl=\"" + openUrl + "\"";
  const param5 = "--resourceId=\"" + resourceId + "\"";
  const param6 = "--technology=\"" + technology + "\"";
  const param7 = "--managementApiEndpoint=\"" + managementApiEndpoint + "\"";
  const currentWorkingDirectory = `${distPath}`;
  spawnSync(
    npxCmd,
    [param1, param2, param3, param4, param5, param6, param7],
    {
      cwd: currentWorkingDirectory,
      stdio: 'inherit'
    }
  );
}

function getStoryArgs(fileContent, propsType) {
  const regex = RegExp(`export const (\\w+):.*Story<${propsType}>.*=`, "");
  const storyMatch = fileContent.match(regex);

  if (!storyMatch) {
    throw new Error(`Could not find Story<${propsType}> declaration in fileContent`);
  }

  const storyName = storyMatch[1];

  const argsRegex = new RegExp(`^${storyName}.args\\s*=\\s*({[\\s\\S]+?^});`, "m");
  const argsMatch = fileContent.match(argsRegex);

  if (!argsMatch || argsMatch.length < 2) {
    throw new Error(`Could not find args object for ${storyName}`);
  }

  let argsString = argsMatch[1].replace(/'/g, '"');
  argsString = argsString.replace(/(\w+)(: )/g, '"$1"$2');
  argsString = argsString.replace(",\\n}", "\\n}");
  argsString = argsString.replace(",\n}", "\n}");

  let args = JSON.parse(argsString, null, 4);

  const argsTypesRegex = new RegExp(`^${storyName}.argTypes\\s*=\\s*({[\\s\\S]+?^});`, "m");
  const argsTypesMatch = fileContent.match(argsTypesRegex);
  if (!argsTypesMatch || argsTypesMatch.length < 2) {
    return args;
  }

  const argTypesString = argsTypesMatch[1];
  const extractedValuesRegEx = /(\b\w+\b)\s*:\s*{\s*options:\s*\[[^\]]*\],\s*control:\s*{\s*type:\s*"select"\s*},\s*defaultValue:\s*(".*?"|\b(?:true|false|\d+)\b)\s*}/g
  let extractValueMatch;
  while ((extractValueMatch = extractedValuesRegEx.exec(argTypesString)) !== null) {
    const [, key, value] = extractValueMatch;
    let newvalue = isNaN(value) ? value.replace(/^['"]|['"]$/g, "") : parseFloat(value);
    args[key] = newvalue;
  }

  return args;
}

function getInterfaceName(interfaceDef) {
  const regex = /export interface (\w+)/m;
  const match = interfaceDef.match(regex);

  if (!match || match.length < 2) {
    return "";
  }

  return match[1];
}

function extractPropsAndTypes(inputString, argsObject) {
  const regex = /^\s*(\w+)\s*\??\s*:\s*(string|number|boolean)\s*(,|$)/gm;
  const matches = inputString.matchAll(regex);
  const result = [];
  for (const match of matches) {
    if (argsObject[match[1]] != undefined) {
      result.push(`${match[1]}: ${match[2]}`);
    }
  }

  return result;
}

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function createAppTsx(componentName, appTemplateFile, componentPropsFile, storiesFile) {
  const template = fs.readFileSync(appTemplateFile, 'utf8');
  const interfaceDefinition = fs.readFileSync(componentPropsFile, 'utf8');
  const argsDefinition = fs.readFileSync(storiesFile, 'utf8');
  let interfaceName = getInterfaceName(interfaceDefinition);
  const argsObject = getStoryArgs(argsDefinition, interfaceName);
  const componentImport = `import ${capitalizeFirstLetter(componentName)} from "../component/${componentName}"\n`;
  const propsImport = `import { ${interfaceName} } from "../component/${componentName}.types"\n`;
  let widgetComponent = `<${capitalizeFirstLetter(componentName)}\n`;
  Object.keys(argsObject).forEach(arg => {
    widgetComponent += `        ${arg}={values.${arg}}\n`;
  });
  widgetComponent += "      />";
  const insertWidget = template.replace(appWidgetComponentPlaceHolder, widgetComponent);
  const outputFile = componentImport + propsImport + insertWidget;
  return outputFile;
}

function createEditorTsx(editorTemplateFile, componentPropsFile, storiesFile) {
  const template = fs.readFileSync(editorTemplateFile, 'utf8');
  const interfaceDefinition = fs.readFileSync(componentPropsFile, 'utf8');
  const argsDefinition = fs.readFileSync(storiesFile, 'utf8');
  let interfaceName = getInterfaceName(interfaceDefinition);
  const argsObject = getStoryArgs(argsDefinition, interfaceName);
  let inputFieldOutputs = "";
  Object.keys(argsObject).forEach(arg => {
    let value = argsObject[arg];
    let newvalue = isNaN(value) ? `"${value}"` : parseFloat(value);
    inputFieldOutputs += `\n      <InputField valueKey="${arg}" title="${value}" />`;
  });
  inputFieldOutputs += "\n    ";
  let editorOutput = template.replace(editorInputFieldsPlaceHolder, inputFieldOutputs);
  return editorOutput;
}

function createValuesTS(valuesTemplateFile, componentPropsFile, storiesFile) {
  const template = fs.readFileSync(valuesTemplateFile, 'utf8');
  const interfaceDefinition = fs.readFileSync(componentPropsFile, 'utf8');
  const argsDefinition = fs.readFileSync(storiesFile, 'utf8');

  let interfaceName = getInterfaceName(interfaceDefinition);

  const argsObject = getStoryArgs(argsDefinition, interfaceName);
  const props = extractPropsAndTypes(interfaceDefinition, argsObject);
  let typeMembersOutput = "";
  for (const prop in props) {
    typeMembersOutput += `\n  ${props[prop]}`;
  }
  typeMembersOutput += "\n";

  let valuesOutput = template.replace(valuesPlaceHolder, typeMembersOutput);

  let typeDefaultsOutput = "";
  Object.keys(argsObject).forEach(arg => {
    let value = argsObject[arg];
    value = replaceAll(value, '\n', "\\n");
    let isNumber = !isNaN(value);
    let newvalue;
    let isBoolean = (`${value}` == "true" || `${value}` == "false") ? true : false;
    if (isNumber || isBoolean) {
      newvalue = isBoolean ? value : parseFloat(value);
    }
    else {
      newvalue = `'${value}'`;
    }
    typeDefaultsOutput += `\n  ${arg}: ${newvalue},`;
  });
  typeDefaultsOutput += "\n";

  valuesOutput = valuesOutput.replace(valuesDefaultsPlaceHolder, typeDefaultsOutput);

  return valuesOutput;
}

function mergePackageJson(inputPackageJson, toMergePackageJson) {
  const outputPackageJson = { ...inputPackageJson };
  const dependencies = ['dependencies', 'devDependencies', 'peerDependencies'];

  dependencies.forEach(depType => {
    if (outputPackageJson[depType] && toMergePackageJson[depType]) {
      Object.keys(toMergePackageJson[depType]).forEach(dep => {
        const version1 = outputPackageJson[depType][dep];
        const version2 = toMergePackageJson[depType][dep];
        const highestVersion = version1 && version2 ? (version1 > version2 ? version1 : version2) : (version1 || version2);

        if (outputPackageJson[depType][dep]) {
          if (highestVersion > outputPackageJson[depType][dep]) {
            outputPackageJson[depType][dep] = highestVersion;
          }
        } else {
          outputPackageJson[depType][dep] = highestVersion;
        }
      });
    } else if (toMergePackageJson[depType]) {
      outputPackageJson[depType] = toMergePackageJson[depType];
    } else if (outputPackageJson[depType]) {
      outputPackageJson[depType] = outputPackageJson[depType];
    }
  });

  return outputPackageJson;
}

console.log(`React Component Toolkit - Widget Packager - ${componentName}`);

if (openUrl == null || openUrl == "" || resourceId == null || resourceId == "") {
  console.log("");
  console.log("ERROR: Please set the variables APIM_OPENURL and APIM_RESOURCEID in .env file as the project root.");
  console.log("");
  console.log("  APIM_OPENURL is your APIM developer portal base url in the following format (all lower case) :");
  console.log("");
  console.log("    https://<api-management service-name>.developer.azure-api.net");
  console.log("");
  console.log("  APIM_RESOURCEID is the ResourceId of your API Management Service in the following format : ")
  console.log("");
  console.log("    subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.ApiManagement/service/<api-management service-name>");
  console.log("");

  process.exit(1);
}

const widgetPath = getWidgetScaffoldPath(componentName);
const fileName = "tsconfig.json";
const filePath = path.join(widgetPath, fileName);

const toolkitSource = "./src";
const componentsSource = path.join(toolkitSource, "components");
const componentsCommonSource = path.join(componentsSource, "common");
const componentSource = path.join(componentsSource, componentName);

if (!fs.existsSync(componentSource)) {
  console.log("");
  console.log(`ERROR: could not find the component at path : ${componentSource}`);
  console.log("");
  console.log("Note: components names should always be lowercase.");
  console.log("");
  process.exit(1);
}

const widgetSource = path.join(widgetPath, "src");
const widgetCommon = path.join(widgetSource, "common");
const widgetComponent = path.join(widgetSource, "component");

console.log("[UPDATE] Building Widget Scaffolding");

if (!fs.existsSync(distPath)) {
  fs.mkdirSync(distPath);
}
installScaffolding(componentName, openUrl, resourceId, techonologyId, manageEndpointApi);
console.log('[DONE] Building Widget Scaffolding');

console.log('[UPDATE] Creating folders and copying components');
if (!fs.existsSync(widgetCommon)) {
  fs.mkdirSync(widgetCommon);
};
if (!fs.existsSync(widgetComponent)) {
  fs.mkdirSync(widgetComponent);
}
fs.cpSync(path.join(process.cwd(), componentsCommonSource),
  path.join(process.cwd(), widgetCommon)
  , { recursive: true });
fs.cpSync(path.join(process.cwd(), componentSource),
  path.join(process.cwd(), widgetComponent)
  , { recursive: true });
console.log('[DONE] Creating folders and copying components');

console.log('[UPDATE] Widget JSON properties in tsconfig.');
const data = fs.readFileSync(filePath);
const jsonData = JSON.parse(data);
jsonData.compilerOptions.skipLibCheck = true;
jsonData.compilerOptions.forceConsistentCasingInFileNames = false;
jsonData.compilerOptions.strict = false;
fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 4));
console.log('[DONE] Widget JSON properties in tsconfig.');

console.log('[UPDATE] Merge component and widget package JSONs');
const scriptPackageFile = 'src/component/package.json';
const commonPackageFile = 'src/common/package.json'
const packagePath = 'package.json';
const mainPackagePath = path.join(widgetPath, packagePath);
const mainPackageFile = fs.readFileSync(mainPackagePath);
const packageJsonMain = JSON.parse(mainPackageFile);
const scriptPackagePath = path.join(widgetPath, scriptPackageFile);
const mergePackageFile = fs.readFileSync(scriptPackagePath);
const packageJsonMerge = JSON.parse(mergePackageFile);
let combinedJson = mergePackageJson(packageJsonMain, packageJsonMerge);
const commonPackagePath = path.join(widgetPath, commonPackageFile);
const commonMergePackageFile = fs.readFileSync(commonPackagePath);
const commonPackageJsonMerge = JSON.parse(commonMergePackageFile);
combinedJson = mergePackageJson(combinedJson, commonPackageJsonMerge);
fs.writeFileSync(mainPackagePath, JSON.stringify(combinedJson, null, 4));
console.log('[DONE] Merge component and widget package JSONs');

console.log('[UPDATE] Rollup build configuration.');
const rollupConfigFile = "vite.config.ts";
const rollupConfigPath = path.join(widgetPath, rollupConfigFile);
const rollupConfigData = fs.readFileSync(rollupConfigPath, 'utf-8');
const componentPath = "./src/component/" + componentName + ".tsx";
const rollupConfigLines = rollupConfigData.split(/\r?\n/);
let inBuildSection = false;
let buildSectionIndentation = '';
const newBuildLines = [];
for (const line of rollupConfigLines) {
  if (inBuildSection && line.trim() === '},') {
    newBuildLines.push(`${buildSectionIndentation}${componentName.toLowerCase()}: "${componentPath}"`);
    inBuildSection = false;
  }

  if (inBuildSection) {
    const match = line.match(/^(\s*)/);
    if (match) {
      buildSectionIndentation = match[1];
    }
  }
  else if (line.includes('build: {')) {
    inBuildSection = true;
  }

  newBuildLines.push(line);
}

const newRollupConfig = newBuildLines.join('\n');
fs.writeFileSync(rollupConfigPath, newRollupConfig, 'utf-8');
console.log('[DONE] Rollup build configuration.');

console.log('[GENERATE] Widget Implementation.');
const componentSuffix = process.argv.length > 5 ? process.argv[5] : "";
const valuesTemplateFile = "./templates/values_template";
const editorTemplateFile = "./templates/widget_editor_template";
const appTemplateFile = "./templates/widget_template";
const valuesOutputFile = path.join(widgetPath, "src/values.ts");
const valuesBackupFile = path.join(widgetPath, "src/values.backup");
const editorOutputFile = path.join(widgetPath, "src/editor/index.tsx");
const editorBackupFile = path.join(widgetPath, "src/editor/index.backup");
const appOutputFile = path.join(widgetPath, "src/app/index.tsx");
const appBackupFile = path.join(widgetPath, "src/app/index.backup");
const componentPropsFile = path.join(widgetPath, "/src/component/" + componentName + ".types.ts");
const storiesFile = path.join("./src/stories/", componentName + componentSuffix + ".stories.tsx");

{
  console.log('\t[FILE] Generate values.ts ');
  const output = createValuesTS(valuesTemplateFile, componentPropsFile, storiesFile);
  fs.renameSync(valuesOutputFile, valuesBackupFile);
  fs.writeFileSync(valuesOutputFile, output, 'utf-8');
} console.log('\t[DONE] Generate values.ts');

{
  console.log('\t[FILE] Generate Editor Configuration');
  const editorOutput = createEditorTsx(editorTemplateFile, componentPropsFile, storiesFile);
  fs.renameSync(editorOutputFile, editorBackupFile);
  fs.writeFileSync(editorOutputFile, editorOutput, 'utf-8');
} console.log('\t[DONE] Generate Editor Configuration');

{
  console.log('\t[FILE] Generate Widget app');
  const appOutput = createAppTsx(componentName, appTemplateFile, componentPropsFile, storiesFile);
  fs.renameSync(appOutputFile, appBackupFile);
  fs.writeFileSync(appOutputFile, appOutput, 'utf-8');
} console.log('\t[DONE] Generate Widget app');

console.log('[DONE] Widget Implementation');

console.log("Installing Widget Dependencies...");
spawnSync(npmCmd, ["install"], { cwd: widgetPath, stdio: 'inherit' });

console.log("Building Widget...");
spawnSync(npmCmd, ["run", "build"], { cwd: widgetPath, stdio: 'inherit' });

console.log("Running Widget on host mode");
spawnSync(npmCmd, ["run", "host"], { cwd: widgetPath, stdio: 'inherit' });
