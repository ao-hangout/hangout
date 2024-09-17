import { Box, Button, Typography, CircularProgress, Checkbox, TextField, IconButton, SvgIcon, useTheme, useMediaQuery } from '@mui/material'
import { useTranslation } from 'react-i18next'
import TwitterLogin from 'react-twitter-auth';
import { TwitterOauthButton } from '@/components/TwitterOauthButton';



export default function Landing({ handleNext }: { handleNext: () => void }) {
  const { breakpoints } = useTheme()
  const downLg = useMediaQuery(breakpoints.down('lg'))
  const { t } = useTranslation()

  const handleCheckAndNext = () => {
    handleNext()
  }

  const authHandler = (err: any, data: any) => {
    console.log(err, data);
  };


  const onSuccess = (response: any) => {
    console.log('Twitter+response', response)
  }


  const onFailed = (error: any) => {
    console.log('Twitter+error', error)
  }


  if (downLg) {
    return (
      <Box sx={{ height: '844px', width: '100%', backgroundColor: '#212121' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            mt: '40px',
            px: '16px',
            width: '100%',
            height: '56px',
          }}
        >
          <Typography sx={{ 
            color: '#FFFFFF',
            font: 'normal 500 17px/24px Poppins',
            alignItems: 'center',
          }}>
            {t('Here is a link to participate in our events for AO')}
          </Typography>
        </Box>
        <Box
          sx={{
            mt: '100px',
            width: '100%',
            height: '84px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            px: '16px',
          }}
        >
          <Typography sx={{
            color: '#FFE770',
            font: 'normal 500 32px/40px Poppins',
            textAlign: 'center',
            alignItems: 'center', 
            mt: '6px' 
          }}>
            {t('When you travel to the')}
          </Typography>
          <Typography sx={{
            color: '#FFE770',
            font: 'normal 500 32px/40px Poppins',
            textAlign: 'center',
            mt: '2px',
            height: '40px',
          }}>
            {t('game world ...')}
          </Typography>
          <Typography sx={{
            color: '#FFE770',
            font: 'normal 500 32px/40px Poppins',
            textAlign: 'center',
            mt: '6px' 
          }}>
            {t('Surprisingly...')}
          </Typography>
          {/* <Box sx={{}}></Box> */}
          <Typography sx={{
            color: '#FFFFFF',
            font: 'normal 500 16px/32px Poppins',
            textAlign: 'center',
            mt: '40px',
          }}>
            {t('Click start to bind Twitter for access permission')}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '56px',
            mt: '130px',
            mb: '-70px',
          }}
        >
          <Button
            variant="activity_go"
            sx={{
              width: '80%', 
              height: '56px',
              border: '3px solid #78a0fa',
            }}
            size="large"
            onClick={handleCheckAndNext}
          >
            {t('Start')}
          </Button>
        </Box>
      </Box>
    )
  }

  return (
    <>
      <Box
        sx={{
          width: '100%',
          height: '80px',
        }}
      >
        <Typography sx={{ 
          color: '#FFFFFF',
          font: 'normal 500 24px/32px Poppins',
          alignItems: 'center',
        }}>
          {t('Here is a link to participate in our events for Token2049')}
        </Typography>
      </Box>
      <Box
        sx={{
          mt: '54px',
          width: '100%',
          height: '84px',
        }}
      >
        <Typography sx={{
          color: '#FFFFFF',
          font: 'normal 500 18px/24px Poppins',
          textAlign: 'left',
          mt: '20px',
          height: '40px',
        }}>
          {t('Welcome to the special event')}
        </Typography>
        <Typography sx={{
          color: '#FFFFFF',
          font: 'normal 500 18px/24px Poppins',
          textAlign: 'left',
          mt: '4px',
          height: '40px',
        }}>          
          {t('You can get access to DEFE tokens rewards')}
        </Typography>
        <Typography sx={{
          color: '#FFFFFF',
          font: 'normal 500 18px/24px Poppins',
          textAlign: 'left',
          mt: '30px',
          height: '40px',
        }}>
          {t('Please register/login to bound the card')}
        </Typography>
        <Typography sx={{
          color: '#FFFFFF',
          font: 'normal 500 18px/24px Poppins',
          textAlign: 'left',
          mt: '30px',
          height: '40px',
        }}>
          {t('You will be rewarded, and if you want to get Free ETH or more')}
        </Typography>
        {/* <Typography sx={{
          color: '#FFFFFF',
          font: 'normal 500 18px/24px Poppins',
          textAlign: 'left',
          mt: '20px',
          height: '40px',
        }}>
          {t('Hope you are having a great time')}
        </Typography> */}
      </Box>
      {/* <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '56px',
          pt: '260px',
        }}
      >
        <Button
          variant="activity_go" 
          size="large"
          sx={{
            width: '287px', 
            height: '56px',
            border: '3px solid #78a0fa',
          }}
          onClick={handleCheckAndNext}
        >
          {t('Start Now')}
        </Button>
      </Box>
      <TwitterLogin
          authCallback={authHandler}
          consumerKey={"SkRxOTJZLTBNMnNGbGI4ejctYUg6MTpjaQ"}
          consumerSecret={"maT5TMPemzVIaE9NpLfPQcX9sXimUlvLqxsONL9Yd12qjBqZYE"}
          callbackUrl={"http://www.localhost:3000/oauth/twitter"}
          buttonTheme={"dark"}
        /> */}
        {/* <TwitterLogin
          loginUrl="http://www.localhost:3000/campaign"
          onFailure={onFailed}
          onSuccess={onSuccess}
          requestTokenUrl="http://www.localhost:3000/oauth"
        /> */}
        <TwitterOauthButton />
    </>
  )
}

 //   // <div className="column-container">
    //   //   <p>Hello!</p>
    //   //   <TwitterOauthButton />
    //   // </div>