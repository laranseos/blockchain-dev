"use client"

import { useGlobalContext } from '@/app/react-query-provider/reactQueryProvider';
import GetCookie from '@/hooks/cookies/getCookie';
import RemoveCookie from '@/hooks/cookies/removeCookie';
import { usePathname, useRouter } from 'next/navigation';
import { FC, useEffect, useState } from "react";
import FAQModal from '../faq-modal/FAQModal';
import MobileMenu from '../mobile-menu/MobileMenu';
import ProfileModal from '../profile-modal/profileModal';
// import UsernameModal from "../username-modal/usernameModal";
import DepositModal from "../deposit-modal/depositModal";
import {
  useBalanceStore,
} from '../../store'
import { playButtonAudio } from '@/sound';

interface NavbarProps {
}

const Navbar:FC<NavbarProps> = () => {
  const pathName = usePathname();
  const router = useRouter();
  const[openNav, setOpneNav] = useState(false);
  const[showFaqModal, setShowFaqModal] = useState(false);
  const[showMobileMenu, setShowMobileMenu] = useState(false);
  const[showProfileModal, setShowProfileModal] = useState(false);
  const[showUsernameModal, setShowUsernameModal] = useState(false);
	const[showDepositModal, setShowDepositModal] = useState(false);
  const[pubKey, setPubkey] = useState('');
  const { isLoggedin, setIsLoggedIn } = useGlobalContext();
  let balance = useBalanceStore(state => state.balance);

  useEffect(() => {
    const key = GetCookie('publicKey');
    setPubkey(`${key.slice(0, 5)}....${key.slice(-8)}`);
  }, [pubKey])

  const handleNavbar = () => {
    setOpneNav(!openNav);
  }

  const handleFaqModal = () => {
    setShowFaqModal(!showFaqModal);
  }

  const handleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  }

  const handleProfileModal = async () => {
    playButtonAudio();
    setShowProfileModal(!showProfileModal);
  }

  const handleUsernameModal = () => {
    setShowUsernameModal(!showUsernameModal);
  }

  const handleDepositModal = () => {
    setShowDepositModal(!showDepositModal);
  }

  const logout = () => {
    playButtonAudio();
		RemoveCookie('userId');
    RemoveCookie('sign');
    RemoveCookie('gameNonce');
    RemoveCookie('commitment');
    RemoveCookie('publicKey');
    RemoveCookie('wallet');
    RemoveCookie('balance');
    RemoveCookie('isLogin');
    setIsLoggedIn(false);
    router.push('/');
	}

  useEffect(() => {
    const isLogin = GetCookie("isLogin");
    setIsLoggedIn(!!isLogin ? true : false);
    // if(!isLogin) {
    //   router.push('/')
    // }
  }, [])

  return(
    <header className="header">
      <div className='header__logo'>
        <button className="flex-shrink-0">
          <img src="/static/img/logo.png" alt="logo" />
        </button>
        {
          isLoggedin && <>
            <div className='header__logo_separator'></div>
            <div className='header__logo_balance'>
              {balance}
            <span className='header__logo_currency'>ΛRC</span>
          </div>
          </>
        }
        
      </div>
      <div className="header__wrap">
        <div className="header__wrap">
            <>
            {isLoggedin && 
              <div>
                <button style={{
                      height: "63.78px"
                }} className="btn-outline btn-deposit" onClick={() => {playButtonAudio();handleDepositModal()}}><img src="/static/svgs/deposit.svg" />Deposit</button>
                {/* <button className="btn-outline ml-10" onClick={() => router.push('/deposit')}>Deposit / Withdraw</button> */}
              </div>
            }
              <div className="header__profile">
                
              {isLoggedin && <button className="btn-outline gift" onClick={() => {playButtonAudio()}}>
                  <img src="/static/svgs/gift.svg" alt="share icon" />
                  <span />
                </button>}
                {isLoggedin && 
                <figure 
                  className="btn-outline"
                  onClick={handleProfileModal}
                >
                  <img
                    className="header__profile-image"
                    src="/static/svgs/profile.svg"
                    alt="profile icon"
                    style={{
                      cursor: 'pointer'
                    }}
                  />
                  {/* <div className="header__profile-notification">
                    <img
                      className="header__profile-notification-image"
                      src="/static/svgs/leahter-circular.png"
                      alt="icon"
                    />
                  </div> */}
                </figure>}
                <button className="btn-outline" onClick={() => {playButtonAudio();handleFaqModal()}}>
                  <img src="/static/svgs/qa.svg" alt="share icon" />
                </button>
                {/* <p className="header__profile-text">{pubKey}</p> */}
                { isLoggedin && 
                <button className="btn-outline" onClick={logout}>
                  <img src="/static/svgs/exit.svg" alt="share icon" />
                </button>}
                <button className="btn-outline menu" onClick={handleMobileMenu}>
                  <img src="/static/svgs/menu.svg" alt="share icon" />
                </button>
              </div>
            </>
        </div>
        {/* <div className={`hamburger ${openNav ? 'open' : ''}`} onClick={handleNavbar}>
          <span></span>
          <span></span>
          <span></span>
        </div> */}
        <nav className="header__nav">
          <ul className={`header__list  ${openNav ? 'open' : ''}`}>
            {/* <li className="header__item" onClick={handleFaqModal}><a id="faq-link" className="header__link">Faq</a></li> */}
            {
              // isLoggedin && (
              // <li className="header__item" onClick={handleProfileModal}>
              //   <a id="profile-link" className="header__link">Profile</a>
              // </li>)
            }
          </ul>
        </nav>
      </div>
      <FAQModal show={showFaqModal} handleModal={handleFaqModal} />
      <MobileMenu 
        show={showMobileMenu} 
        handleModal={handleMobileMenu} 
        isLoggedin={isLoggedin}
        handleFaqModal={handleFaqModal}
        playButtonAudio={playButtonAudio}
        handleDepositModal={handleDepositModal}
        handleProfileModal={handleProfileModal}
        logout={logout}
      />
      { isLoggedin && <ProfileModal show={showProfileModal} handleModal={handleProfileModal} /> }
      {/* <UsernameModal show={showUsernameModal} handleModal={handleUsernameModal}/> */}
		  <DepositModal show={showDepositModal} handleModal={handleDepositModal}/>
    </header>
  )
}

export default Navbar;