'use client'
import React, { useState, useEffect } from 'react';
import toastr from "toastr";
import { useSelector } from 'react-redux';
import { addDocument } from '@/utils/addData';
let isProduction = false;
// let network = isProduction ? bitcoin.networks.bitcoin : bitcoin.networks.testnet;
// const baseMempoolUrl = isProduction ? "https://mempool.space" : "https://mempool.space/signet"
const baseMempoolUrl = isProduction ? "https://mempool.space" : "https://mempool.space/testnet"
const networkName = isProduction ? "mainnet" : "signet"
const baseMempoolApiUrl = `${baseMempoolUrl}/api`
const bitcoinPriceApiUrl = "https://blockchain.info/ticker?cors=true";
let bitcoinPrice = fetch(bitcoinPriceApiUrl)
  .then(response => response.json())
  .then(data => data.USD.last)

let txHexByIdCache = {};

export default function MyOrdinals() {

  const wallet = useSelector(state => state.wallet);

  const [ordinals, setOrdinals] = useState([]);

  const [number, setNumber] = useState(0);
  const [id, setId] = useState("");
  const [owner, setOwner] = useState("");
  const [utx0, setUtx0] = useState("");
  const [utx0Value, setUtx0Value] = useState("");
  const [price, setPrice] = useState(0);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Init bitcoin library
  //--------------------------------------------------
  useEffect(() => {
    modulesInitializedPromise
  }, []);

  const modulesInitializedPromise = new Promise(resolve => {
    const interval = setInterval(() => {
      if (window.bitcoin && window.secp256k1 && window.connect) {
        console.log("Bitcoin initializing...");
        bitcoin.initEccLib(secp256k1)
        console.log("Bitcoin initialized.");
        clearInterval(interval);
        resolve()
      }
    }, 50)
  })
  //---------------------------------------------------

  useEffect(() => {
    if (wallet.walletAddress != "") {
      getMyOrdinals();
    }
  }, [wallet]);

  const getMyOrdinals = () => {
    if (wallet.walletAddress !== "") {
      setLoading(true);
      // Get the balance
      fetch("/unisat-testnet/balance?address=tb1p9ezp89vf0p3p0xvcdz60n9m3lylf4wehw0wvtfgfdt9r0tj349yq6vk5q3")
        .then(response => {
          return response.json();
        })
        .then(data => {
          console.log(data.result);
        })
      // get Inscriptions
      fetch(`/unisat-testnet/inscriptions?address=${wallet.walletAddress}&cursor=0&size=1000`)
        .then(response => {
          return response.json();
        })
        .then(data => {
          console.log(data.result);
          setOrdinals(data.result.list)
          setLoading(false)
        })
    };
  }

  const handleDetailView = async item => {
    setVisible(true);
    setNumber(item.inscriptionNumber);
    setId(item.inscriptionId);
    setOwner(item.address);
    setUtx0(item.output);
    setUtx0Value(item.outputValue / Math.pow(10, 8) + "BTC" + `($${(utx0Value * await bitcoinPrice).toFixed(2)})`);
  }

  const handleClickSell = async () => {
    let price = 0;
    let inputText = prompt("Please enter price:", "0");
    price = parseFloat(inputText);
    price *= Math.pow(10, 8)
    let psbtBase64 = await generatePSBTListingInscriptionForSale(utx0, price, wallet.walletAddress);
    let signedPsbt = await signPSBTUsingWallet(psbtBase64);
    let item = {
      owner, price, psbt: psbtBase64,
      inscriptionNumber: number, utxo: utx0,
      utx0Value: utx0Value
    }
    const { result, error } = await saveOrdinalToFirebase(item);
    if (!error) {
      setOrdinals(ordinals.filter(item => item.inscriptionId !== id));
      setVisible(false);
      toastr.success("Succcessfully sold.");
    } else {
      console.log(error);
      toastr.error("An error has corrupted.");
    }
  }

  async function generatePSBTListingInscriptionForSale(ordinalOutput, price, paymentAddress) {
    let network = bitcoin.networks.testnet;
    let psbt = new bitcoin.Psbt({ network });

    const [ordinalUtxoTxId, ordinalUtxoVout] = ordinalOutput.split(':')
    const tx = bitcoin.Transaction.fromHex(await getTxHexById(ordinalUtxoTxId))
    for (const output in tx.outs) {
      try { tx.setWitness(parseInt(output), []) } catch { }
    }

    const input = {
      hash: ordinalUtxoTxId,
      index: parseInt(ordinalUtxoVout),
      nonWitnessUtxo: tx.toBuffer(),
      witnessUtxo: tx.outs[ordinalUtxoVout],
      sighashType: bitcoin.Transaction.SIGHASH_SINGLE | bitcoin.Transaction.SIGHASH_ANYONECANPAY,
    }


    psbt.addInput(input);

    psbt.addOutput({
      address: paymentAddress,
      value: price,
    });

    return psbt.toBase64();
  }

  const getTxHexById = async (txId) => {
    if (!txHexByIdCache[txId]) {
      txHexByIdCache[txId] = await fetch(`${baseMempoolApiUrl}/tx/${txId}/hex`)
        .then(response => response.text())
    }

    console.log(txHexByIdCache[txId]);

    return txHexByIdCache[txId]
  }
  const base64ToHex = (str) => {
    return atob(str).split("")
      .map(c => c.charCodeAt(0).toString(16).padStart(2, "0"))
      .join("");
  }

  async function signPSBTUsingWallet(psbtBase64) {
    return await unisat.signPsbt(base64ToHex(psbtBase64))
  }

  async function signPSBTUsingWalletAndBroadcast(psbtBase64) {

    try {
      const signedPsbtHex = await signPSBTUsingWallet(psbtBase64)
      const signedPsbt = bitcoin.Psbt.fromHex(signedPsbtHex)
      const txHex = signedPsbt.extractTransaction().toHex()
      const res = await fetch(`${baseMempoolApiUrl}/tx`, { method: 'post', body: txHex })
      if (res.status != 200) {
        return alert(`Mempool API returned ${res.status} ${res.statusText}\n\n${await res.text()}`)
      }

      const txId = await res.text()
      alert('Transaction signed and broadcasted to mempool successfully')
      window.open(`${baseMempoolUrl}/tx/${txId}`, "_blank")
    } catch (e) {
      console.error(e)
      alert(e?.message || e)
    }
  }

  async function saveOrdinalToFirebase(data) {
    return await addDocument("ordinals", id, data);
  }

  return (
    <div className='row'>

      {
        loading ? <div className="spinner-border text-primary text-center" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
          : ordinals.map(item => {
            return <div className='col-md-3 mt-3' key={item.inscriptionNumber}>
              <div className="card" style={{ height: "400px" }}>
                <iframe src={`https://static-testnet.unisat.io/preview/${item.inscriptionId}`} width="100%" height="70%" scrolling="no"></iframe>
                <div className="card-body text-center">
                  <p className="card-text">Inscription #{item.inscriptionNumber}</p>
                  <button className='btn btn-primary' onClick={() => handleDetailView(item)}>Detail view</button>
                </div>
              </div>
            </div>
          })
      }
      <div className={`modal modal-lg fade${visible ? " show" : ''}`} tabIndex="-1" style={{ display: `${visible ? "block" : 'none'}` }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content bg-white">
            <div className="modal-header">
              <h5 className="modal-title">{`Inscription #${number}`}</h5>
              <button type="button" className="btn-close" onClick={() => setVisible(false)}></button>
            </div>
            <div className="modal-body">
              <div className='text-center'>
                <iframe src={`https://static-testnet.unisat.io/preview/${id}`} width="80%" scrolling="no"></iframe>
              </div>
              <div className="mb-3">
                <label htmlFor="id" className="form-label">ID</label>
                <input type="text" className="form-control" id="id" placeholder="ID" value={id} readOnly />
              </div>
              <div className="mb-3">
                <label htmlFor="id" className="form-label">Owner</label>
                <input type="text" className="form-control" id="Owner" placeholder="Owner" value={owner} readOnly />
              </div>
              <div className="mb-3">
                <label htmlFor="id" className="form-label">UTXO</label>
                <input type="text" className="form-control" id="UTXO" placeholder="UTXO" value={utx0} readOnly />
              </div>
              <div className="mb-3">
                <label htmlFor="id" className="form-label">UTXO Value</label>
                <input type="text" className="form-control" id="UTXO_Value" placeholder="UTXO Value" value={utx0Value} readOnly />
              </div>
              <div className='mb-3 d-flex gap-3 justify-content-center'>
                <button type="button" className="btn btn-warning" onClick={() => handleClickSell()}>Sell</button>
                <button type="button" className="btn btn-secondary" onClick={() => setVisible(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
