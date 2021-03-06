import { ARTIFACT_JS_SRC, BRICKS_DIR } from './constants';

const generateScript = async (
  pageDataFileName: string,
  appName: string,
  buildDir: string
): Promise<string> => {
  const fs = await import('fs-extra');
  const path = await import('path');

  const artifactJSPath = path.join(buildDir, ARTIFACT_JS_SRC);
  await fs.ensureDir(artifactJSPath);

  const appScript = `
import React from "react"
import { App } from "@franreysaycon/bricks";
import Component from "../../${BRICKS_DIR}/${appName}";

export default ({ pageData, routesData }) => (
    <App Component={Component} pageData={pageData} routesData={routesData} />
);
`;

  await fs.writeFile(`${artifactJSPath}/${appName}_app.jsx`, appScript);

  const jsScript = `
import ReactDOM from "react-dom";
import React from "react";
import { DOCUMENT_ID } from "@franreysaycon/bricks";
import App from "./${appName}_app"
import pageData from "../pages_data/${pageDataFileName}";
import routesData from "../routes.json"

ReactDOM.hydrate(<App pageData={pageData} routesData={routesData} />, document.getElementById(DOCUMENT_ID));
`;

  const fileName = pageDataFileName.split('.')[0];
  const entryPoint = `${artifactJSPath}/${fileName}.jsx`;
  await fs.writeFile(entryPoint, jsScript);

  return entryPoint;
};

export default generateScript;
