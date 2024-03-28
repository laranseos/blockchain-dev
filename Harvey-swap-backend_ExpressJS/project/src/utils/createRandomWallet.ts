import { ethers } from "ethers";
import crypto from "crypto";

export default (fromCurrency: string) => {
    console.log(fromCurrency);
    
    let walletAddress: string = "";
    let privateKey: string = "0x" + crypto.randomBytes(32).toString('hex');
    switch(fromCurrency) {
        case "eth":
            let wallet = new ethers.Wallet(privateKey);
            walletAddress = wallet.address;
            break;
        default:
            break;
    }
    return {
        privateKey, walletAddress
    }
}