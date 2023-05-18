// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react'
import styled from 'styled-components';

import { ComponentTemplateProps } from "./ComponentTemplate.types"

const StyledComponentTemplate = styled.div<ComponentTemplateProps>`
  color: #000;
  text-align: center;
`;

const ComponentTemplate: React.FC<ComponentTemplateProps> = ({ ...props }) => {
    return(
        <>
            <StyledComponentTemplate {...props} data-testid="ComponentTemplateTestId">
                {props.message}
            </StyledComponentTemplate>
        </>
    );
};

export default ComponentTemplate;
