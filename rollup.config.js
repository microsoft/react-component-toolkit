// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import typescript from "rollup-plugin-typescript2";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import autoExternal from 'rollup-plugin-auto-external';
import visualizer from 'rollup-plugin-visualizer';
import dts from "rollup-plugin-dts";

const D3_WARNING = /Circular dependency.*d3-interpolate/

const directImports = {
    bingmaps: 'src/components/bingmaps/index.ts',
    common: 'src/components/common/index.ts',
    footer: 'src/components/footer/index.ts',
    graphikle: 'src/components/graphikle/index.ts',
    markdownviewer: 'src/components/markdownviewer/index.ts',
    signin: 'src/components/signin/index.ts',
    styledtext: 'src/components/styledtext/index.ts',
}

const commonPlugins = [
    nodeResolve(),
    typescript({ resolveJsonModule: true, tsconfigOverride: { compilerOptions: { declaration: false } } }),
    autoExternal(),
    commonjs(),
    json()
]

export default [
    {
        input: { ...directImports },
        output: {
            dir: 'dist',
            format: 'esm',
            sourcemap: true,
        },
        plugins: [
            ...commonPlugins,
            visualizer({ filename: 'build_artifacts/esm_stats.html' })
        ],
        onwarn(warning, warn) {
            if (D3_WARNING.test(warning)) {
                return;
            }

            warn(warning);
        },
    },
    {
        input: { ...directImports },
        output: { dir: 'dist', format: 'esm' },
        plugins: [
            ...commonPlugins,
            dts(),
        ],
    }
]; 
