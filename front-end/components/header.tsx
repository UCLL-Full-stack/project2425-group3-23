import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppBar, Toolbar, Button, Box, Typography } from '@mui/material';
import { useTranslation } from "next-i18next";
import { User } from '@/types';
import Language from './language/language';
import {getUser} from "@services/api";

const Header: React.FC = () => {
  const { t } = useTranslation();
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));

    // Try to authenticate the user if there is a stored user
    if (storedUser) {
      try {
        updateUser(storedUser);
      } catch (error) {
        localStorage.removeItem("loggedInUser");
        setLoggedInUser(null);
      }
    }
  }, []);

  const updateUser = async ({ username, token } : { username: string, token: string }) => {
    try {
      const user: User = await getUser(username, token);
      if (user) {
        setLoggedInUser(user);
      } else {
        localStorage.removeItem("loggedInUser");
        setLoggedInUser(null);
      }
    } catch (error) {
        localStorage.removeItem("loggedInUser");
        setLoggedInUser(null);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setLoggedInUser(null);
    window.location.href = '/';
  };

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        backgroundColor: '#23272a', 
        width: '100%', 
        boxSizing: 'border-box',
        mb: '1em'
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
        <Typography 
          variant="h1"
          sx={{ 
            color: 'white', 
            fontWeight: 'bold',
            fontSize: { xs: '1.5rem', md: '2rem' },
          }}
        >
          {t('header.appName', 'MyApp')}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            alignItems: 'center',
          }}
        >
          <Link href="/" passHref>
            <Button sx={{ color: 'white', textTransform: 'none' }}>
              {t('header.nav.home')}
            </Button>
          </Link>
          <Link href="/chat" passHref>
            <Button sx={{ color: 'white', textTransform: 'none' }}>
              {t('header.nav.chat', 'Public Chat')}
            </Button>
          </Link>
          <Link href="/register" passHref>
            <Button sx={{ color: 'white', textTransform: 'none' }}>
              {t('header.nav.register')}
            </Button>
          </Link>
          {!loggedInUser ? (
            <Link href="/login" passHref>
              <Button sx={{ color: 'white', textTransform: 'none' }}>
                {t('header.nav.login')}
              </Button>
            </Link>
          ) : (
            <>
              <Button onClick={handleLogout} sx={{ color: 'white', textTransform: 'none' }}>
                {t('header.nav.logout')}
              </Button>
              <Typography sx={{ color: 'white', fontSize: '0.9rem' }}>
                {t('header.welcome')}, {loggedInUser.username}!
              </Typography>

            </>
          )}
        </Box>
        <Language></Language>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
