import { GetNonce, gameReveal } from "@/api/game";
import { GetProfile } from "@/api/profile";
import {updateState} from '@/api/verify';
import { GetrecentFlickers } from "@/api/recent-flickers";
import GetCookie from "@/hooks/cookies/getCookie";
import SetCookie from "@/hooks/cookies/setCookie";
import { useQuery } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { FC, useEffect, useState, useRef } from "react";
import AddFundModal from "../add-fund-modal/addFundModal";
import { getLeatherSignature } from "../play-modal/leather";
import { signMessage } from "../play-modal/unisat";
import { getXverseSign } from "../play-modal/xverse";
import RecentFlickersModal from "../recent-flickers-modal/recentFlickersModal";
import {
  playWinAudio,
  playLoseAudio,
  playButtonAudio,
  playLeverDownAudio,
  playLeverUpAudio,
  playCoinAudio,
  playFlipingSideLongAudio,
} from "@/sound";
import flipingSideLongAudio from '../../../public/static/audio/fliping_side_long.mp3';
import Confetti from "react-confetti";
import { verifyData } from "@/api/verify";
import { useBalanceStore } from "../../store";
import UsernameModal from "../username-modal/usernameModal";
import DepositModal from "../exchange-modal/exchangeModal";
interface FlipCoinContentProps {}

interface dataProps {
  outcome: string;
  public_key: string;
  bet_amount: string;
  timeAgo: string;
  verified: boolean;
}

const FlipCoinContent: FC<FlipCoinContentProps> = ({}) => {
  const audioRef = useRef();
  const [count, setCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [canShow, setCanShow] = useState(false);
  const [data, setData] = useState<dataProps[]>([]);
  const [verification, setVerification] = useState(false);
  const [isVerificationDisplaying, setIsVerificationDisplaying] = useState(false);
  const [showRecentModal, setShowRecentModal] = useState(false);
  const [showAddFundModal, setShowAddFundModal] = useState(false);
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [gameResult, setGameResult] = useState(0);
  const [acd, setAcd] = useState(0.1);
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("ended"); // 3 status, started, loading, ended
  const [loadingLoop, setLoadingLoop] = useState(false);
  const [balance, setBalance] = useState(0);
  const [points, setPoints] = useState(0);
  const [status, setStatus] = useState("heads");
  const [start, setStart] = useState(false);
  const [first, setFirst] = useState(true);
  const [idx, setIdx] = useState(0);
  const [loadingAnimation, setLoadingAnimation] = useState("coin_start.gif");
  const [startAnimation, setStartAnimation] = useState("coin_start.gif");
  const updateBalance = useBalanceStore((state) => state.updateBalance);

  useEffect(() => {
    if (loading) {
      setTimeout(() => {
        setStartAnimation("coin flip.mp4");
        // playFlipingSideLongAudio();
        
      }, 100);
    }

    const currentBalance = GetCookie("balance");
    if (currentBalance != "") {
      setBalance(
        Math.round((parseFloat(currentBalance) + Number.EPSILON) * 100) / 100
      );
    }
    
    if(loading) {
        // @ts-ignore
        audioRef.current.play();
    } else {
      // @ts-ignore
      audioRef.current.pause();
    }
  }, [loading]);

  useEffect(() => {
    updateBalance(balance);
  }, [balance]);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      setIdx((beforeIdx) => {
        return (beforeIdx + 1) % 3;
      });
    }, 200);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    (async () => {
      const profileData = await GetProfile();
      if (profileData.status == 200) setPoints(profileData.data.data.points);
    })();
  }, [loading]);

  const handleVerification = async() => {
    const _commitment = JSON.parse(GetCookie('commitment'));
    const _selection = JSON.parse(GetCookie('selection'));
    const _reveal = JSON.parse(GetCookie('reveal'));
    const userId = Number(GetCookie('userId'));
    console.log('@@@', _commitment, _selection, _reveal)
    const result = await verifyData(_commitment, _selection, _reveal);
    if (result == true){
      await updateState(userId, _commitment.gameNonce, result);
      setGameResult(0)
    }
  };

  const handleAddFundModal = () => {
    setShowAddFundModal(!showAddFundModal);
  };

  const handleUsernameModal = () => {
    setShowUsernameModal(!showUsernameModal);
  };

  const handleDepositModal = () => {
    setShowDepositModal(!showDepositModal);
  };

  const handleRecentModal = () => {
    playButtonAudio();
    setShowRecentModal(!showRecentModal);
  };

  const handleAcd = (val: number) => {
    setIsVerificationDisplaying(false);
    setAcd(val);
    setVerification(false);
    setGameResult(0);
  };

  const startGame = async (choice: boolean) => {
    setStart(true);
    setGameResult(0);
    setLoading(true);
    setLoadingStatus("started");
    setLoadingAnimation("coin start.mp4");
    setLoadingLoop(false);
    let { commitment, gameNonce } = await GetNonce();
    // SetCookie("commitment", commitment);
    SetCookie("gameNonce", gameNonce);
    const wallet = GetCookie("wallet");
    const winAnimations = ["among_us", "batman", "beach", "boombox", "chainsaw_man", "dance", "disco_ball", "dunk", "gigachad", "hadouken", "harry_potter", "karate_kid", "koopa", "lambo", "luffy", "mr_t", "nyancat", "one_punch", "over_9000", "pepe", "pickle_rick", "robocop", "rocket", "saiyan", "sommersault", "sonic", "spiderman"];
    const lostAnimations = ["among_us", "butt_kick", "cannon", "car", "chicken", "dickbutt", "duck_hunt", "dunk", "explode", "harry_potter", "headshot", "lightning", "mario_flower", "mario_shell", "pokeball", "punch", "rocket", "saiyan", "sommersault", "sonic", "soyjack", "spiderman"];

    const winRandom =
      winAnimations[Math.floor(Math.random() * winAnimations.length)];
    const lostRandom =
      lostAnimations[Math.floor(Math.random() * lostAnimations.length)];


    if (wallet == "xverse") {
      const { publicKey, signature } = await getXverseSign(gameNonce);
      console.log(signature)
      playLeverUpAudio();
      if (publicKey != "" && signature != "") {
        const { gameResponse, newBalance } = await gameReveal(
          gameNonce,
          choice,
          acd,
          publicKey,
          signature
        );
        setLoadingAnimation("coin drop.mp4");
        setLoadingStatus("ended");
        setLoadingLoop(false);
        if (gameResponse != undefined && newBalance != "0.00") {
            // setStartAnimation("coin drop.mp4");
            // setLoadingStatus("ended");
            setStartAnimation(
              `${gameResponse ? 'win' : 'lose'}_${gameResponse ? winRandom: lostRandom }.mp4`
            );
            if(gameResponse) {
              let winCount = Number(!!GetCookie('winCount') ? GetCookie('winCount') : 0);
              winCount+=1;
              setStreak(winCount);
              // @ts-ignore
              SetCookie('winCount', winCount);
              setCount(1000);
              setTimeout(() => {
                setCount(0)
              }, 1000);
            } else {
              // @ts-ignore
              SetCookie('winCount', 0);
            }
            setVerification(true)
            // setBalance(Math.round((parseFloat(newBalance) + Number.EPSILON) * 100) / 100);
            // setLoading(false);
            setGameResult(gameResponse ? 1 : 2);
            setBalance(
              Math.round((parseFloat(newBalance) + Number.EPSILON) * 100) / 100
            );
          SetCookie("balance", newBalance);
        } else {
          // setLoading(false);
          setGameResult(0);
          enqueueSnackbar("Balance too low", {
            variant: "error",
            anchorOrigin: { horizontal: "left", vertical: "top" },
          });
        }
      } else {
        setLoading(false);
      }
    } else if (wallet == "unisat") {
      const { publicKey, signature } = await signMessage(gameNonce);
      playLeverUpAudio();
      if (publicKey != "" && signature != "") {
        const { gameResponse, newBalance } = await gameReveal(
          gameNonce,
          choice,
          acd,
          publicKey,
          signature
        );
        setLoadingAnimation("coin drop.mp4");
        setLoadingStatus("ended");
        setLoadingLoop(false);
        if (gameResponse != undefined && newBalance != "0.00") {
            setStartAnimation(
              `${gameResponse ? 'win' : 'lose'}_${gameResponse ? winRandom : lostRandom}.mp4`
            );
            // setBalance(Math.round((parseFloat(newBalance) + Number.EPSILON) * 100) / 100);
            if(gameResponse) {
              setCount(1000);
              let winCount = Number(!!GetCookie('winCount') ? GetCookie('winCount') : 0);
              winCount+=1;
              setStreak(winCount);
              // @ts-ignore
              SetCookie('winCount', winCount);
              setTimeout(() => {
                setCount(0)
              }, 1000);
            } else {
              // @ts-ignore
              SetCookie('winCount', 0);
            }
            setVerification(true)
            setLoading(false);
            setGameResult(gameResponse ? 1 : 2);
            setBalance(
              Math.round((parseFloat(newBalance) + Number.EPSILON) * 100) / 100
            );
          SetCookie("balance", newBalance);
        } else {
          setLoading(false);
          setGameResult(0);
          enqueueSnackbar("Balance too low", {
            variant: "error",
            anchorOrigin: { horizontal: "left", vertical: "top" },
          });
        }
      } else {
        setLoading(false);
      }
    } else if (wallet == "leather") {
      const { publicKey, signature } = await getLeatherSignature(gameNonce);
      if (publicKey != "" && signature != "") {
        const { gameResponse, newBalance } = await gameReveal(
          gameNonce,
          choice,
          acd,
          publicKey,
          signature
        );
        setLoadingAnimation("coin drop.mp4");
        setLoadingStatus("ended");
        setLoadingLoop(false);
        if (gameResponse != undefined && newBalance != "0.00") {
            setStartAnimation(
              `${gameResponse ? 'win' : 'lose'}_${gameResponse ? winRandom : lostRandom}.mp4`
            );
            // setBalance(Math.round((parseFloat(newBalance) + Number.EPSILON) * 100) / 100);
            if(gameResponse) {
              let winCount = Number(!!GetCookie('winCount') ? GetCookie('winCount') : 0);
              winCount+=1;
              setStreak(winCount);
              // @ts-ignore
              SetCookie('winCount', winCount);
              setCount(1000);
              setTimeout(() => {
                setCount(0)
              }, 1000);
            } else {
              // @ts-ignore
              SetCookie('winCount', 0);
            }
            setVerification(true)
            // setLoading(false);
            setGameResult(gameResponse ? 1 : 2);
            setBalance(
              Math.round((parseFloat(newBalance) + Number.EPSILON) * 100) / 100
            );
          SetCookie("balance", newBalance);
        } else {
          setLoading(false);
          setGameResult(0);
          enqueueSnackbar("Balance too low", {
            variant: "error",
            anchorOrigin: { horizontal: "left", vertical: "top" },
          });
        }
      } else {
        setLoading(false);
      }
    }


    setCanShow(false);
    playLeverUpAudio();
    setStart(false);
  };

  return (
    <>
      <div>
        {
          // @ts-ignore
          <audio src="/static/audio/fliping_side_long.mp3" ref={audioRef} loop/>
        }
      </div>
      <section className="btns-wrapper">
        <div className="result h-100">
        <div className='crt'></div>
          {
            (!isVerificationDisplaying) && <div className="xp-points">
              <span>{"0000000".substring(0, 7 - points.toString().length)}</span>{points}
              <span style={{ color: '#f3bf00', verticalAlign: 'super', fontSize: '57%' }}>XP</span>

            </div>
          }
          { 
            gameResult == 1 && canShow && (
              streak >= 2 && <div className="streak">streak:{streak}</div>
            )
          }
          {(!loading && gameResult == 0 && isVerificationDisplaying) && (
            <video
              className="verification-video"
              preload="metadata"
              autoPlay
              style={{ }}
              onEnded={() => {
                setVerification(!verification)
                setIsVerificationDisplaying(false);
              }}
              src={`/static/videos/verification.mov`}
              playsInline
            />
          )}
          {(loading) && (
            <video
              preload="metadata"
              width=""
              height="auto"
              margin-top="24px"
              onEnded={()=>{
                if(loadingStatus == "started") {
                  setLoadingStatus('loading');
                  setLoadingLoop(true);
                  setLoadingAnimation("coin flip.mp4");
                }

                if(loadingStatus == "ended") {
                  // alert()
                  setLoadingStatus('started');
                  setLoadingAnimation("coin start.mp4");
                  setLoading(false);
                }
              }}
              autoPlay
              loop={loadingLoop}
              style={{ marginTop: '25px' }}
              src={`/static/animations/${loadingAnimation}`}
              muted={loadingStatus == "loading"}
              playsInline
            />
          )}
          {
            !loading &&
            (gameResult == 1 ? (
              <>
                <video
                  preload="metadata"
                  width=""
                  height="auto"
                  margin-top="24px"
                  onEnded={()=>{
                    setCanShow(true);
                  }}
                  autoPlay
                  style={{ marginTop: '25px' }}
                  src={`/static/animations/${startAnimation}`}
                  playsInline
                />
                {
                  canShow && (<div className="result__desc">
                    <h2 className="result__title">{status.toUpperCase()}</h2>
                    <div className="result__subtitle text-success">+{acd} ΛRC</div>
                  </div>)
                }
                
              </>
            ) : gameResult == 2 ? (
              <>
                  <video
                    preload="metadata"
                    width=""
                    height="auto"
                    margin-top="24px"
                    autoPlay
                    onEnded={()=>{
                      setCanShow(true);
                    }}
                    style={{ marginTop: '25px' }}
                    src={`/static/animations/${startAnimation}`}
                    playsInline
                />
                {
                  canShow && (<div className="result__desc">
                    <h2 className="result__title">
                      {(status === "heads" ? "tails" : "heads").toUpperCase()}
                    </h2>
                    <div className="result__subtitle text-alert">-{acd} ΛRC</div>
                  </div>)
                }
              </>
            ) : (
              <>{
                !loading && !isVerificationDisplaying && 
                <video
                    preload="metadata"
                    width=""
                    height="auto"
                    margin-top="24px"
                    autoPlay={true}
                    loop
                    muted
                    style={{ marginTop: '25px' }}
                    src={`/static/animations/flip Y.mp4`}
                    playsInline
                />
              }
              </>
            ))
          }
        </div>
        <div className="btns-inner-wrapper">
          <div className="btns-control">
            <div className="btns-control-left">
              <div className="btns-row mt-30">
                <button
                  className={`btns-row-item ${
                    status == "heads" && "btns-row-item-active"
                  }`}
                  id="head-btn"
                  disabled={loading}
                  onClick={() => {
                    playButtonAudio();
                    setGameResult(0);
                    setStatus("heads");
                    setVerification(false);
                    setIsVerificationDisplaying(false);
                  }}
                >
                  <img
                    className="btn-white__avatar"
                    src={`/static/img/heads${
                      status == "heads" ? "_active" : "_disable"
                    }.png`}
                    alt="head icon"
                  />
                </button>
                <button
                  className={`btns-row-item ${
                    status == "tails" && "btns-row-item-active"
                  }`}
                  disabled={loading}
                  onClick={() => {
                    playButtonAudio();
                    setGameResult(0);
                    setStatus("tails");
                    setVerification(false);
                    setIsVerificationDisplaying(false);
                  }}
                >
                  <img
                    className="btn-white__avatar"
                    src={`/static/img/tails${
                      status == "tails" ? "_active" : "_disable"
                    }.png`}
                    alt="tail icon"
                  />
                </button>
              </div>
              <div className="btns-grid mt-30">
                <button
                  disabled={loading}
                  className={`btn-outline btn-outline--medium ${
                    acd == 0.1 && "btn-outline--medium-active"
                  }`}
                  onClick={() => {
                    playButtonAudio();
                    handleAcd(0.1);
                  }}
                >
                  <span>0.1</span>
                </button>
                <button
                  disabled={loading}
                  className={`btn-outline btn-outline--medium ${
                    acd == 0.25 && "btn-outline--medium-active"
                  }`}
                  onClick={() => {
                    playButtonAudio();
                    handleAcd(0.25);
                  }}
                >
                  <span>0.25</span>
                </button>
                <button
                  disabled={loading}
                  className={`btn-outline btn-outline--medium ${
                    acd == 0.5 && "btn-outline--medium-active"
                  }`}
                  onClick={() => {
                    playButtonAudio();
                    handleAcd(0.5);
                  }}
                >
                  <span>0.5</span>
                </button>
                <button
                  disabled={loading}
                  className={`btn-outline btn-outline--medium ${
                    acd == 1 && "btn-outline--medium-active"
                  }`}
                  onClick={() => {
                    playButtonAudio();
                    handleAcd(1);
                  }}
                >
                  <span>1</span>
                </button>
                <button
                  disabled={loading}
                  className={`btn-outline btn-outline--medium ${
                    acd == 2 && "btn-outline--medium-active"
                  }`}
                  onClick={() => {
                    playButtonAudio();
                    handleAcd(2);
                  }}
                >
                  <span>2</span>
                </button>
                <button
                  disabled={loading}
                  className={`btn-outline btn-outline--medium ${
                    acd == 3 && "btn-outline--medium-active"
                  }`}
                  onClick={() => {
                    playButtonAudio();
                    handleAcd(3);
                  }}
                >
                  <span>3</span>
                </button>
              </div>
            </div>
            <div className="btns-control-right">
              <div
                className={`switch ${start ? "active" : ""}`}
                onClick={() => {
                  if(start) 
                    return;
                  playLeverDownAudio();
                  setFirst(false);
                  setVerification(false)
                  setIsVerificationDisplaying(false);
                  if (status == "heads") {
                    startGame(true);
                  }

                  if (status == "tails") {
                    startGame(false);
                  }
                }}
              >
                <img
                  className="switch-fix"
                  src="/static/img/switch_fix.png"
                  alt="switch"
                />
                <img
                  className="switch-node"
                  src="/static/img/switch_node.png"
                  alt="switch"
                />
                <img
                  className="switch-ball"
                  src="/static/img/switch_ball.png"
                  alt="switch"
                />
              </div>
              <img src={`/static/img/arrow_${idx + 1}.png`} alt="switch" />
            </div>
          </div>
          <div
            className={`btns-verification ${
              !loading && !first && verification && "btns-verification-active"
            }`}
            onClick={() => {
              verification && handleVerification();
              verification && setIsVerificationDisplaying(true);
            }}
          >
            <div className="btns-verification-icon">
              <img
                src={`/static/img/${
                  !loading && !first && verification ? "tick_active.png" : "tick_inactive.png"
                }`}
              />
            </div>
            <span>VERIFY</span>
          </div>
        </div>

        <RecentFlickersModal
          show={showRecentModal}
          handleModal={handleRecentModal}
          tableData={data}
        />
        <AddFundModal
          show={showAddFundModal}
          handleModal={handleAddFundModal}
        />
      </section>
    </>
  );
};

export default FlipCoinContent;
