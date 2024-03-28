"use client";

import { useGlobalContext } from "@/app/react-query-provider/reactQueryProvider";
import GetCookie from "@/hooks/cookies/getCookie";
import { usePathname } from "next/navigation";
import { FC, useEffect } from "react";
import UnlockRewards from "../unlock-rewards/unlockRewards";

interface FooterProps {
}

const Footer:FC<FooterProps> = () => {
  const router = usePathname();
  const { isLoggedin, setIsLoggedIn } = useGlobalContext();
  useEffect(() => {
    // const userId = GetCookie('userId');
    // if(userId != '') {
    //   setIsLoggedIn(true);
    // }
  }, [])
  return(
  <footer className="footer">
    {/* { isLoggedin && <UnlockRewards /> } */}
    {/* <h3 className="footer__heading">
      3% fees apply for every flip. Refer to <a href="#" className="footer__heading-number">FAQ</a> for more information.
    </h3> */}
      <h3 className="footer__subheading">
        Game powered by Ordinal <a href="https://ordinals.com/inscription/74c221cc1cb7fef53220075d2c14fc9d7ab29d8b11e38db3dd5dd7b95bac515di0" target="_blank" rel="noopener noreferrer">#36822068</a>
        <br />
        <span>All rights reserved to ARCAD3</span>
      </h3>  </footer>
    
  )
}

export default Footer;