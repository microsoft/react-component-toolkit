// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { MouseEventHandler, useState } from 'react'
import styled, { keyframes } from 'styled-components';
import { MarkdownViewerProps } from "./markdownviewer.types"
import reactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';

const StyledMarkdownViewer = styled.div<MarkdownViewerProps>`
`;

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ ...props }) => {
    const [content, setContent] = useState("");

    React.useEffect(() => {
        fetch(props.url)
        .then((res) => res.text())
        .then((data) => {
            setContent(data);
        });
    },[]);

    return(
        <>
            <StyledMarkdownViewer {...props} data-testid="MarkdownViewerTestId">
                <ReactMarkdown rehypePlugins={[rehypeRaw]} children={content} />
            </StyledMarkdownViewer>
        </>
    );
};

export default MarkdownViewer;
