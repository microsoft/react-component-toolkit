// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react'
import styled from 'styled-components';
import { FooterProps } from "./footer.types";
import { Grid, MediaQuery } from '@mantine/core';
import { Link } from '@mui/material'

const StyledFooter = styled.div<FooterProps>`
    id: ${props => props.id};
    @font-face {
        font-family: SofiaPro;
        src: local(SofiaPro-Medium),
        url("assets/fonts/SofiaProMedium.otf") format("opentype");
        font-weight: 500;
        font-style: normal;
        font-stretch: normal;
    };  
    font-family: SofiaPro;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.2;
    letter-spacing: normal;
`;

const StyledLink = styled(Link)`
    &&& {
        color: #93268f !important;
        text-decoration: none !important;
    }
`;

const Footer: React.FC<FooterProps> = ({ ...props }) => {
    const [textLeftFooter, setTextLeftFooter] = React.useState<string>("");
    const [preLinkText, setPreLinkText] = React.useState<string>("");
    const [linkText, setLinkText] = React.useState<string>("");
    const [footerLink, setFooterLink] = React.useState<string>("");
    
    if (textLeftFooter !== props.footerTextLeft) {
        setTextLeftFooter(props.footerTextLeft);
    }

    if (preLinkText !== props.footerPreLink) {
        setPreLinkText(props.footerPreLink);
    }

    if (linkText !== props.footerLinkText) {
        setLinkText(props.footerLinkText);
    }

    if (footerLink !== props.footerLink) {
        setFooterLink(props.footerLink);
    }

    return(
        <>
            <StyledFooter {...props} data-testid="FooterTestId">
                <Grid>
                    <MediaQuery largerThan="sm" styles={ {textAlign:'left'} }>
                        <Grid.Col sx={ {textAlign:'center'}} xs={12} md={6} > 
                         {textLeftFooter}
                        </Grid.Col>
                    </MediaQuery>
                    <MediaQuery largerThan="sm" styles={ {textAlign:'right' }}>
                    <Grid.Col sx={ {textAlign:'center'}} xs={12} md={6} > 
                     {preLinkText} <StyledLink href={footerLink}>{linkText}</StyledLink>
                    </Grid.Col>
                    </MediaQuery>
                </Grid>     
            </StyledFooter>
        </>
    );
};

export default Footer;