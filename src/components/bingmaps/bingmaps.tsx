// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react'
import BingMapsReact from "bingmaps-react";
import styled from 'styled-components';

import { BingMapsProps } from "./bingmaps.types"

const StyledBingMaps = styled.div<BingMapsProps>`
    id: ${props => props.id};
    height: 95%;
    width: 95%;
    display: inline-block;
`;

const BingMaps: React.FC<BingMapsProps> = ({ ...props }) => {
    const { handleClick } = props;
   
    const handleOnClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
        handleClick ? handleClick(e) : null;
    }

    return(
        <>
            <StyledBingMaps onClick={handleOnClick} {...props} data-testid="BingMapsTestId">    
                <BingMapsReact bingMapsKey={props.bingMapsKey} />
            </StyledBingMaps>
        </>
    );
};

export default BingMaps;
