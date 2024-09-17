// FriendPkResult

import { Box, useTheme, useMediaQuery, Button } from '@mui/material';
import { useRouter } from "next/router";
import { useEffect, useState } from 'react'
import { FriendPkLayout } from '@/layouts/FriendPkLayout';
import api from '@/utils/api'
import { request } from '@/utils/request';



export default function Pkresult() {
  const router = useRouter()
  const { breakpoints } = useTheme();
  const downLg = useMediaQuery(breakpoints.down('lg'));
  const activity = router?.asPath.indexOf("personality")
  // console.log('Personality+URL', router?.asPath)
  


  const getTwitterPersonality = async () => {
    try {
      const params = {
      }
      const fetchData = (await request.post(api.post_user_gamerole_evaluation, params, {
        headers: {
          "Content-Type": "application/json",
        },
      })) as any
      if (fetchData && fetchData.code == 1) {
        console.log('getTwitterPersonality++++++', fetchData)
      } else {
        console.log('TwitterTokenResponse+error', fetchData)
        //toast
      }
      return fetchData.data
    } catch (err) {
      console.error(err);
      return null;
    }
  }


  useEffect(() => {
  }, []);





  const getContent = () => {
    return <></>
  }

  if (downLg) {
    return (
      <></>
    )
  }

  return (
    <></>
  )
}

Pkresult.getLayout = function getLayout(page: React.ReactElement) {
  return <FriendPkLayout>{page}</FriendPkLayout>;
};

