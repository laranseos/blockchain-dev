import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEthers } from "@usedapp/core";
import localFont from "@next/font/local";
import { useWallet } from "@solana/wallet-adapter-react";
import { ethers } from "ethers";
import { ExternalProvider } from "@ethersproject/providers";
import FlipCard from "react-countdown-flip-card";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import "@leenguyen/react-flip-clock-countdown/dist/index.css";
import Loader from "../components/Loader";
import {
  Connection,
  Transaction,
  PublicKey,
  SystemProgram,
} from "@solana/web3.js";

const poppins = localFont({
  src: [
    {
      path: "../public/Geometria.ttf",
      weight: "400",
    },
  ],
  variable: "--font-poppins",
});

const poppinsSmall = localFont({
  src: [
    {
      path: "../public/CarroisGothic-Regular.ttf",
      weight: "400",
    },
  ],
  variable: "--font-poppinsSmall",
});

declare global {
  interface Window {
    ethereum?: ExternalProvider;
    // solana?:ExternalProvider
  }
}
declare global {
  interface Window {
    solana: any;
  }
}

export default function Home() {
  const [digit, setDigit] = useState(9);

  useEffect(() => {
    setTimeout(() => setDigit(digit === 0 ? 9 : digit - 1), 1000);
  }, [digit]);
  const videoRef = useRef(null);
  const [playFlag, setPlayFlag] = useState("opacity-0");
  const [videoBlurFlag, setVideoBlurFlag] = useState("");
  const [code, setCode] = useState("");
  const [isCodeInput, setIsCodeInput] = useState(true);
  const [isBuyNft, setIsBuyNft] = useState("-z-10");
  // const [isBuyNft, setIsBuyNft] = useState("z-10");
  const [chain, setChain] = useState("");
  const [connectWalletModal, setConnectWalletModal] = useState(false);
  const [walletName, setWalletName] = useState("");
  const [subString, setSubString] = useState("");
  const { select, wallets, publicKey, disconnect } = useWallet();
  const { account, activateBrowserWallet, deactivate } = useEthers();
  const [codeData, setCodeData] = useState(
    {} as { deadline: string; tokenNum: number }
  );
  const [bonus, setBonus] = useState(4);
  const [nftNum, setNftNum] = useState(1);
  const [totalPrice, setTotalPrice] = useState(2.5);
  const [totalToken, setTotalToken] = useState(72800);
  const [ethValue, setEthValue] = useState(1);
  const [transaction, setTransaction] = useState("");
  const [congratulation, showCongratulationModal] = useState(false);
  const [nickname, setNickName] = useState("");
  const [web3, setWeb3] = useState(null);
  const [accountPhantom, setAccountPhantom] = useState(null);
  const [defaultWalletName, setDefaultWalletName] = useState("");
  const [defaultSubstring, setDefaultSubstring] = useState("");
  const [remainTime, setRemainTime] = useState(0);
  const [bgEth, setBgEth] = useState("");
  const [bgSol, setBgSol] = useState("");
  const [outline, setOutline] = useState("border border-white/25");
  const [vibration, setvibration] = useState("");
  const [textRed, setTextRed] = useState("text-white");
  const [restTime, setRestTime] = useState(
    new Date(new Date().getTime() + 1000000)
  );
  const [selectChain, setSelectChain] = useState(true);
  const [totalHold, setTotalHold] = useState(0);
  const [buyLoad, setBuyLoad] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTotalToken(totalToken);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);
  let playCounter = 1;
  const handlePlay = () => {
    if (playCounter % 2 == 0) {
      videoRef.current.play();
      setPlayFlag("opacity-0");
      setVideoBlurFlag("");
    } else {
      videoRef.current.pause();
      setVideoBlurFlag("blur-[3px] bg-black/40");
    }
    playCounter++;
  };
  const handleChangeCode = (event) => {
    setCode(event.target.value);
    setOutline("border border-white/25");
    setTextRed("text-white");
  };

  const sendCode = async () => {
    if (code === "") {
      setOutline("border border-rose-500");
      setvibration("element");
      setTextRed("text-rose-500");
      setTimeout(() => setvibration(""), 1000);
    } else {
      const response = await axios.post(
        "https://marius-server-wjua.onrender.com/api/airdrop/checkCode",
        {
          data: {
            code: code,
          },
        }
      );
      if (response.data === "incorrect") {
        setOutline("border border-rose-500");
        setvibration("element");
        setTextRed("text-rose-500");
        setTimeout(() => setvibration(""), 1000);
      } else if (response.data === "expired") {
        setvibration("element");
        setOutline("border border-rose-500");
        setTextRed("text-rose-500");
        setTimeout(() => setvibration(""), 1000);
      } else if (response.data === "zeroTicket") {
        setvibration("element");
        setOutline("border border-rose-500");
        setTextRed("text-rose-500");
        setTimeout(() => setvibration(""), 1000);
      } else if (response.data.status === "success") {
        setIsCodeInput(false);
        setIsBuyNft("z-10");
        setCodeData(response.data.data);
        const targetTime = new Date(`${response.data.data.deadline}:00`);
        const timezoneOffset = targetTime.getTimezoneOffset();
        const localDate = new Date(
          targetTime.getTime() - timezoneOffset * 60 * 1000
        );

        // Get the local time components
        const localYear = localDate.getFullYear();
        const localMonth = localDate.getMonth() + 1;
        const localDay = localDate.getDate();
        const localHours = localDate.getHours();
        const localMinutes = localDate.getMinutes();
        const localSeconds = localDate.getSeconds();
        let month = "";
        let day = "";
        let hours = "";
        let minutes = "";
        let seconds = "";
        if (localMonth < 10) {
          month = "0" + localMonth.toString();
        }
        if (localDay < 10) {
          day = "0" + localDay.toString();
        }
        if (localHours < 10) {
          hours = "0" + localHours.toString();
        }
        if (localMinutes < 10) {
          minutes = "0" + localMinutes.toString();
        }
        if (localSeconds < 10) {
          seconds = "0" + localSeconds.toString();
        }
        setRestTime(localDate);
      }
    }
  };
  const fetchEtherPrice = async () => {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum,solana&vs_currencies=usd"
    );
    const ethPrice = await response.json();
    const ethVsSol = ethPrice.solana.usd / ethPrice.ethereum.usd;
    setEthValue(ethVsSol);
  };

  const connectWallet = async () => {
    if (chain === "") {
      setvibration("element");
      setTextRed("text-rose-500");
      setTimeout(() => setvibration(""), 1000);
    } else {
      if (chain === "eth") {
        activateBrowserWallet();
        if (accountPhantom === null) {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          setWeb3(signer);
          const accounts = await provider.listAccounts();
          setAccountPhantom(accounts[0]);
          await walletInfo(accounts[0]);
          if (account) {
            setWalletName("Metamask");
            setDefaultWalletName("Metamask");
            const metaPublicKey =
              accounts[0].substring(0, 4) +
              ".." +
              accounts[0].substring(39, 43);
            setSubString(metaPublicKey);
            setDefaultSubstring(metaPublicKey);
            await walletInfo(accounts[0]);
          } else {
            setWalletName("Phantom");
            setDefaultWalletName("Phantom");
            const metaPublicKey =
              accounts[0].substring(0, 4) +
              ".." +
              accounts[0].substring(39, 43);
            setSubString(metaPublicKey);
            setDefaultSubstring(metaPublicKey);
            await walletInfo(accounts[0]);
          }
        } else {
          if (account !== undefined) {
            if (accountPhantom !== account) {
              setWalletName("Phantom");
              setDefaultWalletName("Phantom");
              const metaPublicKey =
                accountPhantom.substring(0, 4) +
                ".." +
                accountPhantom.substring(39, 43);
              setSubString(metaPublicKey);
              setDefaultSubstring(metaPublicKey);
              await walletInfo(accountPhantom);
            } else {
              setWalletName("Metamask");
              setDefaultWalletName("Metamask");
              const metaPublicKey =
                accountPhantom.substring(0, 4) +
                ".." +
                accountPhantom.substring(39, 43);
              setSubString(metaPublicKey);
              setDefaultSubstring(metaPublicKey);
              await walletInfo(accountPhantom);
            }
          } else if (account === undefined) {
            if (accountPhantom) {
              setWalletName(defaultWalletName);
              setSubString(defaultSubstring);
              await walletInfo(accountPhantom);
            }
          }
        }
      } else if (chain === "sol") {
        setConnectWalletModal(true);
        setIsBuyNft("z-10");
      }
    }
  };
  const walletInfo = async (walletAddress) => {
    const response = await axios.post(
      "https://marius-server-wjua.onrender.com/api/airdrop/walletInfo",
      {
        walletAddress: walletAddress,
        code: code,
      }
    );
    setTotalHold(response.data);
  };
  const nftNumChange = (status) => {
    if (status === "plus") {
      if (nftNum < codeData.tokenNum) setNftNum(nftNum + 1);
    } else if (status === "minus") {
      if (nftNum > 1) setNftNum(nftNum - 1);
    }
  };
  const connectWalletSol = async (name) => {
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
    else {
      select(wallet[0].adapter.name), setWalletName(wallet[0].adapter.name);
      if (publicKey) {
        const solPublic =
          publicKey.toBase58().substring(0, 4) +
          ".." +
          publicKey.toBase58().substring(39, 43);
        setSubString(solPublic);
        await walletInfo(publicKey.toBase58());
        setConnectWalletModal(false);
        if (code) {
          setIsBuyNft("z-10");
        }
      }
    }
  };
  const calculateLog = (value) => {
    const log = Math.log(value) / Math.log(10);
    return log;
  };
  const nftBuy = async () => {
    if (calCulateRemainTime() <= 0) {
      toast("This code expired", {
        hideProgressBar: false,
        autoClose: 2000,
        type: "error",
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } else {
      setBuyLoad(true);
      if (walletName === "") {
        toast("Please connect wallet", {
          hideProgressBar: false,
          autoClose: 2000,
          type: "error",
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      } else {
        let address = "";
        if (walletName === "Metamask") {
          address = account;
        } else if (walletName === "Phantom") {
          if (chain === "eth") {
            address = accountPhantom;
          } else if (chain === "sol") {
            address = publicKey.toBase58();
          }
        } else if (walletName === "Backpack") {
          address = publicKey.toBase58();
        }
        const response = await axios.post(
          "https://marius-server-wjua.onrender.com/api/airdrop/checkMax",
          {
            code: code,
            address: address,
          }
        );
        if (response.data === "expire") {
          toast("This code expired", {
            hideProgressBar: false,
            autoClose: 2000,
            type: "error",
            position: toast.POSITION.BOTTOM_RIGHT,
          });
          setBuyLoad(false);
        } else {
          if (walletName === "Metamask") {
            let chainID;
            try {
              await window.ethereum
                .request({ method: "eth_chainId" })
                .then((chainId) => {
                  chainID = chainId;
                });
            } catch (error) {
              console.error(error); // Handle error appropriately
            }
            const ethereum = window.ethereum;
            if (chainID !== "0x1") {
              try {
                await ethereum.request({
                  method: "wallet_switchEthereumChain",
                  params: [{ chainId: "0x1" }], // Change chainId to the desired network
                });
              } catch (error) {
                console.log(error);
              }
            }
            const amount = await getBalance(account);
            const sendAmount = totalPrice * ethValue;
            if (amount < sendAmount + 0.0000001) {
              toast("You don't have enough ETH", {
                hideProgressBar: false,
                autoClose: 2000,
                type: "error",
                position: toast.POSITION.BOTTOM_RIGHT,
              });
              setBuyLoad(false);
            } else {
              const ethAmount = totalPrice * ethValue;
              const weiAmountValue = ethers.utils.parseEther(
                ethAmount.toString()
              );
              const addressToValue =
                "0x2eA093426aa3C3CA6bA637f0E71bf1e6649A612A";
              const transactionRequest = {
                to: addressToValue,
                value: weiAmountValue.toString(),
              };
              const provider = new ethers.providers.Web3Provider(
                window.ethereum
              );
              const signer = await provider.getSigner();
              const receipt = await signer.sendTransaction(transactionRequest);
              setTransaction(receipt.hash);
              setBuyLoad(false);
              showCongratulationModal(true);
              setIsBuyNft("-z-10");
            }
          } else if (walletName === "Phantom") {
            if (chain === "eth") {
              let chainID;
              try {
                await window.ethereum
                  .request({ method: "eth_chainId" })
                  .then((chainId) => {
                    chainID = chainId;
                  });
              } catch (error) {
                console.error(error); // Handle error appropriately
              }
              const ethereum = window.ethereum;
              if (chainID !== "0x1") {
                try {
                  await ethereum.request({
                    method: "wallet_switchEthereumChain",
                    params: [{ chainId: "0x1" }], // Change chainId to the desired network
                  });
                } catch (error) {
                  console.log(error);
                }
              }
              const amount = await getBalance(account);
              const sendAmount = totalPrice * ethValue;
              if (amount < sendAmount + 0.0000001) {
                toast("You don't have enough ETH", {
                  hideProgressBar: false,
                  autoClose: 2000,
                  type: "error",
                  position: toast.POSITION.BOTTOM_RIGHT,
                });
              } else {
                const ethAmount = totalPrice * ethValue;
                const weiAmountValue = ethers.utils.parseEther(
                  ethAmount.toString()
                );
                const addressToValue =
                  "0x2eA093426aa3C3CA6bA637f0E71bf1e6649A612A";
                const transactionRequest = {
                  to: addressToValue,
                  value: weiAmountValue.toString(),
                };
                const provider = new ethers.providers.Web3Provider(
                  window.ethereum
                );
                const signer = await provider.getSigner();
                setBuyLoad(false);
                const receipt = await signer.sendTransaction(
                  transactionRequest
                );
                setTransaction(receipt.hash);
                showCongratulationModal(true);
                setIsBuyNft("-z-10");
              }
            } else if (chain === "sol") {
              const connection = new Connection(
                "https://api.metaplex.solana.com/"
              );
              const provider = window.solana;
              const senderPublicKey = await provider.publicKey.toString();
              const senderWallet = new PublicKey(senderPublicKey);
              const recipientPublicKey = new PublicKey(
                "BdNCg7Pi26qGrrBfzPbxwUfq9wbUzyoXrTuwgwW6AqAG"
              );
              const transaction = new Transaction().add(
                SystemProgram.transfer({
                  fromPubkey: senderWallet,
                  toPubkey: recipientPublicKey,
                  lamports: totalPrice * 1000000000,
                })
              );
              try {
                const { blockhash } = await connection.getRecentBlockhash();
                transaction.recentBlockhash = blockhash;
                transaction.feePayer = senderWallet;

                // Sign the transaction using the Solana provider
                const signedTransaction = await provider.signTransaction(
                  transaction
                );

                // Send the signed transaction to the Solana network
                const signature = await connection.sendRawTransaction(
                  signedTransaction.serialize()
                );

                // Confirm the transaction
                await connection.confirmTransaction(signature);
                setTransaction(signature);
                showCongratulationModal(true);
                setBuyLoad(false);
                setIsBuyNft("-z-10");
              } catch (error) {
                console.error("Transaction failed:", error);
              }
            }
          } else if (walletName === "Backpack") {
            const connection = new Connection(
              "https://api.metaplex.solana.com/"
            );
            const receivePublicKey = new PublicKey(
              "BdNCg7Pi26qGrrBfzPbxwUfq9wbUzyoXrTuwgwW6AqAG"
            );
            const amount = totalPrice;
            try {
              const transaction = new Transaction().add(
                SystemProgram.transfer({
                  fromPubkey: publicKey,
                  toPubkey: receivePublicKey,
                  lamports: amount * 10 ** 9, // Convert SOL to lamports (1 SOL = 10^9 lamports)
                })
              );

              const signature = await sendTransaction(transaction, connection);
              setTransaction(signature);
              showCongratulationModal(true);
              setBuyLoad(false);
              setIsBuyNft("-z-10");
            } catch (error) {
              console.error("Error sending transaction:", error);
            }
          }
        }
      }
    }
  };
  const { sendTransaction } = useWallet();
  const getProvider = () => {
    if ("phantom" in window) {
      const anyWindow: any = window;
      const provider = anyWindow.phantom?.ethereum;

      if (provider) {
        return provider;
      }
    }

    window.open("https://phantom.app/", "_blank");
  };
  const getBalance = async (address) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(address);
    const balanceInEth = ethers.utils.formatEther(balance);
    return parseFloat(balanceInEth);
  };
  const handleChangeNickName = (event) => {
    setNickName(event.target.value);
  };
  // const connectWalletPhantomToEth = async () => {
  //   const connection = new Connection("https://api.metaplex.solana.com/");
  //   const phantomWallet = window.solana;
  //   const publicKey = await phantomWallet.getPublicKey();
  //   const { data } = await connection.getAccountInfo(publicKey);
  //   if (publicKey) {
  //     await phantomWallet.disconnect();
  //     await phantomWallet.connect("ethereum");
  //   }
  // };
  const sendTransactionResult = async () => {
    let address = "";
    if (walletName === "Metamask") {
      address = account;
    } else if (walletName === "Phantom") {
      if (chain === "eth") {
        address = accountPhantom;
      } else if (chain === "sol") {
        address = publicKey.toBase58();
      }
    } else if (walletName === "Backpack") {
      address = publicKey.toBase58();
    }
    const data = {
      transaction: transaction,
      nickname: nickname,
      code: code,
      nftNum: nftNum,
      unit: chain,
      value: totalPrice,
      tokens: totalToken,
      publicKey: address,
    };
    const response = await axios.post(
      "https://marius-server-wjua.onrender.com/api/airdrop/sendTransaction",
      {
        data: data,
      }
    );
    if (response.data === "success") {
      showCongratulationModal(false);
      setIsBuyNft("z-10");
      const total = totalHold + totalToken;
      let counter = totalHold;
      setInterval(() => {
        if (counter < total) {
          if (counter + 500 > total) {
            counter = counter + (total - counter);
          } else {
            counter = counter + 300;
          }
          setTotalHold(counter);
        } else {
          clearInterval(null);
        }
      }, 4);
    }
  };
  const calCulateRemainTime = () => {
    const targetTime = new Date(`${codeData.deadline}:00`).getTime();
    const currentDate = new Date();
    const utcYear = currentDate.getUTCFullYear();
    const utcMonth = currentDate.getUTCMonth() + 1; // Months are zero-based, so add 1
    const utcDay = currentDate.getUTCDate();
    const utcHours = currentDate.getUTCHours();
    const utcMinutes = currentDate.getUTCMinutes();
    const utcSeconds = currentDate.getUTCSeconds();
    const currentTime = new Date(
      `${utcYear}-${utcMonth}-${utcDay} ${utcHours}:${utcMinutes}:${utcSeconds}`
    ).getTime();
    const elapsedTime = Math.floor((targetTime - currentTime) / 1000);
    return elapsedTime;
  };
  useEffect(() => {
    fetchEtherPrice();
    disconnect;
    if (code === "") setIsBuyNft("-z-10");
  }, []);
  useEffect(() => {
    if (walletName !== "") setSelectChain(false);
  }, [walletName]);
  useEffect(() => {
    const loadWeb3 = async () => {
      if (window.ethereum) {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        setWeb3(signer);
        const accounts = await provider.listAccounts();
        setAccountPhantom(accounts[0]);
      }
    };
    loadWeb3();
  }, []);

  useEffect(() => {
    if (publicKey) {
      if (chain === "sol") {
        const solPublic =
          publicKey.toBase58().substring(0, 4) +
          ".." +
          publicKey.toBase58().substring(39, 43);
        setSubString(solPublic);
        walletInfo(publicKey.toBase58());
      } else if (chain === "eth") {
        const providerPhantomEth = getProvider();
        const accounts = providerPhantomEth.request({
          method: "eth_requestAccounts",
        });
        providerPhantomEth.on("connect", (connectionInfo: { chainId: "0x1" }) =>
          console.log(`Connected to chain: ${connectionInfo.chainId}`)
        );
        console.log(providerPhantomEth.selectedAddress);
        const metaPublicKey =
          providerPhantomEth.selectedAddress.substring(0, 4) +
          ".." +
          account.substring(39, 43);
        setSubString(metaPublicKey);
        walletInfo(providerPhantomEth);
      }

      setConnectWalletModal(false);
      if (code) {
        setIsBuyNft("z-10");
      }
    } else {
      setWalletName("");
    }
  }, [publicKey]);

  useEffect(() => {
    setBonus(nftNum * 2 + 2);
    setTotalPrice(nftNum * 2.5);
    let bonus = nftNum * 2 + 2;
    setTotalToken((nftNum * 70000 * (100 + bonus)) / 100);
  }, [nftNum]);
  /// Time counter
  useEffect(() => {
    if (codeData) {
      const targetTime = new Date(`${codeData.deadline}:00`).getTime();
      let intervalId = setInterval(() => {
        const currentDate = new Date();
        const utcYear = currentDate.getUTCFullYear();
        const utcMonth = currentDate.getUTCMonth() + 1; // Months are zero-based, so add 1
        const utcDay = currentDate.getUTCDate();
        const utcHours = currentDate.getUTCHours();
        const utcMinutes = currentDate.getUTCMinutes();
        const utcSeconds = currentDate.getUTCSeconds();
        const currentTime = new Date(
          `${utcYear}-${utcMonth}-${utcDay} ${utcHours}:${utcMinutes}:${utcSeconds}`
        ).getTime();
        const elapsedTime = Math.floor((targetTime - currentTime) / 1000);
        setRemainTime(elapsedTime);
      }, 1000);
    }
  }, [codeData]);

  const [loading, setLoading] = React.useState("z-50");
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading("-z-50");
    }, 10000); // Set the duration for the loading page in milliseconds (e.g., 3000ms = 3 seconds)

    return () => clearTimeout(timeout); // Clear the timeout when the component is unmounted
  }, []);
  return (
    <div>
      <div
        className={`${loading} absolute flex justify-center items-center w-screen h-screen overflow-hidden my-auto bg-black border-black`}
      >
        <Loader />
      </div>
      <div
        className={`absolute h-full w-full md:overflow-hidden ${poppins.variable} font-sans`}
      >
        <iframe className="z-0 h-full w-full absolute" src="1.html"></iframe>
        {isCodeInput ? (
          <>
            <div className="w-full h-full flex fixed items-center justify-center bg-black/50 backdrop-blur-[4px]">
              <div className="w-[680px] flex fixed bg-black/20 backdrop-blur-lg backdrop-brightness-150 rounded-[20px]">
                <div className="flow-root">
                  <div className="flex items-center justify-center">
                    <video
                      src="/first.mov"
                      className={`object-cover w-full rounded-t-[20px] ${videoBlurFlag}`}
                      ref={videoRef}
                      muted
                      loop
                      autoPlay
                    ></video>
                    <button
                      className={`absolute z-10 text-[30px] group ${playFlag} hover:opacity-100`}
                      onClick={handlePlay}
                    >
                      <img src="/play.svg" />
                    </button>
                  </div>
                  <div className="w-full inline-flex px-[20px] mt-[30px] mb-[40px] items-center justify-center">
                    <div
                      className={`${outline} inline-flex ${vibration} items-center rounded-lg text-[20px] py-[15px] mr-[30px]`}
                    >
                      <input
                        placeholder="Paste Exclusive code"
                        onChange={handleChangeCode}
                        className={`bg-white/0 ml-[30px] w-[278px] border-white/5 outline-none h-full ${textRed}`}
                      ></input>
                    </div>
                    <button
                      onClick={sendCode}
                      className="bg-black/50 backdrop-blur-[4px] rounded-[10px] text-[25px] py-[10px] px-[20px] w-[255px] text-white"
                    >
                      Enter
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
        <div
          className={`w-full h-full flex absolute items-center justify-center bg-black/50 backdrop-blur-[4px] ${isBuyNft}`}
        >
          <div className="w-[800px] flex fixed">
            <div className="flow-root">
              <div className="w-full inline-flex bg-black/20 backdrop-blur-lg backdrop-brightness-150 rounded-[20px] items-center py-[20px]">
                {selectChain ? (
                  <>
                    <div
                      className={`ml-[30px] inline-flex ${vibration} ${textRed}`}
                    >
                      <button
                        className={`inline-flex items-center ${bgEth} rounded-md`}
                        onClick={() => {
                          setChain("eth"),
                            setBgEth("bg-zinc-800"),
                            setBgSol("");
                          setTextRed("text-white");
                        }}
                      >
                        <div className="text-[20px] ml-[10px] my-[7px]">
                          ETH
                        </div>
                        <img src="/ethericon.png" className="w-[33px]" />
                      </button>
                      <button
                        className={`inline-flex items-center ${bgSol} rounded-md`}
                        onClick={() => {
                          setChain("sol"),
                            setBgEth(""),
                            setBgSol("bg-zinc-800");
                          setTextRed("text-white");
                        }}
                      >
                        <div className="text-[20px] ml-[10px] my-[7px]">
                          SOL
                        </div>
                        <img
                          src="/sollogo.svg"
                          className="w-[30px] ml-[5px] mr-[10px]"
                        />
                      </button>
                    </div>
                    <img className="w-[54px] ml-[162px]" src="/logo.PNG"></img>
                  </>
                ) : !selectChain ? (
                  <>
                    <div className="inline-flex items-center text-white ml-[36px]">
                      <div className="mr-[10px] text-[20px]">You hold</div>
                      <FlipCard
                        digit={String(totalHold)}
                        width={80}
                        height={30}
                      />
                    </div>
                    <img
                      className="w-[35px] ml-[10px]"
                      src="/mariuslogo1.png"
                    ></img>
                    <img className="w-[54px] ml-[117px]" src="/logo.PNG"></img>
                  </>
                ) : null}

                {walletName === "" ? (
                  <>
                    <button
                      onClick={() => {
                        connectWallet();
                      }}
                      className="bg-black text-[17px] ml-[162px] rounded-[15px] border border-[#D679BC] w-[180px] h-[50px] mr-[20px] text-white font-bold"
                    >
                      Connect Wallet
                    </button>
                  </>
                ) : walletName === "Metamask" ? (
                  <button
                    onClick={() => {
                      deactivate(), setWalletName(""), setSelectChain(true);
                    }}
                    className="flex items-center bg-white text-[17px] ml-[162px] rounded-[15px] border border-white w-[180px] h-[50px] mr-[20px] text-black font-bold"
                  >
                    <img
                      className="w-[35px] ml-[15px] mr-[10px]"
                      src="/metamask.png"
                    />
                    <div className="text-black">{subString}</div>
                  </button>
                ) : walletName === "Phantom" ? (
                  <button
                    onClick={() => {
                      disconnect(), setWalletName(""), setSelectChain(true);
                    }}
                    className="flex items-center bg-white text-[17px] ml-[162px] rounded-[15px] border border-white w-[180px] h-[50px] mr-[20px] text-black font-bold"
                  >
                    <img
                      className="w-[35px] ml-[15px] mr-[10px]"
                      src="/PhantomIcon.svg"
                    />
                    <div className="text-black">{subString}</div>
                  </button>
                ) : walletName === "Backpack" ? (
                  <button
                    onClick={() => {
                      disconnect(), setWalletName(""), setSelectChain(true);
                    }}
                    className="flex items-center bg-[#D679BC] text-[17px] ml-[162px] rounded-[15px] border border-white w-[180px] h-[50px] mr-[20px] text-white font-bold"
                  >
                    <img
                      className="w-[21px] ml-[15px] mr-[10px]"
                      src="/Backpack.svg"
                    />
                    <div className="text-white">{subString}</div>
                  </button>
                ) : null}
              </div>
              <div className="w-full mt-[20px] bg-black/20 backdrop-blur-lg backdrop-brightness-150 rounded-[20px] inline-flex">
                <video
                  src="/back.mov"
                  muted
                  loop
                  autoPlay
                  className="object-cover w-[340px] rounded-l-[20px] h-[550px]"
                ></video>
                <button className="absolute bg-black/20 backdrop-blur-lg backdrop-brightness-50 text-white text-[17px] font-bold rounded-[10px] left-[97px] top-[30px]">
                  <div className="my-[7px] mx-[40px]">MARIUS NFT</div>
                </button>
                <div className="flow-root ml-[30px] mt-[30px]">
                  <div className="flow-root">
                    <div className="text-white  text-[20px]">
                      Counter ends in
                    </div>
                    <FlipClockCountdown
                      className="mt-[10px]"
                      digitBlockStyle={{
                        width: 20,
                        height: 30,
                        fontSize: 15,
                      }}
                      dividerStyle={{ color: "transparent", height: 0 }}
                      separatorStyle={{ color: "white", size: "4px" }}
                      labelStyle={{
                        fontSize: 0,
                        fontWeight: 0,
                        color: "transparent",
                      }}
                      to={restTime}
                    />
                  </div>
                  <div className="text-[25px] text-white font-bold mt-[25px]">
                    You will receive
                  </div>
                  <div className="inline-flex mt-[20px]">
                    <div className="inline-flex w-[230px] rounded-[15px] bg-black/40 backdrop-blur-lg backdrop-brightness-150 text-[#D679BC] text-[35px] items-center justify-center">
                      {calculateLog(totalToken) >= 6 ? (
                        <div className="ml-[30px] text-[25px] font-[900]">
                          <FlipCard
                            digit={String(totalToken)}
                            width={120}
                            height={40}
                          />
                        </div>
                      ) : calculateLog(totalToken) < 6 ? (
                        <div className="ml-[30px] text-[30px] font-[900]">
                          <FlipCard
                            className="bg-transparent"
                            digit={String(totalToken)}
                            width={120}
                            height={40}
                          />
                        </div>
                      ) : null}
                      <img
                        className="w-[50px] ml-[20px] mr-[35px]"
                        src="/mariuslogo1.png"
                      ></img>
                    </div>
                    <div className="inline-flex ml-[20px] rounded-[15px] bg-black/40 backdrop-blur-lg backdrop-brightness-150 text-[#D679BC] text-[35px] items-center justify-center py-[6px]">
                      <button
                        onClick={() => {
                          nftNumChange("minus");
                        }}
                        className="ml-[20px]"
                      >
                        <img src="/minus.svg" />
                      </button>
                      <div className="text-[40px] w-[40px] font-bold ml-[10px] flex justify-center items-center text-white">
                        <div>{nftNum}</div>
                      </div>
                      <button
                        onClick={() => {
                          nftNumChange("plus");
                        }}
                        className="ml-[10px] mr-[20px]"
                      >
                        <img src="/plus.svg" />
                      </button>
                    </div>
                  </div>
                  <div className="inline-flex mt-[20px]">
                    <div className="bg-black/40 backdrop-blur-lg backdrop-brightness-150 rounded-[15px] text-[#38FFDB] text-[17px]">
                      <div className="my-[8px] mx-[30px]">+{bonus}% bonus</div>
                    </div>
                    {chain === "sol" || chain === "" ? (
                      <div className="inline-flex ml-[113px] items-center">
                        <div className="text-white text-[25px] font-bold">
                          {totalPrice} SOL
                        </div>
                        <img className="w-[30px]" src="/sollogo.svg" />
                      </div>
                    ) : chain === "eth" ? (
                      <div className="inline-flex ml-[100px] items-center">
                        <div className="text-white text-[25px] font-bold">
                          {(totalPrice * ethValue).toFixed(2)} ETH
                        </div>
                        <img className="w-[30px]" src="/ethericon.png" />
                      </div>
                    ) : null}
                  </div>
                  <button
                    onClick={() => {
                      nftBuy();
                    }}
                    className="w-[395px] flex rounded-[10px] bg-black border border-[#D679BC] text-[25px] mt-[40px] font-bold text-white items-center justify-center"
                  >
                    {buyLoad ? (
                      <>
                        <div>
                          <video
                            src="/loading.mp4"
                            className="w-[50px]"
                            autoPlay
                            muted
                            loop
                          ></video>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="my-[6px]">Buy</div>
                      </>
                    )}
                  </button>
                  <div className="w-[395px] text-center text-white mb-[10px] mt-[20px] text-[18px]">
                    The airdrop will take place on launch day
                  </div>
                  <div className="inline-flex w-[395px] mt-[10px] justify-center">
                    <a
                      href="https://last-haven.gitbook.io/last-haven/"
                      target="_blank"
                      className="mr-[10px]"
                    >
                      <img src="/git.svg" />
                    </a>
                    <a
                      href="https://twitter.com/mariuslabs"
                      target="_blank"
                      className="mr-[10px]"
                    >
                      <img src="/twitter.svg" />
                    </a>
                    <a
                      href="http://discord.gg/mariuslabs"
                      target="_blank"
                      className="mr-[10px]"
                    >
                      <img src="/discord.svg" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {connectWalletModal ? (
          <>
            <div className="w-full h-full flex fixed bg-black/60 backdrop-blur-[10px] backdrop-brightness-150 items-center justify-center z-20">
              <div className="w-[550px] flex fixed bg-black/20 backdrop-blur-[10px] items-center justify-center backdrop-brightness-150 rounded-xl">
                <div className="flow-root mt-[50px] mb-[80px]">
                  <div className="text-[25px] font-bold text-white text-center">
                    Select your wallet
                  </div>
                  {chain === "sol" ? (
                    <>
                      <button
                        onClick={() => connectWalletSol("Phantom")}
                        className="border border-white w-[300px] flex items-center mt-[30px] rounded-[10px] py-[10px]"
                      >
                        <img
                          className="w-[40px] ml-[30px]"
                          src="/PhantomIcon.svg"
                        />
                        <div className="text-[#D679BC] text-[25px]  ml-[20px] font-bold">
                          Phantom
                        </div>
                      </button>
                      <button
                        onClick={() => connectWalletSol("Backpack")}
                        className="border border-white w-[300px] flex items-center mt-[20px] rounded-[10px] py-[10px]"
                      >
                        <img
                          className="w-[25px] ml-[37px]"
                          src="/Backpack.svg"
                        />
                        <div className="text-white text-[25px]  ml-[20px] font-bold">
                          BackPack
                        </div>
                      </button>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </>
        ) : null}
        {congratulation ? (
          <>
            <div className="absolute flex justify-center items-center z-3 w-screen h-screen inset-0 bg-black/50   backdrop-blur-[4px]">
              <div className="flex justify-center items-center w-full h-full md:w-[625px] md:h-[450px] bg-black/30 rounded-[20px]  backdrop-blur-[30px]">
                <div className="flow-root items-center">
                  <div className="text-[35px] text-center font-bold text-[#2cff3e] mb-[20px]">
                    Congratulations!
                  </div>
                  <div className="inline-flex">
                    <div className="w-1/12"></div>
                    <div
                      className={`w-10/12 text-[20px] text-center ${poppinsSmall.variable} font-congratulation text-white mb-[20px]`}
                    >
                      Get ready to embark on a journey where every decision
                      shapes your ultimate destiny. The gates of the Last Haven
                      will soon be opened.
                    </div>
                    {/* ${poppinsSmall.variable} */}
                  </div>
                  <div className="flex justify-center items-center w-full mb-[20px]">
                    <div className="w-4/5 border-b-2"></div>
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
                        className="bg-white/0 ml-4 border-white/5 outline-none text-[15px] h-full text-white"
                      ></input>
                    </div>
                  </div>
                  <div className="flex justify-center items-center w-full mt-[20px]">
                    <button
                      className="w-[250px] bg-black/50 backdrop-blur-[4px] border border-[#D679BC] text-[20px] font-bold text-white py-3 rounded-lg"
                      onClick={() => {
                        sendTransactionResult();
                      }}
                    >
                      Enter
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}

        <ToastContainer
          toastStyle={{ backgroundColor: "#dc5148", color: "white" }}
        />
      </div>
    </div>
  );
}
