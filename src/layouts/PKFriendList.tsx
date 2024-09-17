import { Container, SxProps, Theme, useMediaQuery, useTheme } from '@mui/material'
import React, { ReactNode, useState, useEffect, useRef } from 'react'
import { InputAdornment, Dialog, CircularProgress, DialogTitle, DialogContent, DialogActions, Button, Grid, Avatar, Typography, Box, IconButton, TextField, Autocomplete, List, ListItem, ListItemAvatar, ListItemText, Checkbox } from '@mui/material';
import bgImage from '/public/campaign_bg.png'; // 引用背景图片
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from "next/router";
import api from '@/utils/api'
import { request } from '@/utils/request';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import {ContentTooltip } from './Tootipe'
import message from '@/components/Message'


export const HANGOUT_APP_IMAGE_PROXY = process.env.NEXT_PUBLIC_IMAGE_PROXY as string


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

export function PKFriendList({
  children,
  containerSx,
  useContainer = true,
  withinPage = false,
  withBGPage = false,
  withFooter = false,
  hidFooterInMobile = false,
}: PersonalityLayoutProps) {
  const router = useRouter()
  const { breakpoints } = useTheme()
  const lg = useMediaQuery(breakpoints.down('lg'))
  const [checked, setChecked] = React.useState(false);
  const btnIsDisabled = useRef(false)


  const shouldWithPage = withinPage ? !withFooter : false
  const [open, setOpen] = useState(true); // 控制模态框的打开与关闭

  const handleClose = (event: {}, reason: string) => {
    // 禁止点击背景关闭 Dialog
    if (reason !== 'backdropClick') {
      setOpen(false);// 关闭模态框的逻辑
    }
  };


  const [friendsList, setFriendsList] = useState([{
    "userId": "10000",
    "character": "Wandering Wight",
    "game": "Black Myth: Wukong",
    "text": "Ah, NASA, the Wandering Wight of space exploration. Your tweets are like an endless orbit of optimism about the Starliner while the rest of us are stuck on Earth, wondering if we’ll ever get a flight out of this mundane existence. You're chasing after wealth in the form of space knowledge, but your pessimism about public interest is palpable. Let's face it, while you're busy counting cosmic dust, most of us are just trying to figure out how to pay our bills. Keep floating in that space bubble, but don't expect us to join your celestial pity party anytime soon!",
    "userName": "NASA",
    "ico": "https://yanfa.s3.ap-southeast-1.amazonaws.com/yanfa/ao/role/ico/Wandering Wight.png",
    "twitterIco": "https://pbs.twimg.com/profile_images/874276197357596672/kUuht00m_normal.jpg",
    "roleType": "system"
  }]);


  const [friendsLeft, setFriendsLeft] = useState([{
      "userId": "10000",
      "character": "Wandering Wight",
      "game": "Black Myth: Wukong",
      "text": "Ah, NASA, the Wandering Wight of space exploration. Your tweets are like an endless orbit of optimism about the Starliner while the rest of us are stuck on Earth, wondering if we’ll ever get a flight out of this mundane existence. You're chasing after wealth in the form of space knowledge, but your pessimism about public interest is palpable. Let's face it, while you're busy counting cosmic dust, most of us are just trying to figure out how to pay our bills. Keep floating in that space bubble, but don't expect us to join your celestial pity party anytime soon!",
      "userName": "NASA",
      "ico": "https://yanfa.s3.ap-southeast-1.amazonaws.com/yanfa/ao/role/ico/Wandering Wight.png",
      "twitterIco": "https://pbs.twimg.com/profile_images/874276197357596672/kUuht00m_normal.jpg",
      "roleType": "system"
  }]);

  const [friendsRight, setFriendsRight] = useState([{
      "userId": "10000",
      "character": "Wandering Wight",
      "game": "Black Myth: Wukong",
      "text": "Ah, NASA, the Wandering Wight of space exploration. Your tweets are like an endless orbit of optimism about the Starliner while the rest of us are stuck on Earth, wondering if we’ll ever get a flight out of this mundane existence. You're chasing after wealth in the form of space knowledge, but your pessimism about public interest is palpable. Let's face it, while you're busy counting cosmic dust, most of us are just trying to figure out how to pay our bills. Keep floating in that space bubble, but don't expect us to join your celestial pity party anytime soon!",
      "userName": "NASA",
      "ico": "https://yanfa.s3.ap-southeast-1.amazonaws.com/yanfa/ao/role/ico/Wandering Wight.png",
      "twitterIco": "https://pbs.twimg.com/profile_images/874276197357596672/kUuht00m_normal.jpg",
      "roleType": "system"
  },]);
  const [selectedFriend, setSelectedFriend] = useState('');
  const [pkTwitterUsername, setPkTwitterUsername] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([1]); // Initially, Black Bear Spirit is selected
  const [pkAvailable, setPkAvailable] = useState('')
  const [battleLoading, setBattleLoading] = useState(false)
  const [friendLoading, setFriendLoading] = useState(false)

  



  const handleSearchChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    localStorage.setItem('pkFriendUserId', '')
    setSearchTerm(event.target.value);
    localStorage.setItem('pkTwitterUsername', pkTwitterUsername)
    setPkTwitterUsername(event?.target?.value)
    btnIsDisabled.current = true
    setChecked(false)
    setSelectedFriend('')
  };


  const handleSelectFriend = (friend: string) => {
    setSearchTerm('')
    localStorage.setItem('pkTwitterUsername', '')
    console.log('1111111+friend', friend)
    localStorage.setItem('pkFriendUserId', friend)
    btnIsDisabled.current = true
    setSelectedFriend(friend);
    setChecked(true)
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // setChecked(event.target.checked);
    if (event.target.checked == true) {
      setChecked(true)
      btnIsDisabled.current = true
    } else {
      setChecked(false)
    }
  };



  const handleFetchFriendList = async () => {
    try {
      setFriendLoading(true)
      const params = {}
      const fetchData = (await request.post(api.post_pk_friend_list, params, {
        headers: {
          "Content-Type": "application/json",
        },
      })) as any
      if (fetchData && fetchData.code == 1) {
        setFriendLoading(false)
        console.log('handleFetchFriendList result++++++', fetchData)
        const fetchedFriends = fetchData.friends
        setFriendsList(fetchedFriends)
        // Split the friends list into left and right columns
        if (fetchedFriends.length >= 2) {
          console.log('length++++++12')
          const half = Math.ceil(fetchedFriends.length / 2);
          setFriendsLeft(fetchedFriends.slice(0, half));
          setFriendsRight(fetchedFriends.slice(half));
        } else {
          setFriendsLeft(fetchedFriends);
          setFriendsRight([]);
        }
        setSelectedFriend(localStorage.getItem('bindPkId') ?? '1')
        // if (!localStorage.getItem('bindPkId')) {
        //   handleSelectFriend(localStorage.getItem('bindPkId') ?? '1')
        // }
        } else {
          setFriendLoading(false)
          console.log('handleFetchFriendList result+error', fetchData)
        }
      return fetchData.data
    } catch (err) {
      setFriendLoading(false)
      console.error(err);
      return null;
    }
  }


  function removeAtSymbol(input: string): string {
    if (input.charAt(0) === '@') {
      return input.substring(1);  // Remove the '@' symbol by taking the substring from the second character
    }
    return input;  // Return the original string if it doesn't start with '@'
  }


  const handleStartPK = async () => {
    try {
      setBattleLoading(true)
      var pkTwitterUsername = ''
      var pkUserId = ''
      if (searchTerm == '' && selectedFriend) { //selected
        pkUserId = selectedFriend
        pkTwitterUsername = ''
      } else {
        pkTwitterUsername = searchTerm
        pkUserId = ''
      }

      pkTwitterUsername = removeAtSymbol(pkTwitterUsername)
      const params = {
        "device": {
          "appCode": "string",
          "deviceID": "string",
          "imei": "string",
          "osplatform": "string",
          "osversion": "string",
          "version": "string"
        },
        "pkTwitterUsername": pkTwitterUsername,
        "pkUserId": pkUserId
      }
      console.log('getPK params++++++', params)
      const fetchData = (await request.post(api.post_start_pk, params, {
        headers: {
          "Content-Type": "application/json",
        },
      })) as any
      if (fetchData && fetchData.code == 1) {
        const pkRoleDict = fetchData.pkRole
        let pkRoleString;
        console.log('当前pk结果role', pkRoleDict)
        if (typeof pkRoleDict === 'string') {
          pkRoleString = pkRoleDict
        } else {
          //'{\n  "title": "Football Frenzy: Zombie Tackles Jimm…, proving once and for all: brains over brawn!"\n}'
          pkRoleString = JSON.stringify(pkRoleDict)
        }
        localStorage.setItem('currenPkRole', pkRoleString)
        if (typeof fetchData.result === 'string') {
          let resultJSON = JSON.parse(fetchData.result)
          localStorage.setItem('resultTitle', resultJSON.title)
          localStorage.setItem('resultWinner', resultJSON.winner)
          localStorage.setItem('resultText', resultJSON.text)
          
          
          localStorage.setItem('pkCharacter', fetchData.pkRole.character)
          localStorage.setItem('pkGame', fetchData.pkRole.game)
          localStorage.setItem('pkIcon', (HANGOUT_APP_IMAGE_PROXY + fetchData.pkRole.ico))
          console.log('pkOb+proxyImageUrl', (HANGOUT_APP_IMAGE_PROXY + fetchData.ico))

          localStorage.setItem('pkRoleType', fetchData.pkRole.roleType)
          localStorage.setItem('pkText', fetchData.pkRole.text)
          localStorage.setItem('pkTwitterUsername', fetchData.pkRole.twitterUserName)
          localStorage.setItem('pkTwitters', fetchData.pkRole.twitters)
          setBattleLoading(false)
          setOpen(false)
          router.push('/pkresult')
        }
        console.log('getPK result++++++', fetchData)
      } else {
        console.log('getPK result+error', fetchData)
        message.error(fetchData.message)
        //toast
        setBattleLoading(false)
      }
      return fetchData.data
    } catch (err) {
      // message.error(err)
      console.error(err);
      setBattleLoading(false)
      return null;
    }
  }


  // const bindNewPKfriend = async () => {
  //   try {
  //     const params = {
  //     }
  //     // POST request to the token url to get the access token and twittr user infos
  //     const fetchData = (await request.post(api.post_bind_pk_friend, params, {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     })) as any
  //     if (fetchData && fetchData.code == 1) {
  //       console.log('FollowTwitterResponse+', fetchData)
  //     } else {
  //       console.log('FollowTwitterResponse+ error', fetchData.data)
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }


  //post_follow_hangout_follow
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
        setPkAvailable(fetchData.leftPkTimes.toString())
      } else {
        console.log('FollowTwitterResponse+ error', fetchData.data)
      }
    } catch (err) {
      console.error(err);
    }
  }


  const handleLeftPKTimes = async () => {
    try {
      const params = {
      }
      const fetchData = (await request.post(api.post_get_leftpktimes, params, {
        headers: {
          "Content-Type": "application/json",
        },
      })) as any
      if (fetchData && fetchData.code == 1) {
        console.log('FollowTwitterResponse+', fetchData)
        setPkAvailable(fetchData.leftPkTimes.toString())
      } else {
        console.log('FollowTwitterResponse+ error', fetchData.data)
      }
    } catch (err) {
      console.error(err);
    }
  }


  useEffect(() => {
    if (typeof window !== 'undefined') { //client
      if (localStorage.getItem('jwt')) {
        handleFetchFriendList()
        handleLeftPKTimes()
      }
    }
  }, []);

  const handleBackToLastpage = () => {
    router.push('/personality')
  }

  const handleBackTohomepage = () => {
    router.replace('/')
  }

  const getActionParams = () => {
    if (!btnIsDisabled.current || pkAvailable == '0') return { disabled: true, content: <>{'Start Battle'}</> }
    return { content: 'Start Battle', handleClick: handleStartPK }
  }

  const { content, disabled, handleClick } = getActionParams()


  if (lg) {
    return (
      // <Box sx={{ minHeight: '100vh', background: '#FAFAFA' }}>
        <Box
          sx={{
            height: '100vh',
            minHeight: '100vh', // 设置较大的高度，确保页面可以滚动
            overflowY: 'auto', // 允许垂直方向滚动
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: '#000',
            color: '#fff',
            padding: '16px',
          }}
        >
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{display: 'flex', flexDirection: 'row' }}>
            <IconButton sx={{ color: '#fff' }} onClick={handleBackToLastpage}>
              <ArrowBackIcon />
            </IconButton>
            <Typography sx={{ mt: '10px' }}>Battle List</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography color="gray" mr={5}>{'Battle available times: ' + `${pkAvailable}`}</Typography>
              <ContentTooltip placement="top" padding={3} tooltipContent={(<Box>Share your victory to earn more battle chances, up to 100 times</Box>)}>
                <img src="/info-circle.svg" alt="" />
              </ContentTooltip>
            </Box>
          </Box>

          {/* Search Input */}
          <TextField
            variant="outlined"
            placeholder="@username"
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{
              backgroundColor: '#333',
              borderRadius: '8px',
              input: { color: '#fff' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#555' },
                '&:hover fieldset': { borderColor: '#aaa' },
              },
            }}
          />
          <DialogContent sx={{ padding: '8px', }}>
            {/* <Grid item xs={6}> */}
              <List sx={{ width: '100%'}}>
              {friendsList
                .map((friend, index) => (
                  <ListItem
                          key={index}
                          button
                          onClick={() => handleSelectFriend(friend.userId)}
                          selected={selectedFriend === friend.userId}
                          sx={{
                            backgroundColor: selectedFriend === friend.userId ? '#2c2c2c' : 'transparent',
                            borderRadius: '10px',
                            marginBottom: '8px',
                            width: '100%',
                            height: '110px',
                            '&:hover': {
                              backgroundColor: 'transparent', // hover background color
                            },
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar alt={friend.game} src={friend.twitterIco} sx={{ width: 48, height: 48 }} />
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              friend.roleType == "system" 
                              ? 
                              <Box display="flex" flexDirection="column" alignItems={'flex-start'} mb={6}>
                                <Box sx={{ display: 'flex', alignContent: 'left', alignItems: 'left', }}>
                                  <Typography align="left"
                                    sx={{
                                      color: '#FFFFFF',
                                      mb: -20,
                                      font: 'normal 400 16px/24px Poppins',
                                      alignItems: 'left',
                                  }}>
                                    {'@' + friend.userName}
                                  </Typography>
                                </Box>
                              </Box>
                              :
                              <Box display="flex" flexDirection="column" alignItems={'flex-start'} mb={3} >
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
                                    {friend.game}
                                  </Typography>
                                </Box>
                                {/* Username */}
                                <Box sx={{ display: 'flex', alignContent: 'left', alignItems: 'left'}}>
                                  <Typography align="left"
                                    sx={{
                                      color: '#ECECEC',
                                      // color: '#FFFFFF',
                                      font: 'normal 400 16px/24px Poppins',
                                      alignItems: 'left',
                                  }}>
                                    {'@' + friend.userName}
                                    </Typography>
                                </Box>
                            </Box>
                            }
                          />
                          <ListItemText
                            sx={{pl: '-20px',  alignItems: 'flex-start'}}
                            primary={
                              friend.roleType == "system" 
                              ? 
                              null
                              :
                              <Typography align="left"
                                sx={{
                                  color: '#FFFFFF',
                                  font: 'normal 400 16px/24px Poppins',
                                  alignItems: 'center',
                                  height: '24px',
                                  width: '140px',
                                  mt: '-10px',
                              }}>
                                {friend.character}
                              </Typography>
                            }
                          />
                          <Checkbox
                            color="secondary"
                            checked={selectedFriend === friend.userId}
                            onChange={handleChange}
                            inputProps={{ 'aria-label': 'controlled' }}
                            sx={{
                              '& .MuiSvgIcon-root': {
                                border: 'none', // 移除边框
                              },
                              mr: '-12px',
                              // pr: '20px',
                              color: 'transparent', // 隐藏未选中状态的颜色
                              '&.Mui-checked': {
                                color: '#C8C8C8', // 设置选中状态的颜色
                              },
                            }}
                          />
                        </ListItem>
                ))}
              </List>
          {/* </Grid> */}
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
          <Button
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: '#fff',
              color: '#000',
              borderRadius: '8px',
              padding: '12px',
              fontWeight: 'bold',
              '&.Mui-disabled': {
                color: 'grey.500', // 更深的灰色
                backgroundColor: 'grey.300', // 浅灰色背景
              },
            }}
            disabled={disabled || battleLoading}
            onClick={handleStartPK}
          >
            {battleLoading && <CircularProgress color="inherit" size="16px" sx={{ mr: 2 }} />}
            {content}
          </Button>
        </DialogActions> 
        </Box>
    //  </Box> 
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
              onClick={handleBackTohomepage}
            >
              Hang Out
            </Button>
          </Box>
          {friendLoading ?
            (<Dialog
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
            <Box display="flex" justifyContent="space-between" alignItems="center" p={1}>
              <Typography align="center"
                sx={{
                  color: '#FFFFFF',
                  font: 'normal 500 24px/36px Poppins',
                  alignItems: 'center',
              }}>
                Battle List
              </Typography>
              <Button 
                variant="contained" 
                sx={{ color: '#FFFFFF', backgroundColor: '#1c1c1c', textTransform: 'none', height: '48px', borderRadius: '8px',width:"120px", fontSize: '16px',
                  '&:hover': {
                    backgroundColor: '#2E2E2E', // Slightly darker background on hover
                  },
                 }}
                startIcon={
                  <img
                  src="/back2last.png"
                  alt="icon"
                  style={{ width: 24, height: 16 }}
                />
                }
                onClick={handleBackToLastpage}
              >
                Back
              </Button>
            </Box>
            <DialogContent>
              {/* 搜索框 */}
              <TextField
                variant="outlined"
                placeholder="@username"
                value={searchTerm}
                onChange={handleSearchChange}
                sx={{
                  backgroundColor: '#333',
                  width: '360px',
                  borderRadius: '8px',
                  input: { color: '#fff' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#555' },
                    '&:hover fieldset': { borderColor: '#aaa' },
                  },
                }}
                // InputProps={{
                //   startAdornment: (
                //     <InputAdornment position="start">
                //       <SearchIcon sx={{ color: '#aaa' }} />
                //     </InputAdornment>
                //   ),
                // }}
              />
              <Grid container spacing={2} mt={2}>
                <Grid item xs={6}>
                  <List>
                    {friendsLeft.map((friend, index) => (
                      <ListItem
                        key={index}
                        button
                        onClick={() => handleSelectFriend(friend.userId)}
                        selected={selectedFriend === friend.userId}
                        sx={{
                          backgroundColor: selectedFriend === friend.userId ? '#2c2c2c' : 'transparent',
                          borderRadius: '10px',
                          marginBottom: '8px',
                          height: '110px',
                          '&:hover': {
                            backgroundColor: 'transparent', // hover background color
                          },
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar alt={friend.game} src={friend.twitterIco} sx={{ width: 48, height: 48 }} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            friend.roleType == "system" 
                            ? 
                            <Box display="flex" flexDirection="column" alignItems={'flex-start'} mb={6}>
                              <Box sx={{ display: 'flex', alignContent: 'left', alignItems: 'left', }}>
                                <Typography align="left"
                                  sx={{
                                    color: '#FFFFFF',
                                    mb: -20,
                                    font: 'normal 400 16px/24px Poppins',
                                    alignItems: 'left',
                                }}>
                                  {'@' + friend.userName}
                                </Typography>
                              </Box>
                            </Box>
                            :
                            <Box display="flex" flexDirection="column" alignItems={'flex-start'} mb={3} >
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
                                  {friend.game}
                                </Typography>
                              </Box>
                              {/* Username */}
                              <Box sx={{ display: 'flex', alignContent: 'left', alignItems: 'left'}}>
                                <Typography align="left"
                                  sx={{
                                    color: '#ECECEC',
                                    // color: '#FFFFFF',
                                    font: 'normal 400 16px/24px Poppins',
                                    alignItems: 'left',
                                }}>
                                  {'@' + friend.userName}
                                </Typography>
                              </Box>
                          </Box>
                          }
                        />
                        <ListItemText
                          sx={{pl: '-20px', alignItems: 'flex-start'}}
                          primary={
                            friend.roleType == "system" 
                            ? 
                            null
                            :
                            <Typography align="left"
                              sx={{
                                color: '#FFFFFF',
                                  font: 'normal 400 16px/24px Poppins',
                                  alignItems: 'center',
                                  height: '24px',
                                  width: '140px',
                                  mt: '-10px',
                            }}>
                              {friend.character}
                            </Typography>
                          }
                        />
                        <Checkbox
                          color="secondary"
                          checked={selectedFriend === friend.userId}
                          onChange={handleChange}
                          inputProps={{ 'aria-label': 'controlled' }}
                          sx={{
                            '& .MuiSvgIcon-root': {
                              border: 'none', // 移除边框
                            },
                            color: 'transparent', // 隐藏未选中状态的颜色
                            '&.Mui-checked': {
                              color: '#C8C8C8', // 设置选中状态的颜色
                            },
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
                <Grid item xs={6}>
                  <List>
                    {friendsRight.map((friend, index) => (
                      <ListItem
                        key={index}
                        button
                        onClick={() => handleSelectFriend(friend.userId)}
                        selected={selectedFriend === friend.userId}
                        sx={{
                          backgroundColor: selectedFriend === friend.userId ? '#2c2c2c' : 'transparent',
                          borderRadius: '10px',
                          marginBottom: '8px',
                          height: '110px',
                          '&:hover': {
                            backgroundColor: 'transparent', // hover background color
                          },
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar alt={friend.game} src={friend.twitterIco} sx={{ width: 48, height: 48 }} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            friend.roleType == "system" 
                            ?
                            <Box display="flex" flexDirection="column" alignItems={'flex-start'} mb={6}>
                              <Box sx={{ display: 'flex', alignContent: 'left', alignItems: 'left', }}>
                                <Typography align="left"
                                  sx={{
                                    color: '#FFFFFF',
                                    mb: -20,
                                    font: 'normal 400 16px/24px Poppins',
                                    alignItems: 'left',
                                }}>
                                  {'@' + friend.userName}
                                </Typography>
                              </Box>
                            </Box>
                            :
                            <Box display="flex" flexDirection="column" alignItems={'flex-start'} mb={3} >
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
                                  {friend.game}
                                </Typography>
                              </Box>
                              {/* Username */}
                              <Box sx={{ display: 'flex', alignContent: 'left', alignItems: 'left' }}>
                                <Typography align="left"
                                  sx={{
                                    color: '#ECECEC',
                                    font: 'normal 400 16px/24px Poppins',
                                    alignItems: 'left',
                                }}>
                                  {'@' + friend.userName}
                                </Typography>
                              </Box>
                          </Box>
                          }
                        />
                        <ListItemText
                          sx={{pl: '-20px', bgcolor: '#FFFFFF', alignItems: 'flex-start'}}
                          primary={
                            friend.roleType == "system" 
                            ? 
                            null
                            :
                            <Typography align="left"
                              sx={{
                                color: '#FFFFFF',
                                font: 'normal 400 16px/24px Poppins',
                                alignItems: 'left',
                                mt: '-24px',
                            }}>
                              {friend.character}
                            </Typography>
                          }
                        />
                        <Checkbox
                          color="secondary"
                          checked={selectedFriend === friend.userId}
                          onChange={handleChange}
                          inputProps={{ 'aria-label': 'controlled' }}
                          sx={{
                            '& .MuiSvgIcon-root': {
                              border: 'none', // 移除边框
                            },
                            color: 'transparent', // 隐藏未选中状态的颜色
                            '&.Mui-checked': {
                              color: '#C8C8C8', // 设置选中状态的颜色
                            },
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>
              
            </DialogContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} ml={2} mr={2} mb={3}>
              {/* PK 可用次数 */}
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography color="gray" mr={5}>{'Battle available times: ' + `${pkAvailable}`}</Typography>
                <ContentTooltip placement="top" padding={3} tooltipContent={(<Box>Share your victory to earn more battle chances, up to 100 times</Box>)}>
                  <img src="/info-circle.svg" alt="" />
                </ContentTooltip>
              </Box>
              <Button
                variant="contained"
                sx={{ 
                  backgroundColor: '#fff', color: '#333', textTransform: 'none', width: '408px', height: '48px', borderRadius: '8px',
                  '&.Mui-disabled': {
                    color: 'grey.500', // 更深的灰色
                    backgroundColor: 'grey.300', // 浅灰色背景
                  },
                 }}
                disabled={disabled || battleLoading}
                onClick={handleStartPK}
              >
                {battleLoading && <CircularProgress color="inherit" size="16px" sx={{ mr: 2 }} />}
                {content}
              </Button>
            </Box>
            </Dialog>
           )}
        </div>
      ) : null}
    </Box>
  )
}
