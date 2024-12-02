import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppBar, Toolbar, Button, Box, Typography } from '@mui/material';

const Header: React.FC = () => {
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);

  useEffect(() => {
    setLoggedInUser(localStorage.getItem("loggedInUser"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setLoggedInUser(null);
  };

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        backgroundColor: '#23272a', 
        width: '100%', 
        boxSizing: 'border-box',
      }}
    >
      <Toolbar 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: { xs: '0.5rem', md: '1rem' },
        }}
      >
        {/* App Name */}
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'white', 
            fontWeight: 'bold', 
          }}
        >
          MyApp
        </Typography>

        {/* Links */}
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            alignItems: 'center',
          }}
        >
          <Link href="/" passHref>
            <Button sx={{ color: 'white', textTransform: 'none' }}>Home</Button>
          </Link>
          <Link href="/chat" passHref>
            <Button sx={{ color: 'white', textTransform: 'none' }}>Public Chat</Button>
          </Link>
          {!loggedInUser ? (
            <Link href="/login" passHref>
              <Button sx={{ color: 'white', textTransform: 'none' }}>Login</Button>
            </Link>
          ) : (
            <>
              <Button onClick={handleLogout} sx={{ color: 'white', textTransform: 'none' }}>
                Logout
              </Button>
              <Typography sx={{ color: 'white', fontSize: '0.9rem' }}>
                Welcome, {loggedInUser}!
              </Typography>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
