import { Box, Container, SxProps, Theme, useMediaQuery, useTheme } from '@mui/material'
import React, { ReactNode,useEffect,useState,useRef } from 'react'
import { useRouter } from "next/router";
import { request } from '@/utils/request';
import api from '@/utils/api'

// add your client id and secret here:
export const TWITTER_OAUTH_CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID as string
// const TWITTER_OAUTH_CLIENT_SECRET = process.env.TWITTER_CLIENT_SECRET!;
export const TWITTER_OAUTH_CLIENT_SECRET = process.env.NEXT_PUBLIC_CLIENT_SECRET as string
export const TWITTER_OAUTH_CLIENT_REDIRECT = process.env.NEXT_PUBLIC_CLIENT_CALLBACK as string



interface MainLayoutProps {
  children: ReactNode
  containerSx?: SxProps<Theme>
  useContainer?: boolean
  withinPage?: boolean
  withBGPage?: boolean
  withFooter?: boolean
  hidFooterInMobile?: boolean
}

const routerHangName = async (router: any) => {
  const fetaData = await request.post(api.post_get_awareness);
  const typedData = fetaData as { code: number; aoAwareness?: any };
  if (typedData.code === 1 && typedData.aoAwareness) {
    const query = { stage: 'appMain' };
    router.push({
      pathname: '/hangName',
      query: query
    });
  }else {
     const currentStage = localStorage.getItem("currentStage") || 'inputName';
    const query = { stage: currentStage };
    router.push({
      pathname: '/hangName',
      query: query,
    });
  }
};

const Footer = () => {
  const router = useRouter();
  const [npcName, setNpcName] = useState('');
  const [npcImg, setNpcImg] = useState('');
  const [message, setMessage] = useState('');
  const [jwtExists, setJwtExists] = useState(false);
  const { breakpoints } = useTheme()
  const lg = useMediaQuery(breakpoints.down('lg'))
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const jwt = localStorage.getItem('jwt');
      if (jwt) {
        setJwtExists(true);
      }
    }

  }, []);
  async function fetchChat() {
    const fetchData = (await request.post(api.post_hangout_dispatch_npc)) as any;
      if (fetchData.code === 1) {
        localStorage.setItem("npc",JSON.stringify(fetchData.npc))
        
        setNpcName(fetchData.npc?.name);
        const icoConfigStr = fetchData.npc.icoConfig
        .replace(/\n/g, '')  // 移除换行符
        .replace(/“|”/g, '"'); // 替换非标准引号
        const icoConfig = JSON.parse(icoConfigStr);
        
        setNpcImg(icoConfig.bust_chat)
        const chatResponse: any = await request.post(api.post_npc_agent_chatStream, {
          npcId: fetchData.npc?.id,
          conversationType:"tone",
          query: "欢迎回家，你看起来有些疲惫，坐下休息一会儿吧（用你的口吻表达）"
        });

        const filteredLines = chatResponse.split('\n');
        const lines = filteredLines.filter((line: string) => line.trim() !== '');
        const result: any[] = [];
        lines.forEach((line: string) => {
          const jsonData = JSON.parse(line.replace('data:', ''));
          if (jsonData.event === 'message' || jsonData.event === 'agent_message') {
            result.push(jsonData.answer);
          } else if (jsonData.event === 'message_file') {
            result.push(jsonData.url);
          }
        });
        setMessage(result.filter(item => item !== "").join(""));
      }
  }
  useEffect(() => {
    fetchChat()
  }, []);
  return (
    <div className='footer' onClick={() => {
      if (jwtExists) {
        routerHangName(router);

      }
  }} style={{ position: "fixed", background: "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.6) 20%)", bottom: 0, width: "100%", height: "150px", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 10%", color: "#ECECEC" }}>
      <div style={{ display: "flex",alignItems:"center" }}>
        <img src={npcImg} alt=""  style={{ marginBottom: "30px", width: lg ? '40px' :'220px' }} />
        <div style={{ marginLeft: "20px" }}>
          <div style={{ color: "#C8C8C8",height: "32px",textAlign:"left",paddingLeft:'4px',lineHeight:"32px" }}>{npcName}</div>
          <div style={{display:"flex",alignItems:"flex-end"}}>
            <div style={{ lineHeight: "30px",width: lg ? '200px' :'830px' }}>{message}</div>
            {npcImg && <img
            src="/footer_bottom.jpg"
            alt=""
            style={{ width: "20px", marginTop: "20px", cursor: "pointer" }} // Add cursor pointer style
            className="logo_loading"
            
          />}
          </div>
        </div>
      </div>

    </div>
  );
}

const calculateAreaPosition = (area: any, windowWidth: any, windowHeight: any) => {
  const x = parseFloat(area.x) * (windowWidth || 100) / 100;
  const y = parseFloat(area.y) * (windowHeight || 100) / 100;
  const width = parseFloat(area.width) * (windowWidth || 100) / 100;
  const height = parseFloat(area.height) * (windowHeight || 100) / 100;
  return { x, y, width,height };
};

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(true); // 默认音乐播放
  const [isRotating, setIsRotating] = useState(true); // 默认旋转
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      isPlaying ? audioRef.current.play() : audioRef.current.pause();
    }
  }, [isPlaying]);

  const toggleMusic = () => {
    setIsPlaying(!isPlaying);
    setIsRotating(!isRotating);
  };

  return (
    <div
      onClick={toggleMusic}
      style={{
        position: 'absolute',
        right: '20px',
        top: '20px',
        cursor: 'pointer',
        width: '48px',
        height: '48px',
        background: 'rgba(0, 0, 0, 0.72)',
        border: '3px solid #C8C8C8',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <img
        style={{
          animation: isRotating ? 'rotate 3s linear infinite' : 'none',
        }}
        src="/music-fill.svg"
        alt="Music Icon"
      />
      {/* <video controls autoPlay muted loop>
        <source src="/music-file.mp3" type="video/mp4" />
        Your browser does not support the video tag.
      </video> */}
      <audio ref={audioRef} src="/music-file.mp3" autoPlay/>
    </div>
  );
};


export function MainLayout({
  children,
  containerSx,
  useContainer = true,
  withinPage = false,
  withBGPage = false,
  withFooter = false,
  hidFooterInMobile = false,
}: MainLayoutProps) {
  const { breakpoints } = useTheme()
  const lg = useMediaQuery(breakpoints.down('lg'))
  const router = useRouter()
  const TWITTER_CLIENT_ID = "NFNvNXdyXzZEX0dJVk5DbWJGa0g6MTpjaQ" // give your twitter client id here
  const [isLoading, setIsLoading] = useState(true);
  const shouldWithPage = withinPage?!withFooter : false;
  const [jwtExists, setJwtExists] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number | null>(null);
  const [windowHeight, setWindowHeight] = useState<number | null>(null);
  const [npc, setNpc] = useState<{} | null>(null);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        const npcIco = JSON.parse(localStorage.getItem('npc') || '{}');
      setNpc(npcIco);
  
      if (npcIco.icoConfig) {
        try {
          const npcConfigStr = npcIco.icoConfig
            .replace(/\n/g, '') // 移除换行符
            .replace(/“|”/g, '"'); // 替换非标准引号
          const npcConfig = JSON.parse(npcConfigStr);
          
          setNpc(npcConfig);
          
        } catch (error) {
          console.error('Error parsing npcConfig:', error);
        }
      }
      }, 4000);
    }
  }, []);
  
  
  const areas = [
    { id: 1, x: '45%', y: '22%', width: 16, height: 20, src: `/dianshi.png` },
    { id: 2, x: '63%', y: '28%', width: 9, height: 33, src: `/youxiji.png` },
    { id: 3, x: '75%', y: '64%', width: 10, height: 29, src: `/shafa.png` },
    { id: 4, x: '55%', y: '68.4%', width: 7, height: 16, src: npc && (npc as { sofa: string }).sofa}
  ];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("currentStage");
      localStorage.removeItem("addfirend");
      localStorage.removeItem("inputValueName");
      const jwt = localStorage.getItem('jwt');
      if (jwt) {
        setJwtExists(true);
        if (localStorage.getItem('followSmash') == 'true') {
          followHangoutTwitter()
        }
      }
    }
  }, []);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setWindowWidth(window.innerWidth);
        setWindowHeight(window.innerHeight);
      };
      window.addEventListener('resize', handleResize);
      handleResize();
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  useEffect(() => {
    // 模拟加载时间
    setTimeout(() => {
      setIsLoading(false);
    }, 5000);
  }, []);

  //post_follow_hangout_follow
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
        console.log('FollowTwitterResponse+', fetchData)
        localStorage.setItem('followSmash', 'false')
      } else {
        console.log('FollowTwitterResponse+ error', fetchData.data)
      }
    } catch (err) {
      console.error(err);
    }
  }

  const handleTwitter = () => {
      // router.push("/campaign");
      const rootUrl = "https://twitter.com/i/oauth2/authorize";
      const options = {
          redirect_uri: TWITTER_OAUTH_CLIENT_REDIRECT,
          client_id: TWITTER_OAUTH_CLIENT_ID,
          state: "state",
          response_type: "code",
          code_challenge: "y_SfRG4BmOES02uqWeIkIgLQAlTBggyf_G7uKT51ku8",
          code_challenge_method: "S256",
          scope: ["users.read", "tweet.read", "follows.write"].join(" "),
      };
      const qs = new URLSearchParams(options).toString();
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem('previousOauthPage', 'HangoutHome')
      }
      return `${rootUrl}?${qs}`;
  };

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
                  {useContainer? <Container sx={containerSx}>{children}</Container> : children}
              </Box>
          </>
      );
  };

  if (lg) {
      return (
          <Box sx={{ minHeight: '100vh', background: '#FAFAFA' }}>
              {/* {withBGPage? (
                  <Box
                      component={'img'}
                      src="/hang_out_bg.png"
                      alt="bg"
                      sx={{
                          position: 'fixed',
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                      }}
                  >

                  </Box>

              ) : null} */}
                        {withBGPage? (
              <>
                  <img
                      src="/hang_out_bg.png"
                      alt="bg"
                      style={{
                          position: 'fixed',
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                      }}
                      onClick={() => {
                        if (jwtExists) {
                          routerHangName(router);
                        }
                    }}
                  />
                  {!jwtExists ? (
                  <a className="a-button row-container" href={handleTwitter()}
                    style={{
                      textDecoration: 'none',
                      position: 'fixed',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      color: '#FFFFFF',
                      padding: '10px 20px',
                      cursor: 'pointer',
                      width: '280px',
                      height: '64px',
                      display: 'flex',
                      justifyContent: 'center',
                      fontSize: '20px',
                      alignItems: 'center',
                      background: '#000',
                      border: '1px solid',
                      borderRadius: '10px',

                    }}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                        }}>
                          <img src="/twitter.svg" alt="Twitter Icon" className="twitter-icon"></img>&nbsp;&nbsp;
                          <p>{'Twitter Login'}</p>
                        </div>
                      </a>
                    ) : (
                      <div></div>
                    )}
                  <Footer></Footer>
              </>
          ) : null}
          </Box>
      );
  }

  return (
      <Box
      className='hang_name'
          component="div"
          sx={[
              {
                  display: { xs: 'none', lg: 'flex' },
                  background: '#FAFAFA',
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
          {withBGPage? (
              <>
              {isLoading && 
              <div style={{zIndex:100,background: '#212121',width:'100%',height:'100vh',display:"flex",justifyContent:"center"}}>
                <img src="/logo_loading.svg" alt=""  className='logo_loading' />
              </div>
              }
                  <img
                      src="/hang_out_bg.png"
                      alt="bg"
                      style={{
                          position: 'fixed',
                          width: '100%',
                          height: '100%',
                      }}
                      onClick={() => {
                        if (jwtExists) {
                          routerHangName(router);
                        }
                    }}
                  />
                  {areas.map((area) => {
                    const { x, y, width, height } = calculateAreaPosition(area, windowWidth, windowHeight);
                    return (
                      <img
                        key={area.id}
                        style={{
                          position: 'absolute',
                          left: x,
                          top: y,
                          width,
                        }}
                        src={area.src ?? ''}
                        alt=""
                      />
                    );
                  })}
                 <MusicPlayer />
                  {!jwtExists ? (
                  <a className="a-button row-container" href={handleTwitter()}
                    style={{
                      textDecoration: 'none',
                      position: 'fixed',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      color: '#FFFFFF',
                      padding: '10px 20px',
                      cursor: 'pointer',
                      backgroundImage: 'url(/twitter_background.png)',
                      width: '480px',
                      height: '64px',
                      display: 'flex',
                      justifyContent: 'center',
                      fontSize: '20px',
                      alignItems: 'center',
                    }}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                        }}>
                          <img src="/twitter.svg" alt="Twitter Icon" className="twitter-icon"></img>&nbsp;&nbsp;
                          <p>{'Twitter Login'}</p>
                        </div>
                      </a>
                    ) : (
                      <div></div>
                    )}
                  <Footer></Footer>
              </>
          ) : null}
      </Box>
  );
}