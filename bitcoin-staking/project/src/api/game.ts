import GetCookie from "@/hooks/cookies/getCookie";
import axios from "axios";
import { handleUnisat } from "../components/play-modal/unisat";
import SetCookie from "@/hooks/cookies/setCookie";

export const GetNonce = async () => {
  const val = GetCookie('userId');
  const userId = parseInt(val != '' ? val : '0');
  if(userId !=  0) {
    return await axios.post('https://flickthebean.onrender.com/game/commitment', {
      userId: userId,
    }).then(function (res) {
      const {
        commitment, 
        gameNonce,
      } = res.data.data;
      
      SetCookie("commitment", JSON.stringify({
        gameTimestamp: Date.now(),
        gameNonce,
        commitment,
      }));
      return res.data.data;
    }).catch(function (error) {
      console.log(error.toJSON());
    });
  } else {
    await handleUnisat()
  }
}

export const gameReveal = async (gameNonce: string, choice: boolean, amount: number, publicKey: string, sign: string) => {
  return await axios.post('https://flickthebean.onrender.com/game/reveal', {
    gameNonceReceived: gameNonce,
    choice: choice,
    amount: amount,
    userPublicKey: publicKey,
    signedMessage: sign
  }).then(function (res) {
    SetCookie("selection", JSON.stringify({
      selectionTimestamp: Date.now(),
      gameNonce,
      choice,
      amount,
      userPublicKey: publicKey,
      signedGameNonce: sign,
    }));
    SetCookie("reveal", JSON.stringify({
      gameTimestamp: Date.now()+100,
      gameNonce: res.data.gameNonce,
      vrn: res.data.vrn,
      secretNonce: res.data.secretNonce,
      outcomeHash: res.data.outcomeHash,
      outcomeString: res.data.outcomeString, 
      didWin: res.data.didWin
    }));
    return { gameResponse: res.data.didWin, newBalance: res.data.newBalance }
  }).catch(function (error) {
    console.log(error.toJSON());
    return  { gameResponse: false, newBalance: "0.00" }
  });
}