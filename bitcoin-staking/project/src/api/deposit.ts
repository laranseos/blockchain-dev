import GetCookie from "@/hooks/cookies/getCookie";
import axios from "axios";

export const DepositBTC = async (txnId: string, address: string) => {
  const val = GetCookie('userId');
  const userId = parseInt(val != '' ? val : '0');
  return await axios.post('https://flickthebean.onrender.com/exchange/deposit_btc', {
    userId: userId,
    transactionId: txnId,
    address: address,
  })
}