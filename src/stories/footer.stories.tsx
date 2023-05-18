// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import type { Story } from "@ladle/react";
import React from 'react'
import Footer from "../components/footer/footer"
import { FooterProps } from "../components/footer/footer.types";

export const FooterBar: Story<FooterProps> = ({id, footerTextLeft, footerPreLink, footerLinkText, footerLink}) => (
    <>
      <Footer
            id={id}
            footerTextLeft = {footerTextLeft}
            footerPreLink = {footerPreLink}
            footerLinkText = {footerLinkText}
            footerLink = {footerLink}
        />
    </>
  );

FooterBar.args = {
    id: 'Footer',
    footerTextLeft: 'Copyright',
    footerPreLink: 'Powered By',
    footerLinkText: 'Some Company',
    footerLink: 'http://something.local'
};

