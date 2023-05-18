# React Component Toolkit


### What is the React Component Toolkit?
The react component toolkit is a toolkit for building and testing react components and includes a set of unique features including AI component generation and automatic conversion to Azure APIM Widgets.

---

#### Table of Contents

1. [Features](#features)
2. [Install with Azure CLI Dev Tools](#install-via-azdev)
3. [Install manually (no backend)](#manual-install)
4. [Quick Start](#quick-start)
5. [Notes](#notes)
6. [Contributing](#contributing)
7. [Trademarks](#trademarks)

---

## Features
- Integrates with Azure Open AI allowing the creation of components from a description alone.
- Can convert a react component into an Azure API Management Widget.
- Can be tested standalone using ladle which is built into the toolkit stack.
- Unit and code coverage testing through Jest (including snapshot testing).
- Uses css as code through Styled Components out of the box.
- Includes a few example components including a markdown viewer, force-graph-3d component, etc.
- Can create a new basic component with tests to scaffold a new component (or you can use AI and create a basis for a new one)
- Automatically adds dependencies for created components.
- Includes rollup for packaging components.

## Install via azdev

#### ⚠️ Note
```
Automatic Install uses azdev and includes installing Azure OpenAI and Azure APIM on your subscription.
```

Please use the Official Azure Samples github instructions to install and configure the toolkit via azdev.

[Azure Samples - react-component-toolkit](https://github.com/Azure-Samples/react-component-toolkit-openai-demo)

## Manual Install

#### ⚠️ Note
```
Manual installation requires .env file to be configured to enable Azure Open AI/Open AI and APIM Widget functionality.
An example .env.empty file is included, fill out the correct values and copy/rename to .env.
```

Pre-requisites: Latest stable release of Node.js

Installation:

1. Clone this repo and run ```node install.mjs``` in the root.

## Quick Start

* ```npm run ladle:dev``` to get started and see current component running with debugging available.
* ```npm run ladle:prod``` to get started and see current components running with a full production build.
* ```npm run cleanup``` - clear dist, build_artifacts and unittest coverage results.
* ```npm run rollup``` - runs ```rollup -c```
* ```npm run build``` - run ```npm cleanup``` followed by ```npm rollup```.
* ```npm run test``` - run unit tests from all components (src/unittests).
* ```npm run createnew [component_description]``` - create an AI generated component using Azure Open AI (configure via .env)
* ```npm run createtemplate [component_name]``` - to create a new ready to run component template with stories and unit tests.
* ```npm run removecomponent [component_name]``` - to delete a component and associated stories and unit tests.
* ```npm run packagewidget [existing_component_name]``` - to package a component as a widget for Azure API Management Developer Portal.
* ```npm run test (or npm test)``` - run all component unit tests
* ```npm run test:update``` - update all snapshots for unit tests
* ```npm run test:watch``` - run jest in watch mode

## Notes

- This project uses npm, however the initial package.json is dynamically created by running node install.mjs (see below)
- package.json is dynamically created is to ensure that each component defines it's own dependencies, these dependencies are merged for testing in ladle, unit tests and using rollup to package the entire project
- If you create the component manually:
  - A package.json should be placed in the components directory which contains only name, version and its dependencies, devDependencies and peerDependencies (see any component under src/components for an example)
- You must run npm updatepackages to cause an update to the root package.json.
- If you use ```npm createnew [component_name]``` to create a new component, ```npm updatepackages``` will happen for you the first time.
- In both cases, any time you add or remove npm dependencies you should add them to the component package.json under the component you are working on, or common/package.json if those dependencies are toolkit wid
e, after doing that you should run ```npm updatepackages```

---

## Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft
trademarks or logos is subject to and must follow
[Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general).
Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship.
Any use of third-party trademarks or logos are subject to those third-party's policies.
