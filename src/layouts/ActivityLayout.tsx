import { Box, Container, SxProps, Theme, useMediaQuery, useTheme } from '@mui/material'
import React, { ReactNode } from 'react'
import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton, Checkbox, FormControlLabel } from '@mui/material';
import { useRouter } from "next/router";
import CloseIcon from '@mui/icons-material/Close';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';



export const TWITTER_OAUTH_CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID as string
// const TWITTER_OAUTH_CLIENT_SECRET = process.env.TWITTER_CLIENT_SECRET!;
export const TWITTER_OAUTH_CLIENT_SECRET = process.env.NEXT_PUBLIC_CLIENT_SECRET as string
export const TWITTER_OAUTH_CLIENT_REDIRECT = process.env.NEXT_PUBLIC_CLIENT_CALLBACK as string
export const HANGOUT_ASSETS_BASE_URL = process.env.NEXT_PUBLIC_HANGOUT_ASSETS_BASE_URL as string

import bgImage from '/public/campaign_bg.png'; // 引用背景图片



interface ActivityLayoutProps {
  children: ReactNode
  containerSx?: SxProps<Theme>
  useContainer?: boolean
  withinPage?: boolean
  withBGPage?: boolean
  withFooter?: boolean
  withDexPage?: boolean
  hidFooterInMobile?: boolean
}

export function ActivityLayout({
  children,
  containerSx,
  useContainer = true,
  withinPage = false,
  withBGPage = false,
  withFooter = false,
  hidFooterInMobile = false,
}: ActivityLayoutProps) {
  const { breakpoints } = useTheme()
  const lg = useMediaQuery(breakpoints.down('lg'))

  const shouldWithPage = withinPage ? !withFooter : false
  const router = useRouter()
  const [checked, setChecked] = React.useState(true);
  // http://test-hangout.aogames.org/campaign/?pkId=95918263241806850
  const { pkId } = router.query;
  console.log('点击邀请链接pk query:', router.query);



  const [open, setOpen] = useState(true); // 控制模态框的打开与关闭

  const handleClose = (event: {}, reason: string) => {
    // 禁止点击背景关闭 Dialog
    if (reason !== 'backdropClick') {
      setOpen(false);// 关闭模态框的逻辑
    }
  };

  function isStringAndNotArray(pkid: string | string[]): pkid is string {
    return typeof pkid === 'string' && !Array.isArray(pkid);
  }


  useEffect(() => {
    // 获取查询参数中的 code
    console.log('点击邀请链接pk query:++++++:', pkId);
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      if (pkId) {
        if (isStringAndNotArray(pkId)) {
          localStorage.setItem('bindPkId', pkId)
          console.log('引入bindPkId', pkId)
        }
        // 存在pkId，且用户已经登陆跳转到friendList页面
        if (localStorage.getItem('jwt')) {
          if (isStringAndNotArray(pkId)) {
            localStorage.setItem('bindPkId', pkId)
            router.push('/personality')
          }
        } else {
          if (isStringAndNotArray(pkId)) {
            localStorage.setItem('bindPkId', pkId)
            console.log('引入bindPkId', pkId)
          }
        }
      } else {
        if (localStorage.getItem('jwt')) {
          router.push('/personality')
        } else
        { return }
      }
    }
  }, [pkId]);


  // twitter oauth Url constructor
  function getTwitterOauthUrl() {
    // const TWITTER_CLIENT_ID = "NFNvNXdyXzZEX0dJVk5DbWJGa0g6MTpjaQ" // give your twitter client id here
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
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem('previousOauthPage', 'campaign')
      if (checked == true) {
        localStorage.setItem('followSmash', 'true')
      } else {
        localStorage.setItem('followSmash', 'false')
      }
    }
    return `${rootUrl}?${qs}`;
  }

  const handleBackToLastpage = () => {
    router.replace('/')
  }


  const handleChangeFollowOfficial = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };



  if (lg) {
    return (
    //   <Box
    //   sx={{
    //     width: '100%',
    //     height: '100vh', // Full screen height
    //     display: 'flex',
    //     flexDirection: 'column',
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     textAlign: 'center',
    //     backgroundColor: '#000', // Dark background
    //     color: '#fff', // Text color white
    //     padding: '0 16px',
    //   }}
    // >
    <Box sx={{ minHeight: '100vh', background: '#000000', width: '100%' }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
        <Typography align="center"
          sx={{
            color: '#FFFFFF',
            font: 'normal 500 21px/32px Poppins',
            alignItems: 'center',
        }}>
          Twitter Smash
        </Typography>
      </Box>

      {/* Title and Description */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        flexDirection: 'column',
        padding: '10px',
        mt: '60px',
      }}>
        <Typography sx={{
          color: '#FFE770',
          font: 'normal 500 36px/42px Poppins',
          textAlign: 'center',
          alignItems: 'center', 
          mt: '80px',
          background: 'linear-gradient(90deg, #FFE770 1%, #FF8D22 100%)', // Gradient colors (e.g., orange to yellow)
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent', // Make the text fill transparent to show the gradient
          fontWeight: 'bold',
        }}>
          Find out who you are on Twitter / X
        </Typography>
        {/* <Typography sx={{alignItems: 'center', textAlign: 'center',
          mt: '24px',
          color: '#AAAAAA',
          font: 'normal 400 20px/28px Poppins',
        }}>
          By clicking on the button down, you agree to give us full access to your Twitter content.
        </Typography> */}
      </Box>


      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        flexDirection: 'column',
        mt: '30px',
        padding: '20px'
      }}>
        <Button
          href={getTwitterOauthUrl()}
          onClick={() => {setOpen(false)}}
          variant="contained"
          color="primary"
          sx={{
            width: '100%',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: '#fff',
            color: '#000',
            fontSize: '20px',
            textTransform: 'none',  // 禁止默认大写
            '&:hover': {
              backgroundColor: '#f0f0f0',
            },
          }}
        >
          Log in with Twitter / X
        </Button>
      </Box>
      <Box
        sx={{
          mt: '-20px',
          display: 'flex',
          alignItems: 'left',
          padding: '0px 20px',
          borderRadius: '10px',
          width: '100%',
        }}
      >
          <FormControlLabel
            control={
              <Checkbox
                checked={checked}
                onChange={handleChangeFollowOfficial}
                icon={
                  <img
                  src="/unchecked.png"
                  alt="icon"
                  style={{ width: 24, height: 24 }}
                />
                }
                checkedIcon={
                  <img
                  src="/checked.png"
                  alt="icon"
                  style={{ width: 24, height: 24 }}
                />
                }
                sx={{
                  '& .MuiSvgIcon-root': { fontSize: 32 },
                }}
              />
            }
            label={
              <Typography sx={{ color: 'white', fontSize: '14px' }}>
                Follow us on Twitter / X
              </Typography>
            }
          />
        </Box>
      
      {/* <Box sx={{
        width: '100%',
        display: 'flex', alignItems: 'center', flexDirection: 'row',
        // bgcolor: '#FFF'
      }}>
        <Box sx={{display: 'flex', ml: '20px'}}>
          <Checkbox
            checked={checked}
            color='success'
            onChange={handleChangeFollowOfficial}
            inputProps={{ 'aria-label': 'controlled' }}
            sx={{alignItems: 'center'}}
          />
        </Box>
        <Box>
          <Typography sx={{alignItems: 'center', textAlign: 'center',
        mt: '12px' }} variant="subheader1" paragraph>
            Follow the checkbox on Hang Out Twitter/X
          </Typography>
        </Box>
      </Box> */}
    </Box>
    )
  }


  return (
    <Box
      component="div"
      sx={[
        {
          display: { xs: 'none', lg: 'flex' },
          background: '#000000',
          flexDirection: 'column',
        },
        shouldWithPage
          ? {
              height: '100vh',
            }
          : {
              minHeight: '100vh',
            },
      ]}
    >
      {withBGPage ? (
        <div
          style={{
            height: '100vh',
            width: '100%',
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 10,
              left: 10,
              zIndex: 1301, // Ensures it stays above the Dialog (1300 is the default z-index for Dialog)
            }}
          >
            <Button
              variant="contained" 
              sx={{ color: '#FFFFFF', backgroundColor: 'transparent', textTransform: 'none', height: '48px', borderRadius: '8px', width:"160px", fontSize: '16px',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.1)', // 可定制 hover 状态
                },
                }}
              startIcon={
                <img
                src="/home_logo.png"
                alt="icon"
                style={{ width: 24, height: 16 }}
              />
              }
              onClick={handleBackToLastpage}
            >
              Hang Out
            </Button>
          </Box>
          <Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{
              style: { backgroundColor: '#1c1c1c', color: '#fff', padding: '20px', height: '460px', borderRadius: '20px', width: '960px' },
            }}
            maxWidth="sm"
            fullWidth
          >
            {/* 顶部 */}
            <Box display="flex" justifyContent="center" alignItems="center" p={1}>
              <Typography align="center"
                sx={{
                  color: '#FFFFFF',
                  font: 'normal 500 24px/36px Poppins',
                  alignItems: 'center',
              }}>
                Twitter Smash
              </Typography>
            </Box>
            <DialogTitle>
            <Typography sx={{
              color: '#FFE770',
              font: 'normal 500 36px/42px Poppins',
              textAlign: 'center',
              alignItems: 'center', 
              mt: '70px',
              background: 'linear-gradient(90deg, #FFE770 1%, #FF8D22 100%)', // Gradient colors (e.g., orange to yellow)
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent', // Make the text fill transparent to show the gradient
              fontWeight: 'bold',
            }}>
              Find out who you are on Twitter / X
              </Typography>
            </DialogTitle>

            <DialogContent>
              <Box>
                {/* <Typography sx={{alignItems: 'center', textAlign: 'center',
                  mt: '24px',
                  color: '#AAAAAA',
                  font: 'normal 400 24px/32px Poppins',
                }}>
                  By clicking on the button down, you agree to give us full access to your Twitter content.
                </Typography> */}
              </Box>
               
            </DialogContent>
            {/* <Box>
            <Button
                className="a-button row-container"
                href={getTwitterOauthUrl()}
                onClick={() => {setOpen(false)}}
                variant="contained"
                color="primary"
                sx={{
                  borderRadius: '12px',
                  width: '408px',
                  padding: '10px 40px',
                  backgroundColor: '#fff',
                  color: '#000',
                  fontWeight: 'bold',
                  textTransform: 'none',  // 禁止默认大写
                  '&:hover': {
                    backgroundColor: '#f0f0f0',
                  },
                }}
              >
                Log in with Twitter / X
              </Button>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#1a1a1b',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  color: 'white',
                  maxWidth: '300px',
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      icon={
                        <img
                        src="/unchecked.png"
                        alt="icon"
                        style={{ width: 24, height: 24 }}
                      />
                      }
                      checkedIcon={
                        <img
                        src="/checked.png"
                        alt="icon"
                        style={{ width: 24, height: 24 }}
                      />
                      }
                      sx={{
                        '& .MuiSvgIcon-root': { fontSize: 32 },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ color: 'white', fontSize: '16px' }}>
                      Follow us on Twitter / X
                    </Typography>
                  }
                />
              </Box>
            </Box> */}

            {/* 按钮区域 */}
            <DialogActions style={{ justifyContent: 'center',  width: '100%',
              display: 'flex', alignItems: 'center', flexDirection: 'column',
              paddingTop: '20px'
            }}>
              <Button
                className="a-button row-container"
                href={getTwitterOauthUrl()}
                onClick={() => {setOpen(false)}}
                variant="contained"
                color="primary"
                sx={{
                  borderRadius: '12px',
                  width: '408px',
                  padding: '10px 40px',
                  backgroundColor: '#fff',
                  color: '#000',
                  fontWeight: 'bold',
                  textTransform: 'none',  // 禁止默认大写
                  '&:hover': {
                    backgroundColor: '#f0f0f0',
                  },
                }}
              >
                Log in with Twitter / X
              </Button>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#1a1a1b',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  color: 'white',
                  maxWidth: '300px',
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checked}
                      onChange={handleChangeFollowOfficial}
                      icon={
                        <img
                        src="/unchecked.png"
                        alt="icon"
                        style={{ width: 24, height: 24 }}
                      />
                      }
                      checkedIcon={
                        <img
                        src="/checked.png"
                        alt="icon"
                        style={{ width: 24, height: 24 }}
                      />
                      }
                      sx={{
                        '& .MuiSvgIcon-root': { fontSize: 32 },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ color: 'white', fontSize: '16px' }}>
                      Follow us on Twitter / X
                    </Typography>
                  }
                />
              </Box>
            </DialogActions>
            
          </Dialog>
          <img
            src="/more_bg.jpg"
            alt="bg"
            style={{
              position: 'fixed',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
      ) : null}
    </Box>
  )
}
