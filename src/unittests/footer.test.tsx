// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import renderer from 'react-test-renderer';
import 'jest-styled-components';
import Footer from "../components/footer/footer";
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent, screen, waitFor } from '@testing-library/react'
import {faker} from '@faker-js/faker'


const componentId:string = "ComponentUnderTest";
let fakePrelinkText: string = '';
let fakeLink: string = '';
let fakeLinkText:string = '';
let testLeftFooterText:string = '';

describe("Testing component : <Footer />", () => {
  beforeAll(() => {
  });

  afterAll(() => {
  })
  
  beforeEach(() => {
    fakePrelinkText= faker.lorem.words(2);
    fakeLink = faker.internet.url();
    fakeLinkText= faker.lorem.words(2);
    testLeftFooterText= faker.lorem.words(2);
  });

  afterEach(() => {
    fakePrelinkText = '';
    fakeLink = '';
    fakeLinkText = '';
    testLeftFooterText = '';
  });

  

  test("<Footer /> should render with id", async () => {

    // Create our component with our generated id
    const testRenderer = renderer.create(<Footer id={componentId} footerTextLeft='' footerPreLink='' footerLink='' footerLinkText=''/>);

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

    expect(jsonSnapshot).toMatchSnapshot();

  });

  test("<Footer /> test for styling", async () => {
    // Create our component with our generated id
    const testRenderer = renderer.create(<Footer id={componentId} footerTextLeft='' footerPreLink='' footerLink='' footerLinkText='' />);

    // Use the created renderer to convert to json and then check it matches our expected snapshot
    const jsonSnapshot = testRenderer.toJSON();

    expect(jsonSnapshot).toHaveStyleRule("font-family", "SofiaPro");
  
    expect(jsonSnapshot).toHaveStyleRule("font-size", "14px");

    expect(jsonSnapshot).toHaveStyleRule("font-weight", "500");
  
    expect(jsonSnapshot).toHaveStyleRule("line-height", "1.2");

    expect(jsonSnapshot).toHaveStyleRule("letter-spacing", "normal");

  });

  test("<Footer /> test left footer text", async () => {
    render(<Footer id={componentId} footerTextLeft={testLeftFooterText} footerPreLink={fakePrelinkText} footerLink={fakeLink} footerLinkText={fakeLinkText}/>);  
    expect(screen.getByText(testLeftFooterText).textContent).toMatch(testLeftFooterText);
  });


  test("<Footer /> test right footer text", async () => {
    render(<Footer id={componentId} footerTextLeft={testLeftFooterText} footerPreLink={fakePrelinkText} footerLink={fakeLink} footerLinkText={fakeLinkText} />);
    expect(screen.getByText(fakePrelinkText).textContent).toMatch(fakePrelinkText);
    expect(screen.getByText(fakeLinkText).textContent).toMatch(fakeLinkText);
    expect(screen.getByRole('link')).toHaveAttribute('href', fakeLink);
    
  })

  

});