import { Box, Container, SxProps, Theme, useMediaQuery, useTheme } from '@mui/material'
import React, { ReactNode } from 'react'
import bgImage from '/public/campaign_bg.png'; // 引用背景图片
import { Backdrop, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Avatar, IconButton, Checkbox } from '@mui/material';
import { useRouter } from "next/router";
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react'
import { OauthCallbackLayout } from '@/layouts/OauthCallbackLayout';
import api from '@/utils/api'
import { request } from '@/utils/request';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import Arweave from "arweave";
// import * as WarpArBundles from 'warp-arbundles'
// import { dryrun, message, spawn } from "@permaweb/aoconnect";
// import { ARWEAVE_GATEWAY, MODULE, SCHEDULER } from "@/utils/consts";
// import { isProcessOnChain } from "@/utils/aoutil";
// import { PROFILE_LUA_CODE } from "@/utils/profile-lua-code";
import message from '@/components/Message'


// // @ts-ignore
// const pkg = WarpArBundles.default ? WarpArBundles.default : WarpArBundles
// const { createData, ArweaveSigner } = pkg

const isBrowser = typeof window !== "undefined";


export const TWITTER_OAUTH_CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID as string
export const TWITTER_OAUTH_CLIENT_SECRET = process.env.NEXT_PUBLIC_CLIENT_SECRET as string
export const TWITTER_OAUTH_CLIENT_REDIRECT = process.env.NEXT_PUBLIC_CLIENT_CALLBACK as string


// Areave Wallet
let arweave: Arweave;
let wallet: any;
let walletAddress: string;
let walletKey: string;
let profileID;


function checkWallet() {
  if (!arweave || !wallet) {
    return false;
  }
  else {
    return true;
  }
}

export function wait(ms: number | undefined) {
  return new Promise((r) => setTimeout(r, ms));
}

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

export function OAuthLayout({
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
  const activity = router?.asPath.indexOf("oauth")
  console.log('oauthLayout+URL', router?.asPath)
  console.log('oauthLayout query:', router.query);
  const { code, state } = router.query; // 从URL中获取参数
  //loading加载
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(true); // 控制模态框的打开与关闭

  //ao wallet
  const [init, setInit] = useState(false);
  const [walletReady, setWalletReady] = useState(false);
  const [addressReady, setAddressReady] = useState(false);
  const [smartLoading, setSmartLoading] = useState(false);
  const [profileReady, setProfileReady] = useState(false);

  // profile
  // const [userName, setUserName] = useState('');
  // const [displayName, setDisplayName] = useState('');
  // const [description, setDescription] = useState('');
  // const [profileImage, setProfileImage] = useState('');
  // const [coverImage, setCoverImage] = useState('');
  // const [instruction, setInstruction] = useState('');
  // // show profile
  // const [profile, setProfile] = useState('');
  // const [updatedProfile, setUpdatedProfile] = useState('');

  //获取本地Agent code
  const [agentCode, setAgentCode] = useState('')



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


  async function initArweave() {
    arweave = await Arweave.init({});
    setInit(true);
    console.log("arweave --> ", arweave);
  }

  async function createWallet() {
    if (!arweave) {
      return;
    }
    wallet = await arweave.wallets.generate();
    setWalletReady(true);
    console.log("wallet --> ", wallet);
    localStorage.setItem('aoWallet', JSON.stringify(wallet))
  }

  async function getWalletAddress() {
    if (!checkWallet()) return;
    walletAddress = await arweave.wallets.jwkToAddress(wallet);
    setAddressReady(true);
    console.log("walletAddress --> ", walletAddress);
    localStorage.setItem('walletAddress', walletAddress)
    return walletAddress;
  }


  // Wallet Private Key
  async function getWalletKey() {
    if (!checkWallet()) return;
    const key = JSON.stringify(wallet);
    console.log("wallet key --> ", key);
    localStorage.setItem('walletKey', key)
    if (walletAddress !== '' && key !== '') {
      postWalletInfoToServer(walletAddress, key)
    }
    return key;
  }


  const handleClose = async (event: {}, reason: string) => {
    //// // await uploadFunc()
    // 禁止点击背景关闭 Dialog
    if (reason !== 'backdropClick') {
      setOpen(false);// 关闭模态框的逻辑
    }
  }

  //查询用户的wallet
  const getUserWallet = async () => {
    try {
      const fetchData = (await request.post(api.get_user_wallet, {}, {
        headers: {
          "Content-Type": "application/json",
        },
      })) as any
      if (fetchData && fetchData.code == 1) {
        console.log('getUserWalletResponse+', fetchData)
        if (fetchData.wallet) {
          localStorage.setItem('walletAddress', fetchData.wallet.walletAddress)
          localStorage.setItem('walletKey', fetchData.wallet.privateKey)
          setAgentCode(fetchData.wallet.walletAddress)
        } else {
          await wallteFunc()
        }
      } else {
        console.log('getUserWalletResponse+ error', fetchData)
      }
      return fetchData.data
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  const postWalletInfoToServer = async (walletAddress: string, privateKey: string) => {
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
        "privateKey": privateKey,
        "walletAddress": walletAddress
      }

      const fetchData = (await request.post(api.post_user_createwallet, params, {
        headers: {
          "Content-Type": "application/json",
        },
      })) as any
      if (fetchData && fetchData.code == 1) {
        console.log('CreateWalletResponse+', fetchData)
        setAgentCode(walletAddress)
      } else {
        console.log('CreateWalletResponse+ error', fetchData)
      }
      return fetchData.data
    } catch (err) {
      console.error(err);
      return null;
    }
  }



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

      const fetchData = (await request.post(api.post_oauth_login, params, {
        headers: {
          "Content-Type": "application/json",
        },
      })) as any
      if (fetchData && fetchData.code == 1) {
        console.log('TwitterTokenResponse+', fetchData)
        console.log('TwitterTokenResponse+user', fetchData.user)
        let accountJson = JSON.parse(fetchData.account.partnerAttachment)
        localStorage.setItem('jwt', fetchData.token)
        localStorage.setItem('userId', fetchData.user.id)
        localStorage.setItem('userNickName', fetchData.user.nickName)
        localStorage.setItem('accountId', fetchData.account.id)
        localStorage.setItem('accountUserName', accountJson.username)
        localStorage.setItem('accountDisplayName', accountJson.name)
        localStorage.setItem('accountDescription', accountJson.description)
        localStorage.setItem('accountProfileImage', accountJson.profileImageUrl)
        localStorage.setItem('accountCoverImage', '')
        
        setLoading(false)
        followHangoutTwitter()
        if (!localStorage.getItem('walletAddress') && !localStorage.getItem('walletKey')) {
          getUserWallet()
        }

        if (localStorage.getItem('previousOauthPage') == 'HangoutHome') {
          router.push('/hangName')
        } else {
          router.push('/personality')
        }
      } else {
        console.log('Test+++TwitterTokenResponse+ error', fetchData)
        message.error(fetchData.message)
      }
      return fetchData.data
    } catch (err) {
      console.error(err);
      return null;
    }
  }


  const followHangoutTwitter = async () => {
    try {
      const params = {}
      // POST request to the token url to get the access token and twittr user infos
      const fetchData = (await request.post(api.post_follow_hangout_follow, params, {
        headers: {
          "Content-Type": "application/json",
        },
      })) as any
      if (fetchData && fetchData.code == 1) {
        localStorage.setItem('followSmash', 'false')
        console.log('FollowTwitterResponse+', fetchData)
      } else {
        console.log('FollowTwitterResponse+ error', fetchData.data)
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function wallteFunc() {
    await initArweave()
    await createWallet()
    await getWalletAddress()
    await getWalletKey()
  }


  useEffect(() => {
    // 获取查询参数中的 code
    console.log('OAuth Code++++++:', code);
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      if (code && state) {
        console.log('OAuth Code:', code);
        // 在这里可以继续处理，发送到后端服务器
        getTwitterOAuthToken(code.toString())
      }
    } else {
      return
    }
  }, [code, state]);


  const handleBackToLastpage = () => {
    router.replace('/')
  }


  function maskString(input: string): string {
    const length = input.length;
    if (length <= 8) {
      return input;
    }
    const first4 = input.slice(0, 4);
    const last4 = input.slice(-4);
    const middle = '*'.repeat(length - 8);
    return `${first4}${middle}${last4}`;
  }


  const renderContent = () => {
    return (
      <>
        <Box
          component="main"
          sx={
            lg
              ? {
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  background: '#FAFAFA',
                }
              : shouldWithPage
              ? { flex: 1, overflow: 'hidden' }
              : {}
          }
        >
          {useContainer ? <Container sx={containerSx}>{children}</Container> : children}
        </Box>
      </>
    )
  }


  if (lg) {
    return (
      <Box sx={{ minHeight: '100vh', background: '#FAFAFA' }}>
        {withBGPage ? (
        //   <div
        //   style={{
        //     height: '100vh',
        //     width: '100%',
        //     backgroundImage: `url(${bgImage})`,
        //     backgroundSize: 'cover',
        //     backgroundPosition: 'center',
        //     display: 'flex',
        //     justifyContent: 'center',
        //     alignItems: 'center',
        //   }}
        // >
          <Box sx={{
            height: '100vh',
            width: '100%',
            backgroundColor: 'black',
          }}>
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" p={3}>
              <Typography align="center"
                sx={{
                  color: '#FFFFFF',
                  font: 'normal 500 21px/36px Poppins',
                  alignItems: 'center',
              }}>
                Twitter Smash
              </Typography>
            </Box>

              {/* Loading Icon */}
              <Box
                sx={{
                  height: '80px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                  mt: 80,
                }}
              >
                <CircularProgress size={80} sx={{ color: 'white' }} />
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

              {/* Footer */}
              <Box sx={{
                height: '40px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                // bgcolor: '#FFFFFF',
                mt: '200px'
              }}>
                <Typography
                  sx={{
                    // alignItems: 'center',
                    // bottom: 16,
                    // right: 16,
                    fontSize: '0.8rem',
                    color: '#ffffff99',
                  }}
                >
                  {agentCode ? ('Agent code: '+ maskString(agentCode)) : ''}
                </Typography>
              </Box>
          </Box>
        ) : null}
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
              <Box sx={{
                height: '40px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                // bgcolor: '#FFFFFF',
                mt: '200px'
              }}>
                <Typography
                  sx={{
                    // alignItems: 'center',
                    // bottom: 16,
                    // right: 16,
                    fontSize: '0.8rem',
                    color: '#ffffff99',
                  }}
                >
                  {agentCode ? ('Agent code: '+ maskString(agentCode)) : ''}
                </Typography>
              </Box>
          </Dialog>
        </div>
      ) : null}
    </Box>
  )
}
