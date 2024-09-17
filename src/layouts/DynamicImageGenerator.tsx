import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { Avatar, Button, Grid, Dialog, DialogContent, DialogActions, Typography, Box } from '@mui/material';


export default function DynamicImageGenerator() {
  const dialogContentRef = useRef<HTMLDivElement>(null);

  const handleScreenshot = async () => {
    if (dialogContentRef.current) {
      const images = dialogContentRef.current.querySelectorAll('img');
      const imageLoadPromises = Array.from(images).map(
        (img) => new Promise<void>((resolve) => {
          if (img.complete) {
            resolve();
          } else {
            img.onload = () => resolve();
            img.onerror = () => resolve();
          }
        })
      );

      await Promise.all(imageLoadPromises);

      const canvas = await html2canvas(dialogContentRef.current, {
        backgroundColor: '#1c1c1c', // Keep the background transparent
        scale: 2, // Increase the scale for better image quality
      });
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = 'dialog-screenshot.png';
      link.click();
    }
  };


  return (
    <Dialog open={true} maxWidth="md" fullWidth>
      <DialogContent>
        <Box ref={dialogContentRef} sx={{ padding: 3 }}>
          <Typography variant="h4" align="center">
            Twitter Smash
          </Typography>
          <Box display="flex" justifyContent="space-around" alignItems="center" my={2}>
            {/* Avatar 1 */}
            <Box textAlign="center">
              <Avatar
                alt="Tiger Vanguard"
                src="https://yanfa.s3.ap-southeast-1.amazonaws.com/yanfa/ao/role/ico/Tiger Vanguard.png"
                sx={{ width: 80, height: 80 }}
                imgProps={{
                  crossOrigin: 'anonymous',
                  onLoad: () => console.log('Image 1 Loaded'),
                }}
              />
              <Typography>Tiger Vanguard</Typography>
              <Typography variant="caption">@TigerVanguard</Typography>
            </Box>

            {/* VS */}
            <Grid item xs={2} container justifyContent="center" sx={{ mt: -4 }}>
              <img
                src="/vsLogo.png"
                alt="bg"
                style={{
                  position: 'relative',
                  width: '88px',
                  height: '144px',
                  objectFit: 'cover',
                }}
              />
            </Grid>

            {/* Avatar 2 */}
            <Box textAlign="center">
              <Avatar
                alt="GuangZhi"
                src="https://yanfa.s3.ap-southeast-1.amazonaws.com/yanfa/ao/role/ico/Tiger Vanguard.png"
                sx={{ width: 80, height: 80 }}
                imgProps={{
                  crossOrigin: 'anonymous',
                  onLoad: () => console.log('Image 2 Loaded'),
                }}
              />
              <Typography>GuangZhi</Typography>
              <Typography variant="caption">@elonmusk</Typography>
            </Box>
          </Box>

          <Box mt={4}>
            <Typography align="center"
              sx={{ 
                color: '#FFFFFF',
                font: 'normal 500 24px/32px Poppins',
                alignItems: 'center',
            }}>
            The Tiger Vanguard Devours GuangZhi’s Space Dreams!
          </Typography>
          <Typography align="center"
            sx={{ 
              color: '#AAAAAA',
              font: 'normal 400 20px/28px Poppins',
              alignItems: 'center',
              mt: '10px',
          }}>
            In a mind-bending clash of myth and modernity...
          </Typography>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
