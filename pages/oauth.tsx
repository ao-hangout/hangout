import { Box, useTheme, useMediaQuery, Button } from '@mui/material';
import { useRouter } from "next/router";
import { useEffect, useState } from 'react'
import { OauthCallbackLayout } from '@/layouts/OauthCallbackLayout';
import axios, * as others from 'axios';
import api from '@/utils/api'
import { request } from '@/utils/request';

// export const PrizeRefundController = process.env.NEXT_PUBLIC_PrizeRefundController as string


// add your client id and secret here:
export const TWITTER_OAUTH_CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID as string
// const TWITTER_OAUTH_CLIENT_SECRET = process.env.TWITTER_CLIENT_SECRET!;
export const TWITTER_OAUTH_CLIENT_SECRET = process.env.NEXT_PUBLIC_CLIENT_SECRET as string
export const TWITTER_OAUTH_CLIENT_REDIRECT = process.env.NEXT_PUBLIC_CLIENT_CALLBACK as string


// the url where we get the twitter access token from
const TWITTER_OAUTH_TOKEN_URL = "https://api.twitter.com/2/oauth2/token";

// we need to encrypt our twitter client id and secret here in base 64 (stated in twitter documentation)
const BasicAuthToken = Buffer.from(`${TWITTER_OAUTH_CLIENT_ID}:${TWITTER_OAUTH_CLIENT_SECRET}`, "utf8").toString(
  "base64"
);

// filling up the query parameters needed to request for getting the token
export const twitterOauthTokenParams = {
  client_id: TWITTER_OAUTH_CLIENT_ID,
  // based on code_challenge
  code_verifier: "8KxxO-RPl0bLSxX5AWwgdiFbMnry_VOKzFeIlVA7NoA",
  redirect_uri: TWITTER_OAUTH_CLIENT_REDIRECT,
  grant_type: "authorization_code",
};

// the shape of the object we should recieve from twitter in the request
type TwitterTokenResponse = {
  token_type: "bearer";
  expires_in: 7200;
  access_token: string;
  scope: string;
};


export default function Oauth() {
  const router = useRouter()
  const { breakpoints } = useTheme();
  const downLg = useMediaQuery(breakpoints.down('lg'));
  const activity = router?.asPath.indexOf("oauth")
  const { code, state } = router.query; // 从URL中获取参数


  // the main step 1 function, getting the access token from twitter using the code that twitter sent us
  const getTwitterOAuthToken = async (code: string) => {
    try {
      const params = {
        "channel": "hangout",
        "callback": TWITTER_OAUTH_CLIENT_REDIRECT,
        "codeChallenge": "y_SfRG4BmOES02uqWeIkIgLQAlTBggyf_G7uKT51ku8",
        "codeVerifier": "8KxxO-RPl0bLSxX5AWwgdiFbMnry_VOKzFeIlVA7NoA",
        "scope": ["users.read", "tweet.read", "follows.write"].join(" "),
        "code": code,
        "device": {
          "appCode": "string",
          "deviceID": "string",
          "imei": "string",
          "osplatform": "string",
          "osversion": "string",
          "version": "string"
        }
      }
      // POST request to the token url to get the access token and twittr user infos
      const fetchData = (await request.post(api.post_oauth_login, params, {
        headers: {
          "Content-Type": "application/json",
        },
      })) as any
      if (fetchData && fetchData.code == 1) {
        console.log('TwitterTokenResponse+', fetchData)
        localStorage.setItem('jwt', fetchData.token)
        router.replace('/')
      } else {
        console.log('TwitterTokenResponse+ error', fetchData.data)
        //toast
      }
      return fetchData.data
    } catch (err) {
      console.error(err);
      return null;
    }
  }


  useEffect(() => {
    // 获取查询参数中的 code
    console.log('OAuth Code++++++:', code);
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      if (code) {
        console.log('OAuth Code:', code);
        // 在这里可以继续处理，发送到后端服务器
        getTwitterOAuthToken(code.toString())
      } else {
        // await getTwitterOAuthToken('OWJFRGtfbVdPeTBLVk1XOERkU3hxczEyWURvMVhZODZiR0hFQWZPSUdueEF0OjE3MjUzNjQyNjg0MzU6MToxOmFjOjE')
        return
      }
    }
  }, [code, state]);


  const getContent = () => {
    return(
      <></>
    )
  }

  if (downLg) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        // mt: '10px',
        width: '100%',
        height: 'fit-content',
      }}>
        {getContent()}
      </Box>
    )
  }

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      mt: '120px',
      mr: '100px',
      width: 'fit-content',
      height: '600px',
    }}>
      {getContent()}
    </Box>
  )
}

Oauth.getLayout = function getLayout(page: React.ReactElement) {
  return <OauthCallbackLayout>{page}</OauthCallbackLayout>;
};

