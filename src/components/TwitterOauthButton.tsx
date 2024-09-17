import Image from "next/image";
import { Box, useTheme, useMediaQuery, Button } from '@mui/material'
import { useEffect, useState } from 'react'


// add your client id and secret here:
export const TWITTER_OAUTH_CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID as string
// const TWITTER_OAUTH_CLIENT_SECRET = process.env.TWITTER_CLIENT_SECRET!;
export const TWITTER_OAUTH_CLIENT_SECRET = process.env.NEXT_PUBLIC_CLIENT_SECRET as string
export const TWITTER_OAUTH_CLIENT_REDIRECT = process.env.NEXT_PUBLIC_CLIENT_CALLBACK as string

// twitter oauth Url constructor
function getTwitterOauthUrl() {
  const rootUrl = "https://twitter.com/i/oauth2/authorize";
  const options = {
    redirect_uri: TWITTER_OAUTH_CLIENT_REDIRECT, // client url cannot be http://localhost:3000/ or http://127.0.0.1:3000/
    client_id: TWITTER_OAUTH_CLIENT_ID,
    state: "state",
    response_type: "code",
    code_challenge: "y_SfRG4BmOES02uqWeIkIgLQAlTBggyf_G7uKT51ku8",
    code_challenge_method: "S256",
    scope: ["users.read", "tweet.read", "follows.write"].join(" "), // add/remove scopes as needed
  };
  const qs = new URLSearchParams(options).toString();
  return `${rootUrl}?${qs}`;
}


// the component
export function TwitterOauthButton() {
  return (
    <a className="a-button row-container" href={getTwitterOauthUrl()}>
      <p>{"twitter login"}</p>
    </a>
  );
}