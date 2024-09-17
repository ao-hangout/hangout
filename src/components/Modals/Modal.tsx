import { XCircleIcon } from '@heroicons/react/outline'
import { Box, IconButton, Modal, Paper, SvgIcon, SxProps, Theme } from '@mui/material'
import React from 'react'


export interface BasicModalProps {
  open: boolean
  children: React.ReactNode
  setOpen: (value: boolean) => void
  withCloseButton?: boolean
  setCloseButton?: boolean
  contentMaxWidth?: number
  contentMaxHeight?: number
  closeButtonContainerSx?: SxProps<Theme>
  closeButtonSize?: string
  contentScrollable?: boolean
}

export const BasicModal = ({
  open,
  setOpen,
  withCloseButton = true,
  contentMaxWidth = 448,
  contentMaxHeight = 100,
  children,
  setCloseButton,
  closeButtonContainerSx,
  closeButtonSize,
  contentScrollable = true,
  ...props
}: BasicModalProps) => {
  const handleClose = () => setOpen(false)

  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        '.MuiPaper-root': {
          outline: 'none',
          borderRadius: '16px',
        },
      }}
      onClick={(e) => {
        e.stopPropagation()
      }}
      {...props}
      data-cy={'Modal'}
    >
      <Paper
        sx={{
          position: 'relative',
          overflowY: contentScrollable ? 'auto' : 'hidden',
          width: '100%',
          maxWidth: { xs: '359px', xsm: `${contentMaxWidth}px` },
          maxHeight: `calc(${contentMaxHeight}vh - 20px)`,
          p: { xs: 4, lg: 8 },
        }}
      >
        {children}
        {withCloseButton && (
          <Box
            sx={{
              position: 'absolute',
              top: setCloseButton ? '8px' : { xs: '16px', lg: '28px' },
              right: setCloseButton ? '32px' : { xs: '40px', lg: '50px' },
              zIndex: 5,
              ...closeButtonContainerSx,
            }}
          >
            <IconButton
              sx={{
                borderRadius: '50%',
                p: 0,
                minWidth: 0,
                position: 'absolute',
              }}
              onClick={handleClose}
              data-cy={'close-button'}
            >
              <SvgIcon sx={{ fontSize: closeButtonSize || '24px', color: 'text.muted' }}>
                <XCircleIcon data-cy={'CloseModalIcon'} strokeWidth={1.5} />
              </SvgIcon>
            </IconButton>
          </Box>
        )}
      </Paper>
    </Modal>
  )
}
