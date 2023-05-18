// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { MouseEventHandler } from 'react'
import type { Story } from "@ladle/react";
import BingMaps from "../components/bingmaps/bingmaps";
import { BingMapsProps } from "../components/bingmaps/bingmaps.types";

export const BasicMap: Story<BingMapsProps> = ({ id, bingMapsKey }) => (
    <>
      <BingMaps 
            id={id}
            handleClick={mapClicked}
            bingMapsKey={bingMapsKey}
        />
    </>
  );

BasicMap.args = {
    id: 'bingmapControl',
    bingMapsKey: '[ADD_YOUR_BING_MAPS_API_KEY]'
};

const mapClicked: React.MouseEventHandler<HTMLDivElement> = (event) => {
    alert(`Map was clicked`)
};

