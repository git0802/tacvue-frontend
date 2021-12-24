import React, { useEffect } from "react";
import Head from "next/head";
import type { AppProps } from "next/app";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "@styles/global.css";

declare global {
  interface Window {
    ethereum: any;
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    window.ethereum.on("accountsChanged", function (accounts: Array<any>) {
      console.log(accounts);
      window.location.reload();
    });
  }, []);

  return (
    <>
      <Head>
        <title>Tacvue - MultiVerse Portal</title>
        <link rel="icon" type="image/png" href="/images/Logo.png" />
        <link
          href="https://fonts.googleapis.com/css?family=Rubik:300,400,500,700"
          rel="stylesheet"
        ></link>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css"
        ></link>
        <script src="https://accounts.google.com/gsi/client" async defer></script>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
