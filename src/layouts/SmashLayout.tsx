import { Box, SxProps, Theme, useMediaQuery, useTheme } from '@mui/material'
import React, { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import CampaignMobileBackground from '/public/campaign-mobile-bg.svg'
// import CampaignMobileBackground from '/public/campaign_mobile_background.png'
import CampaignMobileTop from '/public/share/campaign_card_m_logo.svg'

interface SmashLayoutProps {
  children: ReactNode
  containerSx?: SxProps<Theme>
  useContainer?: boolean
  withinPage?: boolean
  withBGPage?: boolean
}

export function SmashLayout({ children, containerSx, useContainer = true, withinPage = false, withBGPage = false }: SmashLayoutProps) {
  const { t } = useTranslation()
  const { breakpoints } = useTheme()
  const lg = useMediaQuery(breakpoints.down('lg'))

  if (lg) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
      }}>
        <Box sx={{ display: 'flex', 
         justifyContent: 'center',
         width: '100%',
         height: 'auto'
        }}>
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              height: 'fit-content',
              // height: { xs: 'calc(100vh)', xl: 'calc(100vh - 64px)' },
              // minHeight: { xs: 'calc(100vh)', xl: 'calc(100vh - 64px)' },
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              zIndex: 10,
              backgroundImage:'url("/campaign_mobile_background.png")',
              backgroundSize: '100% 926px',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <Box sx={{ width: '100%', 
              mt: '44px', 
              display: 'flex', 
              height: '274px', 
              alignItems: 'center', 
              justifyContent: 'center',
            }}>
              <img
                src="/share/campaign_card_m_logo_1.png"
                alt="bg"
                style={{
                  width: '275px',
                  height: '264px',
                }}
              />
            </Box>
            {children}
          </Box>
        </Box>
      </Box>
    )
  }


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box
          sx={{
            display: 'flex',
            width: 1280,
            minHeight: { xs: 'unset', xl: 'calc(100vh - 414px)' },
            justifyContent: 'space-between',
          }}
        >
          {children}
        </Box>
      </Box>
      {withBGPage && (
        <img
          src="/smash_bg.png"
          alt="bg"
          style={{
            position: 'fixed',
            zIndex: -999,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      )}
    </Box>
  )
}
