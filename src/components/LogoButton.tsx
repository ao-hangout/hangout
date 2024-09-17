import React from 'react';
import { Button } from '@mui/material';
import Image from 'next/image';

const LogoButton = () => {
    return (
      <Button
        variant="contained"
        sx={{
          padding: '0px',
          backgroundColor: '#333',
          color: '#fff',
          '&:hover': {
              backgroundColor: '#555',
          },
        }}
      >
        <Image
          src="/logo_logo.png"
          alt="Hangout Logo"
          width={226}
          height={48}
        />
      </Button>
    );
};

export default LogoButton;
