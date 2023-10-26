import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const scaffoldWidgetPrefix = "azure-api-management-widget-";
const distPath = "./dist";
if (process.argv.length > 2) {
  const componentName = process.argv[2].toLowerCase();

  let npmCmd = "npm";
  let npxCmd = "npx";

  if (process.platform === 'win32') {
    npmCmd = "npm.cmd";
    npxCmd = "npx.cmd";
  }

  function getWidgetScaffoldPath(componentName) {
      const scaffoldWidgetName = scaffoldWidgetPrefix + componentName.toLowerCase();
      const scaffoldWidgetPath = path.join(distPath, scaffoldWidgetName);
      return scaffoldWidgetPath;
  }

  function confirmContinuation() {  
    const userInput = prompt("Are you sure you want to continue (if the widget already exists in your portal, it will be overwritten)? (Type 'YES' to proceed)");  
      
    if (userInput === null || userInput.trim().toUpperCase() !== "YES") {  
      console.log("Exiting script..."); 
      process.exit(1);
    }  

    return;
  }  

  console.log(`React Component Toolkit - Widget Packager - ${componentName}`);
  const widgetPath = getWidgetScaffoldPath(componentName);

  if (!fs.existsSync(widgetPath)) {
    console.log("");
    console.log("ERROR: Either that widget has not been packaged or a widget does not exist with that name.");
    console.log("");
    console.log("  To package your component as an APIM widget:");
    console.log("");
    console.log("    npm run packagewidget <componentName>");
    console.log("");

    process.exit(1);
  }

  console.log("Deploying Widget to APIM portal...");
  spawnSync(npmCmd, ["run", "deploy"], { cwd: widgetPath, stdio: 'inherit' });
}
else
{
  console.log("");
  console.log("Incorrect parameters specified.");
}
