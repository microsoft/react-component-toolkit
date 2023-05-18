// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { MouseEventHandler, useState } from 'react'
import styled, { keyframes } from 'styled-components';

import { StyledTextProps } from "./styledtext.types"

const neon = (color, radius) => keyframes`
  0%, 100% {
    text-shadow: 0 0 ${radius}px ${color}, 0 0 ${radius * 2}px ${color}, 0 0 ${radius * 4}px ${color};
  }
  25% {
    text-shadow: 0 0 ${radius}px ${color}, 0 0 ${radius * 2}px ${color}, 0 0 ${radius * 6}px ${color};
  }
  50% {
    text-shadow: 0 0 ${radius}px ${color}, 0 0 ${radius * 2}px ${color}, 0 0 ${radius * 8}px ${color};
  }
  75% {
    text-shadow: 0 0 ${radius}px ${color}, 0 0 ${radius * 2}px ${color}, 0 0 ${radius * 6}px ${color};
  }
`;

const StyledStyledText = styled.h1<StyledTextProps>`
  font-size: 6em;
  color: #fff;
  font-family: 'Helvetica Neue', sans-serif;
  position: relative;
  text-align: center;
  display: inline-block;
  animation: ${neon('#f06d06', 10)} 1s ease-in-out infinite;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  text-shadow: 0 0 20px #fff, 0 0 30px #ff4da6, 0 0 40px #ff4da6, 0 0 50px #ff4da6, 0 0 60px #ff4da6, 0 0 70px #ff4da6;
`;

const StyledText: React.FC<StyledTextProps> = ({ ...props }) => {
    return(
        <>
            <StyledStyledText {...props} data-testid="StyledTextTestId"> {props.message} </StyledStyledText>
        </>
    );
};

export default StyledText;
