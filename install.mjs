// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

function findFiles(directories, filenamePattern) {
  const results = [];

  for (const directory of directories) {
    const files = fs.readdirSync(directory);

    for (const file of files) {
      const filePath = path.join(directory, file);
      const stat = fs.statSync(filePath);
      if (stat.isFile() && file.match(filenamePattern)) {
        results.push(filePath);
      } else if (stat.isDirectory()) {
        const subResults = findFiles([filePath], filenamePattern);
        results.push(...subResults);
      }
    }
  }

  return results;
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

function processFiles(res) {
  if (!res || res.length == 0) { console.log('Nothing to do'); }
  else {
    let mainPackagePath = "./package-base.json";
    let tempPackagePath = "./package-combined.json";

    if (fs.existsSync(tempPackagePath)) {
      fs.unlinkSync(tempPackagePath);
    }

    for (var index = 0; index < res.length; index++) {
      const mainPackageFile = fs.readFileSync(mainPackagePath);
      const packageJsonMain = JSON.parse(mainPackageFile);

      const mergePackageFile = fs.readFileSync(res[index]);
      const packageJsonMerge = JSON.parse(mergePackageFile);

      let combinedJson = mergePackageJson(packageJsonMain, packageJsonMerge);
      fs.writeFileSync(tempPackagePath, JSON.stringify(combinedJson, null, 4));

      mainPackagePath = tempPackagePath;
    }

    fs.rename(tempPackagePath, "./package.json", function (rename_err) {
      if (rename_err) {
        console.log("Rename error: " + rename_err);
      }
    });
  }
}

const directories = ['./src/components/'];
const files = findFiles(directories, 'package.json');
processFiles(files);
console.log("");
console.log("React Component Toolkit has been initialized, installing default npm packages for all components.");
console.log("--------------------------------------------------------------------------------------------------");
console.log("");
console.log("Installing... (once complete type 'npm run' to see available options or refer to README.md)");
const npminst = spawn('npm', ['install']);
npminst.stdout.setEncoding('utf8');
npminst.stdout.on('data', function (data) {
  console.log(data);
});
