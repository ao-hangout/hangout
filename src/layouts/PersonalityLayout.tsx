import { Box, Container, SxProps, Theme, useMediaQuery, useTheme } from '@mui/material'
import React, { ReactNode } from 'react'
import bgImage from '/public/campaign_bg.png'; // 引用背景图片
import { Dialog, CircularProgress, DialogTitle, DialogContent, DialogActions, Button, Typography, Avatar, IconButton } from '@mui/material';
import { useEffect, useState, useRef } from 'react'
import api from '@/utils/api'
import { request } from '@/utils/request';
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from "next/router";
import DownloadIcon from '@mui/icons-material/Download'; // 下载图标
import html2canvas from 'html2canvas';
// import Arweave from "arweave";
// import * as WarpArBundles from 'warp-arbundles'
// import { dryrun, message, spawn } from "@permaweb/aoconnect";
// import { ARWEAVE_GATEWAY, MODULE, SCHEDULER } from "@/utils/consts";
// import { isProcessOnChain } from "@/utils/aoutil";
// import { PROFILE_LUA_CODE } from "@/utils/profile-lua-code";
import { UploadToAoChain } from "@/utils/UploadToAoChain"



// @ts-ignore
// const pkg = WarpArBundles.default ? WarpArBundles.default : WarpArBundles
// const { createData, ArweaveSigner } = pkg


export const HANGOUT_APP_SHARE_URL = process.env.NEXT_PUBLIC_SHARE_URL as string
export const HANGOUT_APP_IMAGE_PROXY = process.env.NEXT_PUBLIC_IMAGE_PROXY as string




// // Areave Wallet
// let arweave: Arweave;
// let wallet: any;
// let walletAddress: string;
// let walletKey: string;
// let profileID;


// function checkWallet() {
//   if (!arweave || !wallet) {
//     return false;
//   }
//   else {
//     return true;
//   }
// }

// export function wait(ms: number | undefined) {
//   return new Promise((r) => setTimeout(r, ms));
// }

// export function createDataItemSigner(wallet: any) {
//   // @ts-ignore
//   const signer = async ({ data, tags, target, anchor }) => {
//     const signer = new ArweaveSigner(wallet)
//     const dataItem = createData(data, signer, { tags, target, anchor })
//     return dataItem.sign(signer)
//       .then(async () => ({
//         id: await dataItem.id,
//         raw: await dataItem.getRaw()
//       }))
//   }

//   return signer
// }

// async function spawnProcess() {
//   try {
//     const processId = await spawn({
//       module: MODULE,
//       scheduler: SCHEDULER,
//       // @ts-ignore
//       signer: createDataItemSigner(wallet),
//       tags: [
//         { name: 'Name', value: 'AO-Games-Profile' },
//         { name: 'Description', value: 'Spawned by AO games' }
//       ]
//     });

//     return processId;
//   } catch (error) {
//     console.log("spawnProcess --> error:", error)
//     return '';
//   }
// }

// export async function uploadCodeToProcess(process: any, data: string) {
//   try {
//     const messageId = await message({
//       process,
//       // @ts-ignore
//       signer: createDataItemSigner(wallet),
//       tags: [{ name: 'Action', value: 'Eval' }],
//       data: data,
//       anchor: ''
//     });

//     return messageId;
//   } catch (error) {
//     console.log("evaluate --> error:", error)
//     return '';
//   }
// }

// async function messageToAO(process: any, data: { UserName: string; DisplayName: string; Description: string; ProfileImage: string; CoverImage: string; Instruction: string; }, action: string) {
//   try {
//     const messageId = await message({
//       process: process,
//       // @ts-ignore
//       signer: createDataItemSigner(wallet),
//       tags: [{ name: 'Action', value: action }],
//       data: JSON.stringify(data)
//     });
//     return messageId;
//   } catch (error) {
//     console.log("messageToAO -> error:", error)
//     return '';
//   }
// }

// export async function getDataFromAO(process: any, action: any, data: any) {
//   let result;
//   try {
//     result = await dryrun({
//       process,
//       data: JSON.stringify(data),
//       tags: [{ name: 'Action', value: action }]
//     });
//   } catch (error) {
//     console.log('getDataFromAO --> ERR:', error)
//     return '';
//   }

//   const resp = result.Messages?.length > 0 ? result.Messages[0].Data : null;

//   if (resp) {
//     return JSON.parse(resp);
//   } else {
//     console.error("No messages received");
//     return null;
//   }
// }


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

export function PersonalityLayout({
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
  const { createAOAgentUpload, getAgent, updateAgent } = UploadToAoChain(); //上链AO

  const { breakpoints } = useTheme()

  const lg = useMediaQuery(breakpoints.down('lg'))

  const shouldWithPage = withinPage ? !withFooter : false
  const [open, setOpen] = useState(true); // 控制模态框的打开与关闭
  const [character, setCharacter] = useState('')
  const [game, setGame] = useState('')
  const [gameLogo, setGameLogo] = useState('')
  const [gameText, setGameText] = useState('')
  const [loading, setLoading] = useState(true);

  //ao wallet
  // const [init, setInit] = useState(false);
  // const [walletReady, setWalletReady] = useState(false);
  // const [addressReady, setAddressReady] = useState(false);
  // const [smartLoading, setSmartLoading] = useState(false);
  // const [profileReady, setProfileReady] = useState(false);
  const [clickSave, setClickSave] = useState(false)



  const handleClose = (event: {}, reason: string) => {
    // 禁止点击背景关闭 Dialog
    if (reason !== 'backdropClick') {
      setOpen(false);
    }
  };

  const clickCreateIntelligentAgent = () => {
    setOpen(false)
    router.push('/')
  }


  const handleSaveImage = async () => {
    setClickSave(true)
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
    setClickSave(false)
  };


  const clickPkwithFriend = () => {
    setOpen(false)
    router.push('/pkfriend')
  }


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
        localStorage.setItem('character', fetchData.character)
        setCharacter(fetchData.character)
        localStorage.setItem('game', fetchData.game)
        setGame(fetchData.game)
        localStorage.setItem('game_logo', (HANGOUT_APP_IMAGE_PROXY + fetchData.ico))
        console.log('proxyImageUrl', (HANGOUT_APP_IMAGE_PROXY + fetchData.ico))
        // setGameLogo(fetchData.ico)
        setGameLogo(HANGOUT_APP_IMAGE_PROXY + fetchData.ico)
        localStorage.setItem('game_text', fetchData.text)
        setGameText(fetchData.text)
        setLoading(false)
        // localStorage.setItem('jwt', fetchData.token)
        // router.replace('/')
      } else {
        console.log('TwitterTokenResponse+error', fetchData)
        //toast
        setLoading(false)
      }
      return fetchData.data
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      if (localStorage.getItem('jwt')) {
        getTwitterPersonality()
        if (localStorage.getItem('bindPkId')) {
          console.log('check if has bindPkId')
          bindNewPKfriend() //无bindPkId, 不绑定好友
        }
        if (!localStorage.getItem('aoProfileId') ) {
          const userName = localStorage.getItem('accountUserName') ?? ''
          const displayName = localStorage.getItem('accountDisplayName') ?? ''
          const descipt = localStorage.getItem('accountDescription') ?? ''
          const profileImage = localStorage.getItem('accountProfileImage') ?? ''
          const coverImage = localStorage.getItem('accountCoverImage') ?? ''
          if (!userName) { return }
          createAOAgentUpload(userName, displayName, descipt, profileImage, coverImage, '')
        }
      }
    }
  }, []);


  //上传smart agent数据
  // async function createAgent(xUsername: string, xName: string, xDes: string, xProfileImage: string, coverImage: string) {
  //   if (!checkWallet()) return;

  //   setSmartLoading(true);
  //   // setProfile('');
  //   // setUpdatedProfile('');
  //   setProfileReady(false);

  //   const process = await spawnProcess();
  //   console.log("spawn process --> ", process);

  //   // check the process if already on-chain (exist on Arweave)
  //   let check = true;
  //   let retryCount = 0;
  //   while (check) {
  //     await (2000);  // to check after 2 seconds
  //     const isOnChain = await isProcessOnChain(process);
  //     console.log("isOnChain --> ", Boolean(isOnChain))

  //     if (isOnChain) {
  //       check = false;
  //     } else {
  //       console.log('Transaction not found -->', process);
  //       retryCount++;
  //       if (retryCount >= 100) {
  //         return;
  //       }
  //     }
  //   }

  //   console.log("upload code to --> ", process);

  //   const upload = await uploadCodeToProcess(process, PROFILE_LUA_CODE);
  //   console.log("upload resp --> ", upload);

  //   //
  //   const profile_data = {
  //     UserName: xUsername,
  //     DisplayName: xName,
  //     Description: xDes + ' - spawned by AO games.',
  //     ProfileImage: xProfileImage,
  //     CoverImage: coverImage,
  //     Instruction: '',
  //   }
  //   await wait(1000);
  //   console.log("profile_data --> ", profile_data);

  //   const create_profile = await messageToAO(process, profile_data, 'Update-Profile');
  //   console.log("create_profile --> ", create_profile);
  //   localStorage.setItem('aoProfileId', create_profile)

  //   // create profile success
  //   profileID = process;
  //   localStorage.setItem('profileID', profileID)
  //   console.log('profileID', profileID)
  //   setSmartLoading(false);
  //   setProfileReady(true);
  // }

  // async function uploadFunc(xUsername: string, xName: string, xDes: string, xProfileImage: string, coverImage: string) {
  //   await initArweave()
  //   await createWallet()
  //   await createAgent(xUsername, xName, xDes, xProfileImage, coverImage)
  // }

  // async function spawnProcess() {
  //   try {
  //     const processId = await spawn({
  //       module: MODULE,
  //       scheduler: SCHEDULER,
  //       // @ts-ignore
  //       signer: createDataItemSigner(wallet),
  //       tags: [
  //         { name: 'Name', value: 'AO-Games-Profile' },
  //         { name: 'Description', value: 'Spawned by AO games' }
  //       ]
  //     });
  
  //     return processId;
  //   } catch (error) {
  //     console.log("spawnProcess --> error:", error)
  //     return '';
  //   }
  // }


  // async function initArweave() {
  //   arweave = await Arweave.init({});
  //   setInit(true);
  //   console.log("arweave --> ", arweave);
  // }

  // async function createWallet() {
  //   if (!arweave) {
  //     return;
  //   }

  //   wallet = await arweave.wallets.generate();
  //   setWalletReady(true);
  //   console.log("wallet --> ", wallet);
  //   localStorage.setItem('aoWallet', JSON.stringify(wallet))
  // }




  const bindNewPKfriend = async () => {
    try {
      const params = {
        "device": {
          "appCode": "string",
          "deviceID": "string",
          "imei": "string",
          "osplatform": "string",
          "osversion": "string",
          "version": "string"
        },
        "userId": localStorage.getItem('bindPkId')
      }
      console.log('bindNewPKfriend+params', params)
      console.log('绑定新PK好友', localStorage.getItem('bindPkId'))
      // POST request to the token url to get the access token and twittr user infos
      const fetchData = (await request.post(api.post_bind_pk_friend, params, {
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


  const handleBackTohomepage = () => {
    router.push('/')
  }

  const handleShareToTwitter = () => {
    // 角色测试分享：（测试用户名= @自己推特name）is indeed a/an（角色名）from (游戏名），but still just another piece of cake! Wondering who you'd be in a game world？+链接+@aohangout
    let nickname = localStorage.getItem('userNickName')
    const url = HANGOUT_APP_SHARE_URL + localStorage.getItem('userId');
    const shareText = '@' + nickname + ' is indeed a/an ' + character + ' from ' + game + ", but still just another piece of cake! Wondering who you'd be in a game world？" + ' @aohangout'
    console.log('shareUrl', url)
    const title = shareText;
    shareHangoutTwitterSmash()

    //可设置tag标签 const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}&hashtags=${encodeURIComponent(hashtags.join(','))}`;
    const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
    window.open(twitterShareUrl, '_blank');
  };


  

  if (lg) {
    return (
      <Box sx={{ minHeight: '100vh', background: '#000000' }}>
        {/* 顶部 */}
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
        <Box display="flex" justifyContent="center" mb={2} mt={4}>
          <Avatar
            alt="Tiger Pioneer"
            src={`${gameLogo}`} // 替换为你自己的头像图片路径
            sx={{ width: 80, height: 80 }}
            slotProps={{
              img: {
                crossOrigin: 'anonymous',
                onLoad: () => console.log('Image 1 Loaded'),
              },
            }}
          />
        </Box>

        {/* 游戏角色标题和描述 */}
        <Typography align="center"
          sx={{ 
            color: '#FFFFFF',
            font: 'normal 400 20px/28px Poppins',
            alignItems: 'center',
            mt: '10px',
            ml: '10px',
            mr: '10px',
        }}>
          {`You are the ${character} in "${game}" !!!`}
        </Typography>
        <Typography align="center"
          sx={{ 
            color: '#AAAAAA',
            font: 'normal 400 20px/28px Poppins',
            alignItems: 'center',
            mt: '10px',
            fontWeight: 'bold',
            ml: '10px',
            mr: '10px',
        }}>
          {`${gameText}`}
        </Typography>
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
                borderRadius: '8px',
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
                // width: '30%',
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
                // width: '30%',
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
                // width: '100px',
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
            backgroundImage: `url(${bgImage})`,
            position: 'fixed',
            objectFit: 'cover',
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
          {loading ? 
          (
          <Dialog
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
                <CircularProgress size={60} sx={{ color: 'inherit' }} />
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
          </Dialog>)
          :
          (<Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{
              style: { backgroundColor: '#1c1c1c', color: '#fff', padding: '20px', borderRadius: '8px', width: '900px', height: '540px' },
            }}
            ref={dialogContentRef}
            maxWidth="sm"
            fullWidth
          >
            <DialogContent >
              {/* <Box ref={dialogContentRef} sx={{ }}> */}
              <Box>
                <Typography align="center"
                  sx={{ 
                  color: '#FFFFFF',
                  font: 'normal 400 20px/28px Poppins',
                  alignItems: 'center',
                  mb: '30px',
                }}>
                  Twitter Smash
                </Typography>
                {/* 中间头像部分 */}
                <Box display="flex" justifyContent="center" mb={2}>
                  <Avatar
                    alt="Tiger Pioneer"
                    src={`${gameLogo}`}
                    sx={{ width: 80, height: 80 }}
                    slotProps={{
                      img: {
                        crossOrigin: 'anonymous',
                        onLoad: () => console.log('Image 1 Loaded'),
                      },
                    }}
                  />
                </Box>

                {/* 游戏角色标题和描述 */}
                <Typography align="center"
                  sx={{ 
                    color: '#FFFFFF',
                    font: 'normal 400 20px/28px Poppins',
                    alignItems: 'center',
                    mt: '10px',
                }}>
                  {`You are the ${character} in "${game}" !!!`}
                </Typography>
                <Typography align="left"
                  sx={{ 
                    color: '#AAAAAA',
                    font: 'normal 400 18px/28px Poppins',
                    alignItems: 'center',
                    mt: '40px',
                    mb: '30px',
                }}>
                  {`${gameText}`}
                </Typography>
              </Box> 
            </DialogContent>

            {/* 按钮区域 */}
            {clickSave ? <></> :
            <DialogActions style={{ justifyContent: 'center' }}>
              <Button onClick={clickCreateIntelligentAgent} sx={{ margin: '0 10px', backgroundColor: '#333', color: '#fff', textTransform: 'none', height: '48px',width:'280px', borderRadius: '8px' }}>
                Create My AI Life
              </Button>       
              <Button
                // variant="contained" 
                sx={{ backgroundColor: '#333', color: '#fff', textTransform: 'none', height: '48px', borderRadius: '8px', width: '200px' }}
                onClick={handleSaveImage}
                startIcon={<DownloadIcon />}
              >
                Save as Image
              </Button>
              <Button onClick={clickPkwithFriend} sx={{ margin: '0 10px', backgroundColor: '#333', color: '#fff', textTransform: 'none',width:"200px", height: '48px', borderRadius: '8px' }}>
                Start Battle
              </Button>
              <Button 
                variant="contained" 
                sx={{ backgroundColor: '#fff', color: '#333', textTransform: 'none', height: '48px', borderRadius: '8px', width: '200px' }}
                onClick={handleShareToTwitter}
                startIcon={
                  <img
                  src="/twitter_dark.svg"
                  alt="icon"
                  style={{ width: 24, height: 24 }}
                />
                }
              >
                SHARE
              </Button>
            </DialogActions>}
          </Dialog>)
          } 
        </div>
      ) : null}
    </Box>
  )
}
