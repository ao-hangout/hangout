import { ActivityLayout } from './ActivityLayout'
import { Box } from '@mui/material'
import React, { ReactNode } from 'react'


interface CampaignLayoutProps {
  children: ReactNode
  useContainer?: boolean
  withinPage?: boolean
  withBGPage?: boolean
}


export function CampaignLayout({ children, withBGPage = false }: CampaignLayoutProps) {

  return (
    <ActivityLayout withBGPage={true}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' } }}>
        <Box
          sx={{
            width: 188,
            borderRadius: '20px',
            display: { xs: 'none', lg: 'flex' },
            flexShrink: 0,
            bgcolor: '#ffff',
            p: '24px 8px',
            mr: 6,
            minHeight: { xs: 'unset', xl: 'calc(100vh - 120px)' },
          }}
        >
        </Box>
        <Box width={'100%'}>
          {children}
        </Box>
      </Box>
    </ActivityLayout>
  )
}
