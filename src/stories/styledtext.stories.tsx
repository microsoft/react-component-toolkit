// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { MouseEventHandler } from 'react'
import type { Story } from "@ladle/react";
import StyledText from "../components/styledtext/styledtext";
import { StyledTextProps } from "../components/styledtext/styledtext.types";

export const BasicStyledText: Story<StyledTextProps> = ({ id, message }) => (
    <>
      <StyledText 
            id={id}
            message={message}
        />
    </>
  );

BasicStyledText.args = {
    id: 'StyledTextControl',
    message: 'Hello World!'
};

