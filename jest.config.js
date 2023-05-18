// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

module.exports = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  rootDir: "./src",
  testEnvironment: "jsdom",
  testEnvironmentOptions: {
    customExportConditions: []
  },
  transformIgnorePatterns: ['/node_modules/(?!react-force-graph-3d|three|three-forcegraph|three-render-objects|three-spritetext|d3-force-3d|d3-quadtree|d3-dispatch|d3-timer|d3-array|internmap|d3-scale|d3-interpolate|d3-color|d3-format|d3-time)'],
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
    '^.+\\.(m)js?$': ['@swc/jest']
  }
};
