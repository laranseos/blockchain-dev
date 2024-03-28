import React, { useEffect} from 'react'
import 'tailwindcss/tailwind.css'
import { useRouter } from 'next/router'
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { useMemo } from "react";
import Loader from '../components/Loader'
import {
  PhantomWalletAdapter,
  BackpackWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";




function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const [loading, setLoading] = React.useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 3000); // Set the duration for the loading page in milliseconds (e.g., 3000ms = 3 seconds)

    return () => clearTimeout(timeout); // Clear the timeout when the component is unmounted

  }, []);


  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new BackpackWalletAdapter(),
    ],
    []
  );
  const endpoint = useMemo(() => clusterApiUrl("mainnet-beta"), []);
  return (
    <>
    {loading ? <Loader /> : null}
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <Component {...pageProps} />   
        </WalletProvider>
      </ConnectionProvider>
    </>
  )
}

export default MyApp
