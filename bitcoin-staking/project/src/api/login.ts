import GetCookie from "@/hooks/cookies/getCookie";
import SetCookie from "@/hooks/cookies/setCookie";
import axios from "axios";

export const login = async (sign: string, publicKey: string, message: string, hash:string) => {
  const refCode = GetCookie('refCode');
  return await axios.post(`https://flickthebean.onrender.com/login${refCode != '' ? '?ref=' + refCode : ''}`, {
    hash: hash,
    value: message,
    userPublicKey: publicKey,
    signedMessage: sign,
    userName: "name"
  }).then(function (res) {
    SetCookie('balance', res.data.data.balance);
    // @ts-ignore
    SetCookie('isLogin', true);
    return  {
      userId: res.data.data.userId && res.data.data.userId,
      newUser: res.data.data.newUser && res.data.data.newUser
    };
  }).catch(function (error) {
    console.log(error.toJSON());
  });
}