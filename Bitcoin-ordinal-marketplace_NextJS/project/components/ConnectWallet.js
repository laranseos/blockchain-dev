import React, { useState, useReducer } from 'react';
import { useSelector, useDispatch } from 'react-redux';

export default function ConnectWallet() {

  const wallet = useSelector(state => state.wallet);
  const dispatch = useDispatch();

  const connectWallet = async () => {
    if (typeof window.unisat == 'undefined') {
      alert("Please install unisat wallet");
    }
    else {
      try {
        let accounts = await window.unisat.requestAccounts();
        dispatch({ type: "SET_ADDRESS", data: accounts[0] });
        console.log('connect success', accounts);
      } catch (e) {
        console.log('connect failed');
      }
    }
  }
  return (
    <div className="d-flex gap-3 align-content-center align-items-center">
      <button type="button" className="btn btn-primary" onClick={() => { connectWallet() }}>Connect Wallet</button>
      {
        wallet.walletAddress != "" ? <div>{wallet.walletAddress}</div> : <></>
      }
    </div>
  )
}
