// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react'
import type { Story } from "@ladle/react";
import SignIn from "../components/signin/signin";
import { SignInProps } from "../components/signin/signin.types";
import workerFactory from './common/msw-worker-helper';
import { rest } from 'msw';

workerFactory.getWorker().use(rest.post('http://localhost:61000/api/login/:emailAddress', (req, res, ctx) => {
  const { emailAddress } = req.params;
  return res(ctx.status(200), ctx.json(
    {
      "form": {
        "email": `${ emailAddress }`
      }
    }))
  })
)

export const EmailInput: Story<SignInProps> = ({ id, actionUrl, defaultEmail, label1, label2 }) => {

  return (
    <>
        <SignIn 
          id={id} 
          actionUrl={actionUrl} 
          defaultEmail={defaultEmail} 
          label1={label1} 
          label2={label2}
        />
    </>
  );
}

EmailInput.args = {
  id: 'sign-in',
  actionUrl: 'http://localhost:61000/api/login/',
  defaultEmail: 'email@local.host',
  label1: 'Label1',
  label2: 'Label2'
};

