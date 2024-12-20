import Link from 'next/link';
import { AppBar, Toolbar, Button, Box, Typography } from '@mui/material';
import { useTranslation } from "next-i18next";
import { User } from '@/types';
import Language from './language/language';
import {getUser} from "@services/api";
import useSWR, {mutate} from "swr";
import { useRouter } from 'next/router';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const fetcher = async () => {
    // Fetch the user from the local storage
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!storedUser) {
      return; // No user logged in
    }

    try {
      // Check if the user is valid
      const user: User = await getUser(storedUser.username, storedUser.token);
      if (user) {
        // Logged in user is valid, update it
        return user;
      } else {
        // User not found, this shouldn't happen
        throw new Error("User not found");
      }
    } catch (error) {
      // Logged-in user is not/no longer valid
      localStorage.removeItem("loggedInUser");
      return null;
    }
  };

  const { data: loggedInUser, error, isLoading } = useSWR('user', fetcher);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    mutate('user', null);
    if (router.pathname !== '/') {
      router.push('/');
    } else {
      router.reload();
    }
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
