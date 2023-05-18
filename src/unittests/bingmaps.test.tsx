// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import renderer from 'react-test-renderer';
import { render, fireEvent, screen, waitFor } from '@testing-library/react'
import 'jest-styled-components';
import BingMaps from "../components/bingmaps/bingmaps";

describe("Testing component : <BingMaps />", () => {
  const componentId = "ComponentUnderTest";

  beforeAll(() => {
  });

  afterAll(() => {
  })
  
  beforeEach(() => {
  });

  afterEach(() => {
  });

  test("<BingMaps /> should render with id", async () => {

    // Create our component with our generated id
    const testRenderer = renderer.create(<BingMaps bingMapsKey="" id={componentId} />);

    // Use the created renderer to convert to json and then check it matches our expected snapshot
    const jsonSnapshot = testRenderer.toJSON();

    // Check that our rendered component does have the exact randomly generated componentid for this test
    expect(jsonSnapshot).toHaveProperty("props.id", componentId);

    // Match that our rendered component matches our snapshot of the component and ignore the random id
    expect(jsonSnapshot).toMatchSnapshot(
      {
        props: { id: expect.any(String) }
      }
    );
  });
  
  test("<BingMaps /> check map clicked", async () => {
    let eventCalledCount: number = 0;

    const mapClicked: React.MouseEventHandler<HTMLDivElement> = (event) => {
      eventCalledCount++;
    };

    // Check event has not been called.
    expect(eventCalledCount).toBe(0);

    // Render the map.
    render(<BingMaps bingMapsKey="" id={componentId} handleClick={mapClicked}/>);
    
    // Check the event has still not been called.
    expect(eventCalledCount).toBe(0);

    // Fire the click event.
    fireEvent(screen.getByTestId("BingMapsTestId"), new MouseEvent('click', { bubbles: true }));
    
    // Check the event was called.
    expect(eventCalledCount).toBe(1);
  });

  test("<BingMaps /> check map clicked", async () => {
    let eventCalledCount: number = 0;

    // Check event has not been called.
    expect(eventCalledCount).toBe(0);

    // Render the map.
    render(<BingMaps bingMapsKey="" id={componentId} />);
    
    // should never not be zero as we have no event handler to incremement eventCalledCount
    expect(eventCalledCount).toBe(0);

    // Fire the click event.
    fireEvent(screen.getByTestId("BingMapsTestId"), new MouseEvent('click', { bubbles: true }));
    
    // should never not be zero as we have no event handler to incremement eventCalledCount
    expect(eventCalledCount).toBe(0);
  });

});
