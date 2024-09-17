import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Avatar, CircularProgress } from '@mui/material';
// import { useUserModalContext } from '@/hooks/useUserModal';
import { BasicModal } from './Modal';


const PersonalityModal = () => {
  // const { showPersonalityModal, setShowPersonalityModal, closePersonalityModal } = useUserModalContext()
  const [open, setOpen] = useState(true); // 控制模态框的打开与关闭


  const handleClose = (event: {}, reason: string) => {
    // 禁止点击背景关闭 Dialog
    if (reason !== 'backdropClick') {
      setOpen(false);// 关闭模态框的逻辑
    }
  };

  return (
    <BasicModal
      open={true}
      setOpen = {setOpen}
    >
      <Box sx={{ height: 320, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress sx={{ color: '#4685FF' }} size="48px" />
      </Box>
      {/* <DialogTitle>
        <Typography align="center" variant="display1">
          Entering the gaming world
        </Typography>
      </DialogTitle>
      <DialogContent>
        {/* 中间头像部分 */}
        {/* <Box display="flex" justifyContent="center" mb={2}>
          <Avatar
            alt="Tiger Pioneer"
            src="/path-to-your-avatar.jpg" // 替换为你自己的头像图片路径
            sx={{ width: 80, height: 80 }}
          />
        </Box>

        {/* 游戏角色标题和描述 */}
        {/* <Typography variant="subheader1" align="center">
          You are the Tiger Pioneer in "Black Myth: Wukong"!!!
        </Typography>
        <Typography variant="subheader2" align="center" paragraph>
          You have a close relationship with felines, but whoever rubs your fur will break their skull.
          You have an excellent appetite and indulge in the monkey head takeout that comes to your door every day.
        </Typography>
        <Typography variant="subheader2" align="center">
          "Heavenly mandate, go practice again, don't give up..."
        </Typography> */}

        {/* 钱包信息 */}
        {/* <Typography variant="caption" display="block" align="center" mt={3}>
          Agent code: 5238****4309
        </Typography>
      </DialogContent>

      {/* 按钮区域 */}
      {/* <DialogActions style={{ justifyContent: 'center' }}>
        <Button variant="outlined" onClick={() => setOpen(false)}>
          Create my intelligent agent
        </Button>
        <Button variant="outlined" onClick={() => setOpen(false)}>
          PK with my friend
        </Button>
        <Button variant="contained" color="primary" onClick={() => window.open('https://twitter.com/intent/tweet', '_blank')} sx={{ margin: '0 10px' }}>
          Share to Twitter
        </Button>
      </DialogActions> */}
    {/* </Dialog> */}
    </BasicModal>
  );
};

export default PersonalityModal;
