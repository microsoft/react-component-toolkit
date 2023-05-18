// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import renderer from 'react-test-renderer';
import 'jest-styled-components';
import '@testing-library/jest-dom'
import { render, fireEvent, screen, waitFor } from '@testing-library/react'
import SignIn from "../components/signin/signin";
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { faker } from "@faker-js/faker"

const endpointMockUrl:string = '/api/login:email';
const fakeUserEmailAddress:string = faker.internet.email();
const server = setupServer(
  rest.post(endpointMockUrl, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(
      {
        "form": {
          "email": fakeUserEmailAddress
        }
      }))
  })
)

describe("Testing component : <SignIn />", () => {
  const componentId = "ComponentUnderTest";

  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  })
  
  beforeEach(() => {
  });

  afterEach(() => {
    server.resetHandlers();
  });

  test("<SignIn /> should render with id", () => {

    // Create our component with our generated id
    const testRenderer = renderer.create(<SignIn id={componentId} />);

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

  test("<SignIn /> test authentication flow", async () => {
    // Create our component with our generated id
    render(<SignIn id={componentId} actionUrl={endpointMockUrl}/>);

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: fakeUserEmailAddress },
    })

    fireEvent.click(screen.getByText(/submit/i));
    
    await waitFor(() => {
      const authText:string = `${fakeUserEmailAddress} has been authenticated.`;
      expect(screen.getByText(authText).textContent).toMatch(authText);
    })

    fireEvent.click(screen.getByText(/Go back/i));

    await waitFor(() => {
      const signInText:string = "Sign In";
      expect(screen.getByText(signInText).textContent).toMatch(signInText);
    })
  })
});
