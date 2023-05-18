// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react'
import type { Story } from "@ladle/react";
import UCCompTemplate from "../components/ComponentTemplate/ComponentTemplate";
import { ComponentTemplateProps } from "../components/ComponentTemplate/ComponentTemplate.types";

export const BasicComponentTemplate: Story<ComponentTemplateProps> = ({ id, message }) => (
    <>
      <UCCompTemplate 
            id={id}
            message={message}
        />
    </>
  );

BasicComponentTemplate.args = {
    id: 'ComponentTemplateControl',
    message: "Hello ComponentTemplate!"
};

