import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppBar, Toolbar, Button, Box, Typography } from '@mui/material';
import { useTranslation } from "next-i18next";
import { User } from '@/types';
import Language from './language/language';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      setLoggedInUser(JSON.parse(storedUser));
    }
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
        My app
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'white', 
            fontWeight: 'bold', 
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
