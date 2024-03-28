import axios from 'axios';
import bitcore from 'bitcore-lib';
import { verifyMessageSignatureRsv } from '@stacks/encryption';
import ecc from '@bitcoinerlab/secp256k1';
import crypto from 'crypto';
import { Buffer } from 'buffer';
import GetCookie from "@/hooks/cookies/getCookie";
const val = GetCookie('userId');

import { ECPairFactory } from 'ecpair';

const ECPair = ECPairFactory(ecc);

let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://ordinals.com/content/74c221cc1cb7fef53220075d2c14fc9d7ab29d8b11e38db3dd5dd7b95bac515di0`,
    headers: {
        'Accept': 'application/json'
    }
};

// Known good hash of the code
const knownGoodHash = '61280f5a8410aa90c2b284b7b5da89519c01fa9dc525ea65a381fc22130bce4e';

export const verifyData = async(commitment: any, selection: any, reveal: any) => {
    let result:boolean = false
    await axios.request(config)
        .then(async (response: any) => {
            // Compute the hash of the fetched code
            const fetchedCode = response.data;
            const hash = crypto.createHash('sha256').update(fetchedCode).digest('hex');
            // Compare the hash to the known good hash
            // If they match, then execute the code
            if (knownGoodHash === hash) {
                const generatedFunction = new Function('commitment', 'selection', 'reveal', 'bitcore', 'verifyMessageSignatureRsv', 'ECPair', 'Buffer', fetchedCode);
                result = await generatedFunction(commitment, selection, reveal, bitcore, verifyMessageSignatureRsv, ECPair, Buffer);
                console.log(result)
            }
        })
        .catch((error: any) => {
            console.error('An error occurred:', error);
        });
    return result
}

export const updateState = async (userId: Number, gameNonce: string, status: boolean) => {
    return await axios.post(`https://flickthebean.onrender.com/verification/update_state`, {
      userId: userId,  
      gameNonce: gameNonce,
      status: status
    }).then(function (res) {
      return res;
    }).catch(function (error) {
      console.log(error.toJSON());
    });
}

export const getPastVerification = async (userId: Number, gameNonce: string) => {
    return await axios.post(`https://flickthebean.onrender.com/verification`, {
      userId: userId,  
      gameNonce: gameNonce,
      status: false
    }).then(function (res) {
      return res;
    }).catch(function (error) {
      console.log(error.toJSON());
    });
}