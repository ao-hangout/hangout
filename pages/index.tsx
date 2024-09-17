import { HomeLayout } from "@/layouts/HomeLayout"
import { Box, useTheme, useMediaQuery } from '@mui/material'
import { useEffect, useState } from 'react'


export default function Home() {
  const { breakpoints } = useTheme()
  const downLg = useMediaQuery(breakpoints.down('lg'))

  useEffect(() => {
  }, [])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {downLg ? <></> : <></>}
    </Box>
  )
}


Home.getLayout = function getLayout(page: React.ReactElement) {
  return <HomeLayout>{page}</HomeLayout>
}
