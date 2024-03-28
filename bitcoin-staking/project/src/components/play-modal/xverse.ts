import { login } from '@/api/login';
import bitcore from 'bitcore-lib';
import crypto from 'crypto';
import { enqueueSnackbar } from 'notistack';
import { getAddress, signMessage } from 'sats-connect';
import GetCookie from '@/hooks/cookies/getCookie';
import SetCookie from '@/hooks/cookies/setCookie';

export const handleXverse = async () => {
  let message = crypto.randomBytes(16).toString('hex');
  let hash = bitcore.crypto.Hash.sha256(Buffer.from(message)).toString('hex');
  let address = '';
  let publicKey = '';

  const getAddressOptions = {
    payload: {
      purposes: ['payment'],
      message: hash,
      network: {
        type: 'Testnet'
      },
    },
    onFinish: (response: any) => {
      address = response.addresses[0].address;
      publicKey = response.addresses[0].publicKey;
      SetCookie('address', address);
    },
    onCancel: () => enqueueSnackbar('Dismissed', { variant: 'error', anchorOrigin: { horizontal: 'left', vertical: 'top' } }),
  };

  // @ts-ignore
  await getAddress(getAddressOptions);

  // Now use the separate function to sign the message
  const sign = await signMessageFunc(address, hash);
  if (sign != '') {
    let {
      // @ts-ignore
      userId = '',
      // @ts-ignore
      newUser = false,
    } = await login(sign, publicKey, message, hash);
    if (userId != '') {
      // @ts-ignore
      SetCookie('userId', userId);
      SetCookie('sign', sign);
      SetCookie('publicKey', publicKey);
      SetCookie('wallet', 'xverse');
      // TODO improve this
      return {
        flag: true,
        payload: {
          newUser,
          userId,
        }
      };
    }
  }

  return {
    flag: false,
    payload: {
      newUser: false,
      userId: 0,
    }
  };
};

export const signMessageFunc = async (address: any, hash: any) => {
  let sign = '';


  const signMessageOptions = {
    payload: {
      network: {
        type: "Testnet",
      },
      address: address,
      message: hash,
    },
    onFinish: (response: any) => {
      // signature
      sign = response;
    },
    onCancel: () => enqueueSnackbar('Dismissed', { variant: 'error', anchorOrigin: { horizontal: 'left', vertical: 'top' } }),
  };
  try {
    // @ts-ignore
    await signMessage(signMessageOptions);
  } catch (error) {
    console.log(error);
  }

  return sign;
};


export const getXverseSign = async (value: string) => {
  const hash = bitcore.crypto.Hash.sha256(Buffer.from(value)).toString('hex');
  let address = GetCookie('address');
  let publicKey = GetCookie('publicKey');

  try {
    // Now use the separate function to sign the message
    const sign = await signMessageFunc(address, hash);

    if (publicKey != undefined && sign != undefined) {
      return { publicKey: publicKey, signature: sign }
    } else {
      return { publicKey: '', signature: '' }
    }
  } catch (error) {
    console.log(error);
    return { publicKey: '', signature: '' }
  }
};