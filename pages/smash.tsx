import { Box, useTheme, useMediaQuery, Button } from '@mui/material';
import { useRouter } from "next/router";
import { useEffect, useState } from 'react'
import { SmashLayout } from '@/layouts/SmashLayout';
import { TwitterOauthButton } from '@/components/TwitterOauthButton';
import Landing from '@/components/Landing';


export default function Smash() {
  const router = useRouter()
  const { breakpoints } = useTheme();
  const downLg = useMediaQuery(breakpoints.down('lg'));
  const activity = router?.asPath.indexOf("campaign")
  console.log('campaigncard+URL', router?.asPath)


  if (activity === 1) { //http://localhost:3000/campaign/?cardHash=864506BcB021E8
  } else { //链接无效 tip
    console.log('campaigncardlink+invalid', activity)
  }



  if (downLg) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        width: '100%',
        height: 'fit-content',
      }}>
        {/* {getContent()} */}
      </Box>
    )
  }

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
    }}>
    </Box>
  )
}

Smash.getLayout = function getLayout(page: React.ReactElement) {
  return <SmashLayout>{page}</SmashLayout>;
};

