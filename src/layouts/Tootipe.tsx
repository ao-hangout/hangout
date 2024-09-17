import { Tooltip,Box } from '@mui/material';
import React, { ReactNode, useState, useEffect, useRef } from 'react'

interface ContentWithTooltipProps {
  children: ReactNode
  tooltipContent?: any
  withoutHover?: string
  placement?: any
  PopperComponent?: any
  padding?: number
}


export const ContentTooltip = ({
  children,
  tooltipContent,
  withoutHover,
  placement,
  PopperComponent,
  padding,
}: ContentWithTooltipProps) => {
  return (
    <Tooltip
      placement={placement}
      PopperComponent={PopperComponent}
      title={
        <Box sx={{ p: padding, fontSize: '12px' }} >
          {tooltipContent}
        </Box>
      }
      arrow
    >
      <Box
        sx={{
          display: 'inline-flex',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          '&:hover': { opacity: withoutHover ? 1 : 0.5 },
        }}
      >
        {children}
      </Box>
    </Tooltip>
  )
}