import "@styles/globals.css";
import { appWithTranslation } from "next-i18next";
import type { AppProps } from "next/app";
import { Component } from "react";

const App = ({Component, pageProps}: AppProps) =>{
    return <Component {...pageProps}/>
};

export default appWithTranslation(App);
