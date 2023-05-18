// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react'
import styled from 'styled-components';
import { Avatar, Button, CssBaseline, TextField, FormControlLabel, Checkbox, Link, Grid, Box, Typography, Container } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import SignInDataService from './signin_dataservice'
import { SignInProps } from "./signin.types"

const hiddenTag:string = "";
const StyledSignIn = styled.div<SignInProps>`
  id: ${props => props.id};
`;
const theme = createTheme();

const SignIn: React.FC<SignInProps> = ({ ...props }) => {
  const [responseText, setResponseText] = React.useState<string>(hiddenTag);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      if (props.actionUrl !== undefined)
      { 
        const urlWithUserId:string = `${props.actionUrl}${props.defaultEmail}`;
        SignInDataService.getPOSTRequest(urlWithUserId, data).then(response => setResponseText(response.data.form.email));
      }
    };

    return (
        <>
            <StyledSignIn {...props} >
                <ThemeProvider theme={theme}>
                    <Container component="main" maxWidth="xs">
                        <CssBaseline />
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center',}}>
                            { responseText === "" &&
                                <>
                                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                                        <LockOutlinedIcon />
                                    </Avatar>
                                    <Typography component="h1" variant="h5">
                                        Sign In
                                    </Typography>
                                        <TextField margin="normal" required fullWidth id="email" label="Email" name="email" autoComplete="email" value={props.defaultEmail} />
                                        <TextField margin="normal" required fullWidth name="password" label="Password" type="password" id="password" autoComplete="current-password" />
                                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Submit</Button>
                                        <Grid container>
                                            <Grid item xs>
                                            </Grid>
                                            <Grid item>
                                                <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
                                            </Grid>
                                        </Grid>
                                </>
                            }
                            { responseText !== "" &&
                                <>
                                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                                        <LockOutlinedIcon />
                                    </Avatar>
                                    <Typography component="h2" variant="h5">
                                        {responseText} has been authenticated.
                                    </Typography>
                                    <Button onClick={() => { setResponseText(""); } } fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Go back</Button>
                                </>
                            }
                        </Box>
                    </Container>
                </ThemeProvider>
            </StyledSignIn>
        </>
    );
};

export default SignIn;