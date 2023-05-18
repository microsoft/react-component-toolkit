// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { MouseEventHandler } from 'react'
import type { Story } from "@ladle/react";
import MarkdownViewer from "../components/markdownviewer/markdownviewer";
import { MarkdownViewerProps } from "../components/markdownviewer/markdownviewer.types";

export const BasicMarkdownViewer: Story<MarkdownViewerProps> = ({ id, url }) => (
    <>
      <MarkdownViewer 
            id={id}
            url={url}
        />
    </>
  );

BasicMarkdownViewer.args = {
    id: 'MarkdownViewerControl',
    url: 'https://raw.githubusercontent.com/microsoft/react-component-toolkit/main/README.md'
};

