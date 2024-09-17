export const HANGOUT_ASSETS_BASE_URL = process.env.NEXT_PUBLIC_HANGOUT_ASSETS_BASE_URL as string

import { Box, useTheme, useMediaQuery } from '@mui/material';
import { useRouter } from "next/router";
import { useEffect, useState } from 'react'
import { HangNameLayout } from '@/layouts/HangNameLayout';



export default function HangName() {
  const router = useRouter()
  const { breakpoints } = useTheme();
  const downLg = useMediaQuery(breakpoints.down('lg'));
  console.log(downLg,"downLgdownLgdownLg");
  

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
        {/* {getContent()} */}
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
      {/* {getContent()} */}
    </Box>
  )
}

HangName.getLayout = function getLayout(page: React.ReactElement) {
  return <HangNameLayout>{page}</HangNameLayout>;
};

