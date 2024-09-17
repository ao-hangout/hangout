import React, { useEffect, useState, useRef } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress, Grid, Avatar, Typography, Box, IconButton } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';
import { Container, SxProps, Theme, useMediaQuery, useTheme } from '@mui/material'
import { ReactNode } from 'react'
import bgImage from '/public/mobile_bg.png'; // 引用背景图片
import CloseIcon from '@mui/icons-material/Close';
import api from '@/utils/api'
import { request } from '@/utils/request';
import { useRouter } from "next/router";
import GamesIcon from '@mui/icons-material/SportsEsports'; // For 'Hang Out' icon
import ShareIcon from '@mui/icons-material/Share';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import DownloadIcon from '@mui/icons-material/Download'; // 下载图标
import html2canvas from 'html2canvas';



export const HANGOUT_APP_SHARE_URL = process.env.NEXT_PUBLIC_SHARE_URL as string


const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: '8px',
  p: 4,
};

interface PersonalityLayoutProps {
  children: ReactNode
  containerSx?: SxProps<Theme>
  useContainer?: boolean
  withinPage?: boolean
  withBGPage?: boolean
  withFooter?: boolean
  withDexPage?: boolean
  hidFooterInMobile?: boolean
}

export function FriendPkResult({
  children,
  containerSx,
  useContainer = true,
  withinPage = false,
  withBGPage = false,
  withFooter = false,
  hidFooterInMobile = false,
}: PersonalityLayoutProps) {
  const router = useRouter()
  const dialogContentRef = useRef<HTMLDivElement>(null);

  const { breakpoints } = useTheme()
  const lg = useMediaQuery(breakpoints.down('lg'))

  const shouldWithPage = withinPage ? !withFooter : false
  const [open, setOpen] = useState(true); // 控制模态框的打开与关闭
  const [resultTitle, setResultTitle] = useState('')
  const [resultWinner, setResultWinner] = useState('')
  const [resultText, setResultText] = useState('')

  const [userLogo, setUserLogo] = useState('')
  const [userCharacter, setUserCharacter] = useState('')
  const [userName, setUserName] = useState('')
  const [userGame, setUserGame] = useState('')
  const [userTwitterName, setUserTwitterName] = useState('')
  const [pkCharacter, setPkCharacter] = useState('Haotou')
  const [pkGame, setPkGame] = useState('My World')
  const [pkIcon, setPkIcon] = useState("/black-bear-avatar.png")
  const [pkRoleType, setPkType] = useState('')
  const [pkText, setPkText] = useState('')
  const [pkTwitterUsername, setPkTwitterUsername] = useState('')
  const [pkTwitters, setPkTwitters] = useState('')
  const [pkLoadingData, setPkLoadingData] = useState(false)


  const handleClose = (event: {}, reason: string) => {
    // 禁止点击背景关闭 Dialog
    if (reason !== 'backdropClick') {
      setOpen(false);// 关闭模态框的逻辑
    }
  };



  const clickCreateIntelligentAgent = () => {
    setOpen(false)
    router.push('/')
  }

  
  const clickPkwithFriend = () => {
    setOpen(false)
    router.push('/pkfriend')
  }



  const getGamePKroleResult = async () => {
    setPkLoadingData(true)
    setUserLogo(localStorage.getItem('game_logo') ??'https://yanfa.s3.ap-southeast-1.amazonaws.com/yanfa/ao/role/ico/Tiger Vanguard.png')
    setUserCharacter(localStorage.getItem('character') ?? 'Tiger Vanguard')
    setUserName(localStorage.getItem('userNickName') ?? 'Tiger Vanguard')
    setUserGame(localStorage.getItem('game') ?? 'BlackMythWukong')
    setUserTwitterName(localStorage.getItem('userNickName') ?? 'Smash')
    setResultTitle(localStorage.getItem('resultTitle') ?? '')
    setResultWinner(localStorage.getItem('resultWinner') ?? '')
    setResultText(localStorage.getItem('resultText') ?? '')
    setPkCharacter(localStorage.getItem('pkCharacter') ?? '')
    setPkGame(localStorage.getItem('pkGame') ?? '')
    setPkIcon(localStorage.getItem('pkIcon') ?? '')
    setPkType(localStorage.getItem('pkRoleType') ?? '')
    setPkText(localStorage.getItem('pkText') ?? '')
    setPkTwitterUsername(localStorage.getItem('pkTwitterUsername') ?? '')
    setPkTwitters(localStorage.getItem('pkTwitters') ?? '')
    setPkLoadingData(false)
  }


  useEffect(() => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      // This runs only on the client
      if (localStorage.getItem('jwt')) {
        // setUserLogo(localStorage.getItem('game_logo'))
        getGamePKroleResult()
      }
    }
  }, []);


  const handleBackTohomepage = () => {
    router.replace('/')
  }

  const shareHangoutTwitterSmash = async () => {
    try {
      const params = {
      }
      // POST request to the token url to get the access token and twittr user infos
      const fetchData = (await request.post(api.post_share_success_addPK, params, {
        headers: {
          "Content-Type": "application/json",
        },
      })) as any
      if (fetchData && fetchData.code == 1) {
        console.log('FollowTwitterResponse+', fetchData)
      } else {
        console.log('FollowTwitterResponse+ error', fetchData.data)
      }
    } catch (err) {
      console.error(err);
    }
  }



  const handleShareToTwitter = () => {
    // （PK对象=@对方推特name）is indeed a/an（角色名）from (游戏名），but still just another piece of cake! Why don’t you give it a shot too?+链接+@aohangout
    const url = HANGOUT_APP_SHARE_URL + localStorage.getItem('userId');
    const shareText = '@' + pkTwitterUsername + ' is indeed a/an ' + pkCharacter + ' from ' + pkGame + ", but still just another piece of cake! Why don’t you give it a shot too? " + ' @aohangout'
    console.log('shareUrl', url)
    const title = shareText;
    shareHangoutTwitterSmash()

    // const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}&hashtags=${encodeURIComponent(hashtags.join(','))}`;
    const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
    window.open(twitterShareUrl, '_blank');
  };


  const handleSaveImage = async () => {
    // Logic to save image goes here
    // const imageUrl = '/public/buttons/sharetotwitter.png'; // Replace with the actual image URL
    // const link = document.createElement('a');
    // link.href = imageUrl;
    // link.download = 'saved-image.jpg'; // Default name for the saved image
    // link.click();

    // const dialogContent = document.getElementById('screenshot-dialog-content');
    // if (dialogContent) {
    //   html2canvas(dialogContent).then((canvas) => {
    //     // Convert canvas to image
    //     const link = document.createElement('a');
    //     link.href = canvas.toDataURL('image/png');
    //     link.download = 'screenshot.png';
    //     link.click();
    //   });
    // }
    if (dialogContentRef.current) {
      const images = dialogContentRef.current.querySelectorAll('img');
      const imageLoadPromises = Array.from(images).map(
        (img) => new Promise<void>((resolve) => {
          if (img.complete) {
            resolve();
          } else {
            img.onload = () => resolve();
            img.onerror = () => resolve();
          }
        })
      );

      await Promise.all(imageLoadPromises);

      const canvas = await html2canvas(dialogContentRef.current, {
        backgroundColor: '#1c1c1c', // Keep the background transparent
        scale: 2, // Increase the scale for better image quality
      });
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = 'dialog-screenshot.png';
      link.click();
    }
  };




  if (lg) {
    return (
      <Box
      sx={{
        height: '100vh',
        backgroundColor: '#000', // Dark background color
        color: '#fff',
        padding: '8px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography align="left"
        sx={{
          color: '#FFFFFF',
          font: 'normal 500 21px/36px Poppins',
          alignItems: 'center',
      }}>
        Twitter Smash
      </Typography>
      <DialogContent>
        <Box ref={dialogContentRef} sx={{ }}>
          <Typography align="center"
            sx={{
              color: '#FFFFFF',
              font: 'normal 500 24px/36px Poppins',
              alignItems: 'center',
              mb: '40px',
          }}>
          </Typography>

          <Grid container justifyContent="center" alignItems="center" spacing={2}>
            {/* 左边角色 */}
            <Grid item xs={5} container direction="column" alignItems="center">
            {/* Player 1 */}
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              <Avatar src={`${userLogo}`} alt="Tiger Pioneer" sx={{ width: 48, height: 48 }} 
                slotProps={{
                  img: {
                    crossOrigin: 'anonymous',
                    onLoad: () => console.log('Image 1 Loaded'),
                  },
                }}
              />
              {(userTwitterName == resultWinner) ?
                <img
                src="/pk_crown.png"
                alt="Crown"
                style={{
                  position: 'absolute',
                  top: '-40px', // Adjust based on crown image
                  left: '-1px', // Adjust based on crown size
                  width: '50px', // Set crown size
                  zIndex: 1,
                }}
              />
              : null }
            </Box>
            <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
              <Box
                sx={{
                  mt: 4,
                  bgcolor: '#4F4F4F',  // Gray background for the label
                  borderRadius: '4px',  // Rounded corners
                  px: 2,                // Padding on the sides
                  py: 1,              // Vertical padding
                  mb: 1,                // Margin bottom
                }}
              >
                <Typography align="center"
                  sx={{
                    color: '#C8C8C8',
                    font: 'normal 400 12px/20px Poppins',
                    alignItems: 'center',
                }}>
                  {`${userGame}`}
                </Typography>
              </Box>
              {/* Username */}
              <Typography align="center"
                sx={{
                  color: '#ECECEC',
                  font: 'normal 400 16px/24px Poppins',
                  alignItems: 'center',
              }}>
                {`${userCharacter}`}
              </Typography>

              {/* User handle */}
              <Typography align="center"
                sx={{
                  color: '#0958D9',
                  font: 'normal 400 12px/20px Poppins',
                  alignItems: 'center',
              }}>
                {('@'+ `${userName}`)}
              </Typography>
            </Box>
            </Grid>

            {/* VS Logo */}
            <Box component="img" src="/vsLogo.png" sx={{ width: '48px', height: '96px', marginTop: '24px' }} />

            {/* Player 2 */}
            <Grid item xs={5} container direction="column" alignItems="center">
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <Avatar src={`${pkIcon}`} alt="Haotou" sx={{ width: 48, height: 48 }} 
                  slotProps={{
                    img: {
                      crossOrigin: 'anonymous',
                      onLoad: () => console.log('Image 1 Loaded'),
                    },
                  }}
                />
                {(pkTwitterUsername == resultWinner) ?
                  <img
                  src="/pk_crown.png"
                  alt="Crown"
                  style={{
                    position: 'absolute',
                    top: '-30px', // Adjust based on crown image
                    left: '4px', // Adjust based on crown size
                    width: '50px', // Set crown size
                    zIndex: 1,
                  }}
                />
                : null }
              </Box>
              <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                {/* Label for game name */}
                <Box
                  sx={{
                    mt: 4,
                    bgcolor: '#4F4F4F',  // Gray background for the label
                    borderRadius: '4px',  // Rounded corners
                    px: 2,                // Padding on the sides
                    py: 1,              // Vertical padding
                    mb: 1,                // Margin bottom
                  }}
                >
                  <Typography align="center"
                    sx={{
                      color: '##C8C8C8',
                      font: 'normal 400 12px/20px Poppins',
                      alignItems: 'center',
                  }}>
                    {`${pkGame}`}
                  </Typography>
                </Box>

                {/* Username */}
                <Typography align="center"
                  sx={{
                    color: '#ECECEC',
                    font: 'normal 400 16px/24px Poppins',
                    alignItems: 'center',
                }}>
                    {`${pkCharacter}`}
                </Typography>

                {/* User handle */}
                <Typography align="center"
                  sx={{
                    color: '#0958D9',
                    font: 'normal 400 12px/20px Poppins',
                    alignItems: 'center',
                }}>
                    {('@'+ `${pkTwitterUsername}`)}
                  </Typography>
              </Box>
              </Grid>
          </Grid>
          <Box mt={4}>
            <Typography align="center"
              sx={{ 
                color: '#FFFFFF',
                font: 'normal 500 20px/32px Poppins',
                alignItems: 'center',
            }}>
              {`${resultTitle}`}
            </Typography>
            <Typography align="center"
              sx={{
                color: '#AAAAAA',
                font: 'normal 400 16px/28px Poppins',
                alignItems: 'center',
                mt: '10px',
            }}>
              {`${resultText}`}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions
          sx={{
            display: 'flex', flexDirection: 'column',
            '& > *': {
              marginLeft: '8px', // 设置内部所有子元素的 margin-left
              marginRight: '8px',
            },
          }}
        >
        <Box sx={{ width: '100%' }}>
          <Button
            variant="contained"
            startIcon={
              <img
              src="/twitter_dark.svg"
              alt="icon"
              style={{ width: 24, height: 24 }}
            />
            }
            sx={{
              backgroundColor: '#fff',
              color: '#000',
              width: '100%',
              borderRadius: '12px',
              padding: '12px 0',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
            onClick={handleShareToTwitter}
          >
            Share to Twitter
          </Button>
        </Box>

        <Box sx={{ display: 'flex', justifyContent:"space-between", alignItems:"center", mt: '10px', width: '100%' }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#333',
              color: '#fff',
              borderRadius: '6px',
              padding: '10px 0',
              fontSize: '12px',
              textTransform: 'none',
              width: '120px',
              height: '48px',
            }}
            onClick={clickCreateIntelligentAgent}
          >
            Create My AI Life
          </Button>
          
          <Button
            onClick={handleSaveImage}
            variant="contained"
            sx={{
              backgroundColor: '#3b3b3b',
              color: 'white',
              padding: '10px 0',
              textTransform: 'none',
              borderRadius: '6px',
              height: '48px',
              fontSize: '12px',
              width: '120px',
              '&:hover': {
                backgroundColor: '#4c4c4c',
              },
            }}
          >
            Save as Image
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#333', color: '#fff', textTransform: 'none',
              borderRadius: '6px',
              width: '30%',
              fontSize: '12px',
              height: '48px',
              mr:'0px',
            }}
            onClick={clickPkwithFriend}
          >
            Start Battle
          </Button>
        </Box>
      </DialogActions>
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
          backgroundImage: `url(${bgImage})`,
          height: '100vh',
          width: '100%',
          position: 'fixed',
          objectFit: 'cover',
          // backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          justifyContent: 'center',
          alignItems: 'center',
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
      {withBGPage ? (
        <div
          style={{
            height: '100vh',
            width: '100%',
            position: 'fixed',
            objectFit: 'cover',
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
              onClick={handleBackTohomepage}
            >
              Hang Out
            </Button>
          </Box>
          {pkLoadingData ?
          ((<Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{
              style: { backgroundColor: '#1c1c1c', color: '#fff', padding: '20px', borderRadius: '8px', width: '900px', height: '560px' },
            }}
            maxWidth="md"
            fullWidth
          >
              <Box
                sx={{
                  height: '80px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                  mt: 40,
                }}
              >
                <CircularProgress size={80} sx={{ color: 'inherit' }} />
              </Box>
              <Typography align="center"
                sx={{
                  color: '#AAAAAA',
                  font: 'normal 400 24px/32px Poppins',
                  alignItems: 'center',
                  mt: 2 
              }}>
                LOADING...
              </Typography>
          </Dialog>))
          :
          (<Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{
              style: { backgroundColor: '#1c1c1c', color: '#fff', padding: '20px', borderRadius: '8px' },
            }}
            maxWidth="md"
            fullWidth
          >
            {/* 内容 */}
            <DialogContent id="screenshot-dialog-content">
              <Box ref={dialogContentRef} sx={{ }}>
                <Typography align="center"
                  sx={{
                    color: '#FFFFFF',
                    font: 'normal 500 24px/36px Poppins',
                    alignItems: 'center',
                }}>
                  Twitter Smash
                </Typography>

                <Grid container justifyContent="center" alignItems="center" spacing={3}>
                  {/* 左边角色 */}
                  <Grid item xs={5} container direction="column" alignItems="center">
                    <Box sx={{ position: 'relative', display: 'inline-block' }}>
                      <Avatar src={`${userLogo}`} alt="Tiger Pioneer" sx={{ width: 80, height: 80 }} 
                        slotProps={{
                          img: {
                            crossOrigin: 'anonymous',
                            onLoad: () => console.log('Image 1 Loaded'),
                          },
                        }}
                      />
                      {(userTwitterName == resultWinner) ? 
                        <img
                        src="/pk_crown.png"
                        alt="Crown"
                        style={{
                          position: 'absolute',
                          top: '-30px', // Adjust based on crown image
                          left: '4px', // Adjust based on crown size
                          width: '50px', // Set crown size
                          zIndex: 1,
                        }}
                      /> : null }
                    </Box>
                    <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                      {/* Label for game name */}
                      <Box
                        sx={{
                          mt: 4,
                          bgcolor: '#4F4F4F',  // Gray background for the label
                          borderRadius: '4px',  // Rounded corners
                          px: 2,                // Padding on the sides
                          py: 1,              // Vertical padding
                          mb: 1,                // Margin bottom
                        }}
                      >
                        <Typography align="center"
                          sx={{
                            color: '#C8C8C8',
                            font: 'normal 400 12px/20px Poppins',
                            alignItems: 'center',
                        }}>
                          {`${userGame}`}
                        </Typography>
                      </Box>
                      <Typography align="center"
                        sx={{
                          color: '#FFFFFF',
                          font: 'normal 400 16px/24px Poppins',
                          alignItems: 'center',
                      }}>
                        {`${userCharacter}`}
                      </Typography>

                      {/* User handle */}
                      <Typography align="center"
                        sx={{
                          color: '#0958D9',
                          font: 'normal 400 12px/20px Poppins',
                          alignItems: 'center',
                          fontWeight: 'bold',
                      }}>
                        {('@'+ `${userName}`)}
                      </Typography>
                    </Box>
                  </Grid>

                  {/* VS 图标 */}
                  <Grid item xs={2} container justifyContent="center" sx={{ mt: -4 }}>
                    <img
                      src="/vsLogo.png"
                      alt="bg"
                      style={{
                        position: 'relative',
                        width: '88px',
                        height: '144px',
                        objectFit: 'cover',
                      }}
                    />
                  </Grid>

                  {/* 右边角色 */}
                  <Grid item xs={5} container direction="column" alignItems="center">
                  <Box sx={{ position: 'relative', display: 'inline-block' }}>
                    <Avatar alt="Haotou" src={`${pkIcon}`} sx={{ width: 80, height: 80 }} 
                      slotProps={{
                        img: {
                          crossOrigin: 'anonymous',
                          onLoad: () => console.log('Image 1 Loaded'),
                        },
                      }}
                    />
                    {(pkTwitterUsername == resultWinner) ? 
                      <img
                        src="/pk_crown.png"
                        alt="Crown"
                        style={{
                          position: 'absolute',
                          top: '-30px', // Adjust based on crown image
                          left: '4px', // Adjust based on crown size
                          width: '50px', // Set crown size
                          zIndex: 1,
                        }}
                      /> : null }
                    </Box> 
                    <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                      {/* Label for game name */}
                      <Box
                        sx={{
                          mt: 4,
                          bgcolor: '#4F4F4F',  // Gray background for the label
                          borderRadius: '4px',  // Rounded corners
                          px: 2,                // Padding on the sides
                          py: 1,              // Vertical padding
                          mb: 1,                // Margin bottom
                        }}
                      >
                        <Typography align="center"
                          sx={{
                            color: '#C8C8C8',
                            font: 'normal 400 12px/20px Poppins',
                            alignItems: 'center',
                        }}>
                          {`${pkGame}`}
                        </Typography>
                      </Box>

                      {/* Username */}
                      <Typography align="center"
                        sx={{
                          color: '#FFFFFF',
                          font: 'normal 400 16px/24px Poppins',
                          alignItems: 'center',
                      }}>
                          {`${pkCharacter}`}
                      </Typography>

                      {/* User handle */}
                      <Typography align="center"
                        sx={{
                          color: '#0958D9',
                          font: 'normal 400 12px/20px Poppins',
                          alignItems: 'center',
                          fontWeight: 'bold',
                      }}>
                          {('@'+ `${pkTwitterUsername}`)}
                        </Typography>
                    </Box>
                  </Grid>
                </Grid>
                <Box mt={4}>
                  <Typography align="center"
                    sx={{ 
                      color: '#FFFFFF',
                      font: 'normal 500 24px/32px Poppins',
                      alignItems: 'center',
                  }}>
                    {`${resultTitle}`}
                  </Typography>
                  <Typography align="center"
                    sx={{ 
                      color: '#AAAAAA',
                      font: 'normal 400 20px/28px Poppins',
                      alignItems: 'center',
                      mt: '10px',
                  }}>
                    {`${resultText}`}
                  </Typography>
                </Box>
                </Box>
            </DialogContent>

            {/* 按钮区域 */}
            <DialogActions style={{ justifyContent: 'center' }}>
              <Button onClick={clickCreateIntelligentAgent} sx={{ margin: '0 10px', backgroundColor: '#333', color: '#fff', textTransform: 'none', height: '48px',width:"200px", borderRadius: '8px' }}>
                Create My AI Life
              </Button>
              <Button 
                // variant="contained" 
                sx={{ backgroundColor: '#333', color: '#fff', textTransform: 'none', height: '48px',width:"200px", borderRadius: '8px' }}
                onClick={handleSaveImage}
                startIcon={<DownloadIcon />}
              >
                Save as Image
              </Button>
              <Button onClick={clickPkwithFriend} sx={{ margin: '0 10px', backgroundColor: '#333', color: '#fff', textTransform: 'none', height: '48px',width:"200px", borderRadius: '8px' }}>
                Start Battle
              </Button>
              <Button 
                variant="contained" 
                sx={{ backgroundColor: '#fff', color: '#333', textTransform: 'none', height: '48px', borderRadius: '8px',width:"200px", }}
                startIcon={
                  <img
                  src="/twitter_dark.svg"
                  alt="icon"
                  style={{ width: 24, height: 24 }}
                />
                }
                onClick={handleShareToTwitter}
              >
                Share to Twitter
              </Button>
            </DialogActions>
          </Dialog>
          )}
        </div>
      ) : null}
    </Box>
  )
}
