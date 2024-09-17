import { Box, useTheme, useMediaQuery, Button } from '@mui/material';
import { useRouter } from "next/router";
import { useEffect, useState } from 'react'
import { PkFriendLayout } from '@/layouts/PkFriendLayout';
import api from '@/utils/api'
import { request } from '@/utils/request';
import PersonalityModal from '@/components/Modals/PersonalityModal';



export default function Pkfriend() {
  // const { showPersonalityModal, setShowPersonalityModal, closePersonalityModal } = useUserModalContext()
  const router = useRouter()
  const { breakpoints } = useTheme();
  const downLg = useMediaQuery(breakpoints.down('lg'));
  const activity = router?.asPath.indexOf("personality")
  console.log('Personality+URL', router?.asPath)
  // setShowPersonalityModal(true)
  


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
        // localStorage.setItem('jwt', fetchData.token)
        // router.replace('/')
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
    // 获取查询参数中的 code
    const { code } = router.query;
    console.log('OAuth Code++++++:', code);
    // setShowPersonalityModal(true)
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('jwt')) {
        getTwitterPersonality()
      }
    }
    
    getTwitterPersonality()
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

Pkfriend.getLayout = function getLayout(page: React.ReactElement) {
  return <PkFriendLayout>{page}</PkFriendLayout>;
};

