import ReactDOM from 'react-dom'
import { Snackbar, Alert, AlertColor } from '@mui/material'
import { useState } from 'react'

const DURATION = 5000

function Message({ content, type }: { content: string; type: AlertColor }) {
  const [open, setOpen] = useState(true)
  const handleClose = () => setOpen(false)
  const wrongContent = content === 'timeout of 60000ms exceeded' ? 'Network connection is unstable.' : content

  return (
    <Snackbar open={open} autoHideDuration={DURATION} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} onClose={handleClose}>
      <Alert severity={type}>{wrongContent}</Alert>
    </Snackbar>
  )
}

const message = {
  dom: null as any,
  error(content: string) {
    this.dom = document.createElement('div')
    const JSXdom = <Message content={content} type="error" />
    ReactDOM.render(JSXdom, this.dom)
    document.body.appendChild(this.dom)
  },
}

export default message
