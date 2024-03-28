import { useState, useEffect, useRef } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import localFont from "@next/font/local";

const poppins = localFont({
  src: [
    {
      path: "../public/Geometria.ttf",
      weight: "400",
    },
  ],
  variable: "--font-poppins",
});
export default function Home() {
  const [showModal1, setShowModal1] = useState(false);
  const videoRef = useRef(null);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const { select, wallets, publicKey, disconnect } = useWallet();
  const [xsHidden, setXsHidden] = useState<string>("hidden");
  const [connectStatus, setConnectStatus] = useState("Connect wallet");
  const [videoHidden, setVideoHidden] = useState<string>("hidden");
  const [spinHidden, setSpinHidden] = useState<string>("show");
  const [winStatus, setWinStatus] = useState<string>("");
  const [playStatus, setPlayStatus] = useState<boolean>(false);
  const [firstModal, setFirstModal] = useState<string>("");
  const [tabsShow, setTabsShow] = useState<string>("hidden");
  const [walletColor, setWalletColor] = useState<string>(
    "text-white bg-black/50 backdrop-blur-[4px] border-[#D679BC] border-solid border-2"
  );
  const [WalletPhantomButtonContext, setWalletPhantomButtonContext] =
    useState<string>("text-white");
  const [walletPhantomButtonBackground, setWalletPhantomButtonBackground] =
    useState<string>("");
  const [walletBackpackButtonContext, setWalletBackpackButtonContext] =
    useState<string>("text-white");
  const [walletBackpackButtonBackground, setWalletBackpackButtonBackground] =
    useState<string>("");
  const [backpackIcon, setBackpackIcon] = useState<string>("/Backpack.svg");
  const [walletName, setWalletName] = useState<string>("");
  const [connectButtonIcon, setConnectButtonIcon] =
    useState<string>("w-[25px]");
  const [connectWalletIcon, setConnectWalletIcon] =
    useState<string>("/PhantomIcon.svg");
  const [connectWalletName, setConnectWalletName] = useState<string>("");
  const [dropIcon, setDropIcon] = useState<string>("hidden");
  const [navBarIconShow, setNavBarIconShow] = useState<string>("");
  const [navWalletIcon, setNavWalletIcon] = useState<string>("");
  const [remainTimes, setRemainTimes] = useState<number>(0);
  const [showCongratulationModal, setShowCongratulationModal] =
    useState<boolean>(false);
  const [winValue, setWinValue] = useState<number>(1);
  const [winPossible, setWinPossible] = useState<string>("possible");
  const [connectStatusText, setConnectStatusText] = useState<string>("");
  const [playAvail, setPlayAvail] = useState<string>(
    "Your wallet does not exist in white list"
  );
  const [desktopConnectButtonIcon, setDesktopConnectButtonIcon] =
    useState<string>("");
  const [showAddWallet, setShowAddWallet] = useState<boolean>(false);
  const [nickName, setNickName] = useState<string>("");
  const [requestNickName, setRequestNickName] = useState<string>("");
  const [successRequestModal, setSuccessRequestModal] =
    useState<boolean>(false);
  const [createdAt, setCreatedAt] = useState<Date>();
  const [axiosRmainTime, setAixosRemainTime] = useState<number>(0);
  const [counter, setCounter] = useState<number>(0)

  function getRandom() {
    var num = Math.random();
    if (num < 0.1) return 1; //probability 0.1
    else if (num < 0.4) return 2; // probability 0.3
    else return 3; //probability 0.6
  }
  function handleChangeNickName(event) {
    setNickName(event.target.value);
  }
  function handleChangeRequestNickName(event) {
    setRequestNickName(event.target.value);
  }
  function getRandom1() {
    var num = Math.random();
    if (num < 0.4) return 2; // probability 0.3
    else return 3; //probability 0.6
  }
  const remainTime = (remainSecond) => {
    const remainTime = Math.floor(remainSecond / 3600);
    const remainMinutes = Math.floor((remainSecond - remainTime * 3600) / 60);
    const string =
      "0 🎟️ come back in " +
      remainTime +
      " hours " +
      remainMinutes +
      " minutes";
    return string;
  };
  // const fetchData = async () => {

  //   try {
  //     const response = await axios.post('https://climb-server.onrender.com/api/spots/remainTimes', {
  //       data: {
  //         walletAddress: publicKey.toBase58()
  //       },
  //     })
  //     setRemainTimes(4-response.data.remainTimes)
  //     setWinPossible(response.data.winPossible)
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  const fetchData = async () => {
    try {
      const response = await axios.post(
        "https://mariusjourney-server.onrender.com/api/spots/remainTimes",
        {
          data: {
            walletAddress: publicKey.toBase58(),
          },
        }
      );
      if (response.data.remainTimes > 0) {
        setAixosRemainTime(response.data.remainTimes);
        setRemainTimes(response.data.remainTimes);
        setWinPossible(response.data.winPossible);
        setCreatedAt(response.data.createdAt);
      } else if (response.data.remainTimes === 0) {
        const remainHours = dif(response.data.createdAt);
        if (remainHours >= 14400) {
          setRemainTimes(4);
          setAixosRemainTime(response.data.remainTimes);
          setWinPossible(response.data.winPossible);
          setCreatedAt(response.data.createdAt);
        } else if (remainHours < 14400) {
          setRemainTimes(0);
          setAixosRemainTime(response.data.remainTimes);
          setWinPossible(response.data.winPossible);
          setCreatedAt(response.data.createdAt);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  const playAvailable = async () => {
    try {
      const response = await axios.post(
        "https://mariusjourney-server.onrender.com/api/wallet/getAvailable",
        {
          data: {
            walletAddress: publicKey.toBase58(),
          },
        }
      );
      setPlayAvail(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // const fetchData1 = async () => {
  //   try {
  //     const response = await axios.post('https://climb-server.onrender.com/api/spots/remainTimes', {
  //       data: {
  //         walletAddress: publicKey.toBase58()
  //       },
  //     })
  //     setWinPossible(response.data.winPossible)
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const handleConnectWallet = (name) => {
    if (name === "Phantom") {
      setWalletPhantomButtonBackground("bg-white");
      setWalletPhantomButtonContext("text-[#D679BC]");
      setWalletBackpackButtonBackground("");
      setWalletBackpackButtonContext("text-white");
      setBackpackIcon("/Backpack.svg");
      setWalletName("Phantom");
    } else if (name === "Backpack") {
      setWalletBackpackButtonBackground("bg-white");
      setWalletBackpackButtonContext("text-[#D679BC]");
      setWalletPhantomButtonBackground("");
      setWalletPhantomButtonContext("text-white");
      setBackpackIcon("/backpackchange.svg");
      setWalletName("Backpack");
    }
    const wallet = wallets.filter((item) => item.adapter.name === name);
    if (
      wallet[0].readyState === "NotDetected" &&
      wallet[0].adapter.name === "Backpack"
    )
      location.href =
        "https://chrome.google.com/webstore/detail/backpack/aflkmfhebedbjioipglgcbcmnbpgliof";
    else if (
      wallet[0].readyState === "NotDetected" &&
      wallet[0].adapter.name === "Phantom"
    )
      location.href =
        "https://chrome.google.com/webstore/detail/phantom/bfnaelmomeimhlpmgjnjophhpkkoljpa";
    else
      select(wallet[0].adapter.name),
        setConnectWalletName(wallet[0].adapter.name),
        setShowModal1(false),
        localStorage.setItem("walletName", wallet[0].adapter.name);
  };
  const handleOpenChallenge = async () => {
    if (!publicKey) {
      toast("Please connect wallet", {
        hideProgressBar: false,
        autoClose: 2000,
        type: "error",
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } else if (publicKey) {
      if (playAvail === "Your wallet does not exist in white list") {
        setShowAddWallet(true);
      }

      // const response = await axios.post('https://climb-server.onrender.com/api/spots/remainTimes', {
      //   data: {
      //     walletAddress: publicKey.toBase58()
      //   },
      // })
      else {
        setXsHidden("hidden");
        setShowChallengeModal(true);
        setNavBarIconShow("");
        setWinStatus("");
      }
    }
  };
  // const endSpotRotate = async() => {
  //   setPlayStatus(false)
  //   setVideoHidden("hidden")
  //   setSpinHidden("")
  //   if (winValue === 1){
  //     setShowCongratulationModal(true)
  //     setShowChallengeModal(false)
  //   }
  //   else if (winValue === 3){
  //     setShowLooseModal(true)
  //     setShowChallengeModal(false)
  //   }
  //   const response = await axios.post('https://climb-server.onrender.com/api/spots', {
  //     data: {
  //       walletAddress: publicKey.toBase58(),
  //       winStatus: winValue
  //     },
  //   })
  const endSpotRotate = async () => {
    setPlayStatus(false);
    setVideoHidden("hidden");
    setSpinHidden("");
    if (winValue === 1) {
      setShowCongratulationModal(true);
      setShowChallengeModal(false);
    } else {
      const response = await axios.post(
        "https://mariusjourney-server.onrender.com/api/spots",
        {
          data: {
            walletAddress: publicKey.toBase58(),
            winStatus: winValue,
            remainTimes: remainTimes,
          },
        }
      );
    }
  };

  const sendWin = async () => {
    if (nickName === "") {
      toast("Please input nickname", {
        hideProgressBar: false,
        autoClose: 2000,
        type: "error",
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } else {
      setShowCongratulationModal(false);
      setSuccessRequestModal(true);
      const response = await axios.post(
        "https://mariusjourney-server.onrender.com/api/spots",
        {
          data: {
            walletAddress: publicKey.toBase58(),
            winStatus: 1,
            nickName: nickName,
            remainTimes: remainTimes,
          },
        }
      );
    }
  };
  const sendRequest = async () => {
    if (requestNickName === "") {
      toast("Please input nickname", {
        hideProgressBar: false,
        autoClose: 2000,
        type: "error",
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } else {
      setShowAddWallet(false);
      setSuccessRequestModal(true);
      const response = await axios.post(
        "https://mariusjourney-server.onrender.com/api/wallet/request",
        {
          data: {
            walletAddress: publicKey.toBase58(),
            nickName: requestNickName,
          },
        }
      );
    }
  };
  function dif(create) {
    let date1 = new Date(create).valueOf();
    let date2 = new Date().valueOf();
    var dif = Math.round(date2 - date1) / 1000;
    return dif;
  }

  const videoHandler = async () => {
    if (playStatus === false) {
      if (!publicKey) {
        toast("Please connect wallet", {
          hideProgressBar: false,
          autoClose: 2000,
          type: "error",
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      } else if (publicKey) {
        if (remainTimes > 0 && winPossible === "possible") {
          setRemainTimes(remainTimes - 1);
          setVideoHidden("");
          setSpinHidden("hidden");
          const videoNum = getRandom();
          setWinValue(videoNum);
          setWinStatus("/spot/" + videoNum + ".webm");
          await videoRef.current.play();
        } else if (remainTimes > 0 && winPossible === "impossible") {
          setRemainTimes(remainTimes - 1);
          setVideoHidden("");
          setSpinHidden("hidden");
          const videoNum = getRandom1();
          setWinValue(videoNum);
          setWinStatus("/spot/" + videoNum + ".webm");
          await videoRef.current.play();
        } else if (remainTimes <= 0) {
          if (axiosRmainTime !== 0) {
            setRemainTimes(0);
            if (counter === 0) {
              setCreatedAt(new Date());
              const remainHours = dif(createdAt);
              toast("0 🎟️ come back in 4 hours", {
                hideProgressBar: false,
                autoClose: 2000,
                type: "error",
                position: toast.POSITION.BOTTOM_RIGHT,
              });
              setCounter(counter + 1)
            }
            else if (counter > 0) {
              const remainHours = dif(createdAt);
              toast(remainTime(14400 - remainHours), {
                hideProgressBar: false,
                autoClose: 2000,
                type: "error",
                position: toast.POSITION.BOTTOM_RIGHT,
              });
            }
          } else if (axiosRmainTime === 0) {
            setRemainTimes(0);
            const remainHours = dif(createdAt);
            if (remainHours < 14400) {
              setVideoHidden("hidden");
              setSpinHidden("");
              toast(remainTime(14400 - remainHours), {
                hideProgressBar: false,
                autoClose: 2000,
                type: "error",
                position: toast.POSITION.BOTTOM_RIGHT,
              });
            } else if (remainHours >= 14400) {
              setRemainTimes(4);
              if (winPossible === "possible") {
                setRemainTimes(remainTimes - 1);
                setVideoHidden("");
                setSpinHidden("hidden");
                const videoNum = getRandom();
                setWinValue(videoNum);
                setWinStatus("/spot/" + videoNum + ".webm");
                await videoRef.current.play();
              }
            }
          }
        }
        // if (remainTimes < 0) {
        //   setRemainTimes(0);
        //   const remainHours = dif(createdAt)
        //   if(remainHours < 14400){
        //     setVideoHidden("hidden");
        //     setSpinHidden("");
        //     toast(remainTime(14400-remainHours), {
        //       hideProgressBar: false,
        //       autoClose: 2000,
        //       type: "error",
        //       position: toast.POSITION.BOTTOM_RIGHT,
        //     });
        //   } else if (remainHours >= 14400){
        //     setRemainTimes(4);
        //     if (winPossible === "possible") {
        //       setRemainTimes(remainTimes - 1);
        //       setVideoHidden("");
        //       setSpinHidden("hidden");
        //       const videoNum = getRandom();
        //       setWinValue(videoNum);
        //       setWinStatus("/spot/" + videoNum + ".webm");
        //       await videoRef.current.play();
        //     }
        //     else if (winPossible === "impossible") {
        //       setRemainTimes(remainTimes - 1);
        //       setVideoHidden("");
        //       setSpinHidden("hidden");
        //       const videoNum = getRandom1();
        //       setWinValue(videoNum);
        //       setWinStatus("/spot/" + videoNum + ".webm");
        //       await videoRef.current.play();
        //     }
        //   }
        // } else {
        //   if (winPossible === "possible") {
        //     setRemainTimes(remainTimes - 1);
        //     setVideoHidden("");
        //     setSpinHidden("hidden");
        //     const videoNum = getRandom();
        //     setWinValue(videoNum);
        //     setWinStatus("/spot/" + videoNum + ".webm");
        //     await videoRef.current.play();
        //   }
        //   else if (winPossible === "impossible") {
        //     setRemainTimes(remainTimes - 1);
        //     setVideoHidden("");
        //     setSpinHidden("hidden");
        //     const videoNum = getRandom1();
        //     setWinValue(videoNum);
        //     setWinStatus("/spot/" + videoNum + ".webm");
        //     await videoRef.current.play();
        //   }
        // }
      }
    }
  };

  useEffect(() => {
    setConnectWalletName(localStorage.getItem("walletName"));
    if (!publicKey) {
      setConnectStatus("Connect wallet");
      setConnectButtonIcon("w-[30px]");
      setDesktopConnectButtonIcon("hidden");
      setDropIcon("hidden");
      setWalletColor(
        "text-white bg-black/50 backdrop-blur-[4px] border-[#D679BC] border-solid border-2"
      );
      setConnectStatusText("text-[#D679BC]");
      setNavWalletIcon("/drop.svg");
    } else if (publicKey) {
      const connectPublic =
        publicKey.toBase58().substring(0, 4) +
        ".." +
        publicKey.toBase58().substring(39, 43);
      setConnectStatus(connectPublic);
      // handleConnectWallet()
      setWalletColor("bg-white text-black");
      setConnectStatusText("text-white");
      if (
        connectWalletName === "Phantom" ||
        connectWalletName === '"Phantom"'
      ) {
        setConnectButtonIcon("w-[25px]");
        setDesktopConnectButtonIcon("w-[25px]");
        setDropIcon("");
        setConnectWalletIcon("/PhantomIcon.svg");
        setNavWalletIcon("/phantomNav.svg");
      } else if (
        connectWalletName === "Backpack" ||
        connectWalletName === '"Backpack"'
      ) {
        setConnectButtonIcon("w-[17px]");
        setDesktopConnectButtonIcon("w-[17px]");
        setConnectWalletIcon("/backpackchange.svg");
        setNavWalletIcon("/Backpack.svg");
        setDropIcon("");
      }

      fetchData();
      playAvailable();
    }
  }, [publicKey]);

  return (
    <div
      className={`absolute h-full w-full md:overflow-hidden ${poppins.variable} font-sans`}
    >
      <iframe className="z-0 h-full w-full absolute" src="1.html"></iframe>
      <div
        className={`flex fixed items-center justify-center md:overflow-hidden overflow-scroll w-full h-full bg-black/50 backdrop-blur-[4px] ${firstModal} z-10 `}
      >
        <div className="absolute md:overflow-hidden overflow-scroll md:w-[600px] md:h-[350px] w-full h-full  md:rounded-tr-[25px] md:rounded-bl-[25px] bg-black/50 backdrop-blur-[4px] z-1">
          <button
            className="absolute top-[40px] right-[40px] z-50"
            onClick={() => {
              setFirstModal("hidden"), setTabsShow("flex");
            }}
          >
            <img src="/close.svg"></img>
          </button>
          <div className="flex fixed  px-10 md:top-0 top-[73px] md:w-[600px] md:h-[350px] md:items-center md:justify-center">
            <div className="flow-root">
              <div className="flex md:justify-center md:items-center">
                <img
                  className="md:w-[140px] w-[160px] md:h-[60px] h-[80px] md:mb-[22px] mb-[40px]"
                  src="/mLogo.svg"
                ></img>
              </div>
              <div
                className={`md:text-center  mb-[26px] text-white ${poppins.variable} font-sans font-semibold md:text-[16px] text-[25px]`}
              >
                Experience an exciting journey by immersing yourself in a unique
                interactive adventure within the city of Marius.
              </div>
              <div
                className={`md:text-center  md:mb-[26px] mb-[27px] text-white ${poppins.variable} font-sans font-semibold md:text-[16px] text-[25px]`}
              >
                You can count on Marius to take good care of you and create a
                truly enjoyable adventure.
              </div>
              <div className="flex justify-center items-center">
                <button
                  className={` border border-[#D679BC]  md:w-[250.68px] md:h-[45.04px] w-2/3 h-[60px] rounded-[7px] ${poppins.variable} md:text-[24px] text-[24px] font-sans font-semibold text-white`}
                  onClick={() => {
                    setFirstModal("hidden"), setTabsShow("flex");
                  }}
                >
                  Marius City
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`absolute hidden md:${tabsShow} h-[50px] z-1 top-[68px] right-16`}
      >
        <div className="grid grid-cols-3 items-center justify-center h-50 z-1 w-[350px] h-[50px] bg-black/50 rounded-[12px]  backdrop-blur-[4px] ">
          <div
            className={`flex w-full h-full rounded-l-[12px] text-[16px] text-white ${poppins.variable} font-sans`}
          >
            <button className="m-auto" onClick={() => handleOpenChallenge()}>
              Challenges
            </button>
          </div>
          <div className={`flex w-full h-full items-center justify-center`}>
            <div className="flex items-center">
              <div className="inline-flex mt-[0px]  left-0">
                <img className="w-[11px] h-[14.3px]" src="/key.svg" />
              </div>
              <button
                className={`text-[16px] ml-[5px] ${poppins.variable} text-white font-sans`}
              >
                Studio
              </button>
            </div>
          </div>
          <div className={`flex w-full h-full items-center justify-center`}>
            <div className="flex items-center">
              <div className="inline-flex mt-[0px] left-0">
                <img className="w-[11px] h-[14.3px]" src="/key.svg" />
              </div>
              <button
                className={`text-[16px] ml-[5px] ${poppins.variable} text-white font-sans`}
              >
                Cinema
              </button>
            </div>
          </div>
        </div>
        <a
          href="https://twitter.com/mariuslabs"
          target="_blank"
          className="h-25 z-1 bg-black/50 rounded-[12px] p-2 px-3 backdrop-blur-[4px] inline-flex ml-5"
        >
          <img src="/twitter.svg" className="h-6 w-6 m-auto" />
        </a>
        <a
          href="http://discord.gg/mariuslabs"
          target="_blank"
          className="h-25 z-1 bg-black/50 rounded-[12px]  backdrop-blur-[4px] inline-flex ml-5"
        >
          <img src="/discord.svg" className="h-12 w-12" />
        </a>
        <button
          className={`inline-flex w-[190px] justify-center hover:bg-[#D679BC] items-center rounded-[12px] font-bold py-3 ${walletColor} ml-[25px]`}
          type="button"
          onClick={() => {
            if (connectStatus === "Connect wallet") setShowModal1(true);
            else if (connectStatus !== "Connect wallet") disconnect();
          }}
        >
          <img
            className={`ml-4 mr-[3px] ${desktopConnectButtonIcon}`}
            src={connectWalletIcon}
          ></img>
          <div
            className={`w-[200px] whitespace-nowrap ${poppins.variable} font-sans`}
          >
            {connectStatus}
          </div>
          <img
            className={`my-auto w-[30px] mr-[10px] ${dropIcon}`}
            src="/drop.svg"
          ></img>
        </button>
      </div>
      {/* response */}
      <button
        data-collapse-toggle="navbar-sticky"
        type="button"
        className={`absolute top-12 ${navBarIconShow} right-8 inline-flex items-center p-2 z-3 text-sm text-gray-500 rounded-lg md:hidden focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600`}
        aria-controls="navbar-sticky"
        aria-expanded="false"
        onClick={() => {
          if (xsHidden === "hidden") {
            setXsHidden(""), setNavBarIconShow("hidden");
          } else {
            setXsHidden("hidden"), setNavBarIconShow("");
          }
        }}
      >
        <span className="sr-only">Open main menu</span>
        <img className="w-[23px]" src="/navBarIcon.svg"></img>
      </button>
      <div
        className={`w-screen h-screen z-1 md:flex md:w-screen  ${xsHidden}`}
        id="navbar-sticky"
      >
        <ul className="flex flex-col p-4 md:p-0 font-semibold md:flex-row md:hidden md:space-x-14 h-screen border-black rounded-lg w-full m-auto bg-black/80 backdrop-blur-[2px] md:mt-0">
          <button
            data-collapse-toggle="navbar-sticky"
            type="button"
            className="absolute top-12 right-8 inline-flex items-center p-2 z-2 text-sm text-gray-500 rounded-lg md:hidden  focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-sticky"
            aria-expanded="false"
            onClick={() => {
              {
                setXsHidden("hidden"), setNavBarIconShow("");
              }
            }}
          >
            <span className="sr-only">Open main menu</span>
            <img className="w-[23px]" src="/navBarClose.svg"></img>
          </button>
          <li className="md:hidden mt-[147px] mx-[15px]">
            <div
              className={`inline-flex ${connectStatusText} relative items-center  w-full font-sans font-bold text-[28px] border-b border-spacing-3  py-4  border-solid border-gray-500`}
            >
              <button
                onClick={() => {
                  if (connectStatus === "Connect wallet") setShowModal1(true);
                  else if (connectStatus !== "Connect wallet") {
                    disconnect();
                  }
                }}
              >
                {connectStatus}
              </button>
              <img
                className={`absolute right-0 mt-4 ${connectButtonIcon}`}
                src={navWalletIcon}
              ></img>
            </div>
          </li>
          <li className="md:hidden mx-[15px]">
            <div className="inline-flex relative items-center w-full text-white font-sans font-bold text-[28px] border-b border-spacing-3  py-4  border-solid border-gray-500">
              <button
                onClick={() => {
                  handleOpenChallenge();
                }}
              >
                Challenges
              </button>
            </div>
          </li>
          <li className="md:hidden mx-[15px]">
            <div className="inline-flex relative items-center w-full text-white font-sans font-bold text-[28px] border-b border-spacing-3  py-4  border-solid border-gray-500">
              <button
                onClick={() => {
                  setXsHidden("hidden"), setNavBarIconShow("");
                }}
              >
                Studio
              </button>
              <img className={`absolute right-0 w-4`} src="/key.svg"></img>
            </div>
          </li>
          <li className="md:hidden mx-[15px]">
            <div className="inline-flex relative items-center w-full text-white font-sans font-bold text-[28px] border-b border-spacing-3  py-4  border-solid border-gray-500">
              <button
                onClick={() => {
                  setXsHidden("hidden"), setNavBarIconShow("");
                }}
              >
                Cinema
              </button>
              <img className={`absolute right-0 w-4`} src="/key.svg"></img>
            </div>
          </li>
          <li className="md:hidden mx-[15px]">
            <div className="inline-flex relative items-center w-full text-white font-sans font-bold text-[28px] border-b border-spacing-3  py-4  border-solid border-gray-500">
              <a href="http://discord.gg/mariuslabs" target="_blank">
                Discord
              </a>
              <img
                className={`absolute right-0 w-6 ml-2`}
                src="/navDiscord.svg"
              ></img>
              {/* <img src ='/Discord.png' className=' absolute object-scale-down px-3  right-4'/> */}
            </div>
          </li>
          <li className="md:hidden mx-[15px]">
            <div className="inline-flex relative items-center w-full text-white font-sans font-bold text-[28px] border-b border-spacing-3  py-4  border-solid border-gray-500">
              <a href="http://twitter.com/mariuslabsy" target="_blank">
                Twitter
              </a>
              <img
                className={`absolute right-0 w-6 ml-2`}
                src="/navTwitter.svg"
              ></img>
            </div>
          </li>
        </ul>
      </div>
      <ToastContainer
        toastStyle={{ backgroundColor: "#dc5148", color: "white" }}
      />
      {/* challenge */}
      {showChallengeModal ? (
        <>
          <div className="w-full h-full">
            <div className="md:w-screen md:h-screen md:overflow-hidden overflow-scroll w-screen md:top-0 top-[150px] bg-black/80 backdrop-blur-[9px] border border-gray md:border-none md:rounded-none rounded-t-[30px] fixed inset-0 z-3 outline-none focus:outline-none pb-20">
              <div className="text-white md:hidden mt-[20px] text-center font-sans font-bold text-[30px] mb-[0px] md:mb-[40px]">
                {remainTimes} 🎟️
              </div>
              <button
                className="md:mt-[63px] md:ml-[198px] md:top-0 top-[-100px] bg-black/80 backdrop-blur-[4px] border border-[#D679BC] left-4 absolute  h-12 rounded-[12px]"
                onClick={() => {
                  setShowChallengeModal(false),
                    setXsHidden("hidden"),
                    setNavBarIconShow("");
                }}
              >
                <div className="m-auto px-10 inline-flex text-white">
                  <div className="my-auto h-1/2 inline-flex mr-2">
                    <img src="/line.svg" />
                  </div>
                  Back
                </div>
              </button>
              <div className="w-screen md:h-screen h-auto flex justify-center m-auto">
                <div className="inline-flex my-auto  h-full">
                  <div
                    className={`md:m-auto mt-4 md:w-[600px] w-[400px] ${spinHidden}`}
                  >
                    <img src="/2.png" />
                  </div>
                  <div
                    className={`md:w-[590px] md:m-auto mt-4 w-[390px] ${videoHidden}`}
                  >
                    <video
                      ref={videoRef}
                      autoPlay
                      src={winStatus}
                      onPlay={() => setPlayStatus(true)}
                      onEnded={() => endSpotRotate()}
                    ></video>
                  </div>
                  <div className="md:flex flex-col items-center hidden justify-center w-[330px] h-[350px] my-auto rounded-[20px] bg-black/10 backdrop-blur-[5px]">
                    <div className="inline-flex items-center text-white text-center font-sans font-bold text-[30px] mb-[40px]">
                      {remainTimes}
                      <div className="text-[30px] ml-4">🎟️</div>
                    </div>
                    <button
                      className="flex items-center justify-center bg-white h-[50px] w-[200px] rounded-[6px] mb-[12px] font-bold font-sans text-[25px]"
                      onClick={() => {
                        videoHandler();
                      }}
                    >
                      Spin
                    </button>
                    <button className="flex items-center z-10 border-solid w-[200px] mb-[20px] h-12 bg-[#929292]/40 backdrop-blur-[4px] rounded-full text-[#BABABA] text-xl">
                      <img src="/lockModal.svg" className="ml-[12px]"></img>
                      <img src="/film.svg" className="ml-[20px] mt-[3px]"></img>
                      <div className="text-[25px] font-bold ml-[3px]">Dice</div>
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex flex-col md:hidden items-center justify-center w-full">
                <button
                  className="flex md:hidden items-center justify-center bg-white h-[50px] w-[200px] rounded-[6px] font-bold font-sans mb-6 text-[25px]"
                  onClick={() => {
                    videoHandler();
                  }}
                >
                  Spin
                </button>
                <button className="flex items-center border-solid w-[200px] mb-[20px] h-12 bg-[#929292]/40 backdrop-blur-[4px] rounded-full text-[#BABABA] text-xl">
                  <img src="/lockModal.svg" className="ml-[12px]"></img>
                  <img src="/film.svg" className="ml-[20px] mt-[3px]"></img>
                  <div className="text-[25px] font-bold ml-[3px]">Dice</div>
                </button>
              </div>
            </div>
          </div>
        </>
      ) : null}
      {showModal1 ? (
        <>
          <div className="absolute flex justify-center items-center z-3 w-screen h-screen inset-0 bg-black/50 rounded-[12px]  backdrop-blur-[4px]">
            <div className="flex justify-center items-center w-5/6 h-[300px] md:w-[480px] md:h-[340px] bg-black/30 rounded-[12px]  backdrop-blur-[4px]">
              <button
                className="absolute top-[20px] right-[25px] md:top-[40px] md:right-[35px] w-[15px] z-[2]"
                onClick={() => setShowModal1(false)}
              >
                <img src="/close1.svg"></img>
              </button>
              <div className="flow-root">
                <div className="text-[26px] text-center font-bold text-white mb-4 md:mb-10">
                  Select your wallet
                </div>
                <button
                  className={`flex items-center border-2 md:w-[300px] w-[250px] mx-auto ${walletPhantomButtonBackground} h-[60px] rounded-[12px] mb-4`}
                  onClick={() => handleConnectWallet("Phantom")}
                >
                  <img className="w-[36px] ml-8" src="/PhantomIcon.svg"></img>
                  <div
                    className={`ml-4 ${WalletPhantomButtonContext} font-bold text-[22px]`}
                  >
                    Phantom
                  </div>
                </button>
                <button
                  className={`flex items-center ${walletBackpackButtonBackground} border-2 md:w-[300px] w-[250px] mx-auto h-[60px] rounded-[12px] mb-2 md:mb-6`}
                  onClick={() => handleConnectWallet("Backpack")}
                >
                  <img
                    className={`w-[24px] ml-[38px]`}
                    src={backpackIcon}
                  ></img>
                  <div
                    className={`ml-[23px] font-bold text-[22px] ${walletBackpackButtonContext}`}
                  >
                    Backpack
                  </div>
                </button>
              </div>
            </div>
          </div>
        </>
      ) : null}
      {showCongratulationModal ? (
        <>
          <div className="absolute flex justify-center items-center z-3 w-screen h-screen inset-0 bg-black/50   backdrop-blur-[4px]">
            <div className="flex justify-center items-center w-full h-full md:w-[580px] md:h-[415px] bg-black/30 rounded-[20px]  backdrop-blur-[30px]">
              <button
                className="absolute top-[40px] right-[35px] w-[15px] z-[2]"
                onClick={() => {
                  setShowCongratulationModal(false), handleOpenChallenge();
                }}
              >
                <img src="/close1.svg"></img>
              </button>
              <div className="flow-root items-center">
                <div className="text-[35px] text-center font-bold text-[#FF9E2C] mb-[2px]">
                  Congratulations!
                </div>
                <div className="text-[25px] text-center text-white mb-[20px]">
                  you are now part of the <br /> adventure
                </div>
                <div className="flex justify-center items-center w-full mb-[20px]">
                  <div className="w-full border-b-2"></div>
                </div>
                <div className="flex justify-center items-center w-full">
                  <div className="w-[250px] border inline-flex items-center border-white/25 rounded-lg">
                    <img
                      src="/navDiscord1.svg"
                      className="w-[25px] my-4 ml-4"
                    ></img>
                    <input
                      placeholder="Your discord nickname"
                      onChange={handleChangeNickName}
                      className=" bg-white/0 ml-4 border-white/5 outline-none text-[15px] h-full text-white"
                    ></input>
                  </div>
                </div>
                <div className="flex justify-center items-center w-full mt-[20px]">
                  <button
                    className="w-[250px] bg-[#D679BC] text-[20px] font-bold text-white py-3 rounded-lg"
                    onClick={sendWin}
                  >
                    Enter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
      {showAddWallet ? (
        <>
          <div className="absolute overflow-hidden flex justify-center items-center z-3 w-screen h-screen inset-0 bg-black/50   backdrop-blur-[4px]">
            <div className="flex justify-center items-center w-screen h-[590px] md:w-[550px] md:h-[590px] bg-black/30 rounded-[20px]  backdrop-blur-[30px]">
              <button
                className="absolute top-[40px] right-[35px] w-[15px] z-[2]"
                onClick={() => {
                  setShowAddWallet(false);
                }}
              >
                <img src="/close1.svg"></img>
              </button>
              <div className="flow-root items-center">
                <div className="md:text-[30px] text-[26px] text-center font-bold text-white mb-[14px]">
                  Your wallet <br /> is not part of the adventure
                </div>
                <div className="flex items-center justify-center w-full mb-4">
                  <button className="inline-flex items-center w-[300px] rounded-[8px] bg-white py-[8px] ">
                    <div className="bg-[#5662F6] rounded-[8px] px-[10px] py-[12px] ml-[10px]">
                      <img src="/navDiscord.svg" className="w-[30px]"></img>
                    </div>
                    <div className="text-[23px] ml-4 font-bold text-[#D679BC]">
                      Daily quests
                    </div>
                  </button>
                </div>
                <div className="flex items-center justify-center w-full">
                  <button className="inline-flex items-center w-[300px] rounded-[8px] border border-white py-[8px] ">
                    <div className="bg-white rounded-[8px] px-[8px] py-[8px] ml-[10px]">
                      <img src="/presents.svg" className="w-[34px]"></img>
                    </div>
                    <div className="text-[23px] ml-4 font-bold text-white">
                      Regular giveaway
                    </div>
                  </button>
                </div>
                <div className="flex justify-center items-center w-[580px] mt-[30px] mb-[30px]">
                  <div className="md:w-[450px] w-[350px] border-b-2"></div>
                </div>
                <div className="flex justify-center items-center w-[580px]">
                  <div className="w-[250px] border inline-flex items-center border-white/25 rounded-lg">
                    <img
                      src="/navDiscord1.svg"
                      className="w-[25px] my-4 ml-4"
                    ></img>
                    <input
                      placeholder="Your discord nickname"
                      onChange={handleChangeRequestNickName}
                      className=" bg-white/0 ml-4 border-white/5 outline-none text-[15px] h-full text-white"
                    ></input>
                  </div>
                </div>
                <div className="flex justify-center items-center w-[580px] mt-[20px]">
                  <button
                    className="w-[250px] border border-[#D679BC] text-[20px] font-bold text-white py-3 rounded-lg"
                    onClick={sendRequest}
                  >
                    Request Access
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
      {successRequestModal ? (
        <>
          <div className="absolute overflow-hidden flex justify-center items-center z-3 w-screen h-screen inset-0 bg-black/50   backdrop-blur-[4px]">
            <div className="flex justify-center items-center w-full h-[350px] md:w-[550px] md:h-[350px] bg-black/30 rounded-[20px]  backdrop-blur-[30px]">
              <button
                className="absolute top-[45px] right-[40px] w-[15px] z-[2]"
                onClick={() => {
                  setSuccessRequestModal(false);
                }}
              >
                <img src="/close1.svg"></img>
              </button>
              <div className="flow-root items-center">
                <div className="md:text-[30px] text-[26px] text-center font-bold text-[#FF9E2C] mt-10 mb-[14px]">
                  Request Success
                </div>
                <div className="text-[20px] text-center font-bold text-white mb-[14px]">
                  Your application will be processed <br />
                  within 24 hours.
                </div>
                <div className="flex justify-center items-center w-[580px] mt-[10px]">
                  <div className="md:w-[450px] w-[350px] border-b-2"></div>
                </div>
                <div className="flex justify-center items-center w-[580px]">
                  <img className="w-[130px]" src="/success.png"></img>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
