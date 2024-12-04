import { useRouter } from "next/router";
import {Box, MenuItem, Select, Typography} from "@mui/material";
import React from "react";

const Language: React.FC = () => {
  const router = useRouter();
  const { locale, pathname, asPath, query } = router;

  const handleLanguageChange = (event: { target: { value: string } }) => {
      const newLocale = event.target.value;
      const { pathname, asPath, query} = router;
      router.push({ pathname, query}, asPath, {locale: newLocale});
  };

  return (
    <Box sx={
        {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2
        }
    }>
      <Typography variant="h6" sx={
        {
          fontSize: '1.5rem',
        }
      }>Language</Typography>
      <Select
        id="language"
        value={locale}
        onChange={handleLanguageChange}
        sx={{ backgroundColor: 'white' }}
      >
        <MenuItem value="en">English</MenuItem>
        <MenuItem value="es">Español</MenuItem>
        <MenuItem value="nl">Nederlands</MenuItem>
      </Select>
    </Box>
  );
};

export default Language;
