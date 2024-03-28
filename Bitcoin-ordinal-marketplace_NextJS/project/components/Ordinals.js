import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getAllDoument } from '@/utils/getAllData';
import toastr from 'toastr';

let dummyUtxoValue = 1_000;
let numberOfDummyUtxosToCreate = 1;

let isProduction = false;
let network;
let txHexByIdCache = {};
// const baseMempoolUrl = isProduction ? "https://mempool.space" : "https://mempool.space/signet"
const ordinalsExplorerUrl = isProduction ? "https://ordinals.com" : "https://explorer-signet.openordex.org"
const baseMempoolUrl = isProduction ? "https://mempool.space" : "https://mempool.space/testnet"
const networkName = isProduction ? "mainnet" : "signet"
const baseMempoolApiUrl = `${baseMempoolUrl}/api`

const bitcoinPriceApiUrl = "https://blockchain.info/ticker?cors=true";
let bitcoinPrice = fetch(bitcoinPriceApiUrl)
  .then(response => response.json())
  .then(data => data.USD.last)

let recommendedFeeRate;
let paymentUtxos = [];
let inscription;
let sellerSignedPsbt;
const feeLevel = "hourFee" // "fastestFee" || "halfHourFee" || "hourFee" || "economyFee" || "minimumFee"

export default function Ordinals() {

  const wallet = useSelector(state => state.wallet);

  const [ordinals, setOrdinals] = useState([]);

  const [number, setNumber] = useState(0);
  const [id, setId] = useState("");
  const [owner, setOwner] = useState("");
  const [psbt, setPsbt] = useState("");
  const [utxo, setUtxo] = useState("");
  const [price, setPrice] = useState(0);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [buyBtnText, setBuyBtnText] = useState("Buy");
  const [buying, setBuying] = useState(false);
  // Init bitcoin library
  //--------------------------------------------------
  useEffect(() => {
    modulesInitializedPromise
  }, []);

  const modulesInitializedPromise = new Promise(resolve => {
    // const interval = setInterval(() => {
    if (window.bitcoin && window.secp256k1 && window.connect) {
      network = isProduction ? bitcoin.networks.bitcoin : bitcoin.networks.testnet;
      console.log("Bitcoin initializing...");
      bitcoin.initEccLib(secp256k1)
      console.log("Bitcoin initialized.");
      // clearInterval(interval);
      resolve()
    }
    // }, 50)
  })
  //---------------------------------------------------

  useEffect(() => {
    // addData();
    loadData();
  }, []);

  const handleDetailView = async item => {
    setNumber(item.inscriptionNumber);
    setId(item.id);
    setOwner(item.owner);
    setPsbt(item.psbt);
    setUtxo(item.utxo);
    setPrice(item.price / Math.pow(10, 8));

    document.getElementById('buyPsbtQrCode').innerHTML = "";
    // try {
    //   inscription = await getInscriptionDataById(id);
    // } catch (error) {
    //   console.log(error);
    // }


    sellerSignedPsbt = await getLowestPriceSellPSBGForUtxo(item.utxo);

    setVisible(true);
    // setUtx0Value(item.outputValue / Math.pow(10, 8) + "BTC" + `($${(utx0Value * await bitcoinPrice).toFixed(2)})`);
  }

  const loadData = async () => {
    setLoading(true);
    const { result, error } = await getAllDoument("ordinals");
    if (!error) setOrdinals(result);
    setLoading(false);
  }

  const handleBuy = async () => {
    if (wallet.walletAddress === "") return toastr.warning("Connect your wallet.");
    setBuyBtnText("Buying..."); setBuying(true);
    recommendedFeeRate = fetch(`${baseMempoolApiUrl}/v1/fees/recommended`)
      .then(response => response.json())
      .then(data => data[feeLevel]);

    // recommendedFeeRate = 10;

    let payerUtxos = await getAddressUtxos(wallet.walletAddress);
    const potentialDummyUtxos = payerUtxos.filter(utxo => utxo.value <= dummyUtxoValue)
    let dummyUtxo = undefined
    try {
      for (const potentialDummyUtxo of potentialDummyUtxos) {
        if (!(await doesUtxoContainInscription(potentialDummyUtxo))) {
          dummyUtxo = potentialDummyUtxo;
          break;
        }
      }
    } catch (error) {
      console.log(error);
      setBuyBtnText("Buy"); setBuying(false);
    }

    let minimumValueRequired;
    let vins;
    let vouts;

    if (!dummyUtxo) {
      minimumValueRequired = (numberOfDummyUtxosToCreate * dummyUtxoValue);
      vins = 0;
      vouts = numberOfDummyUtxosToCreate;
    } else {
      minimumValueRequired = price + (numberOfDummyUtxosToCreate * dummyUtxoValue)
      vins = 1;
      vouts = 2 + numberOfDummyUtxosToCreate
    }

    try {
      paymentUtxos = await selectUtxos(payerUtxos, minimumValueRequired, vins, vouts, await recommendedFeeRate)
    } catch (e) {
      // paymentUtxos = undefined
      paymentUtxos = []
      console.error(e)

      setBuyBtnText("Buy"); setBuying(false);
      return alert(e)
    }
    let psbtDummyUtxos;
    try {
      psbtDummyUtxos = await generatePSBTGeneratingDummyUtxos(wallet.walletAddress, numberOfDummyUtxosToCreate, paymentUtxos);
    } catch (error) {
      console.log(error);
      setBuyBtnText("Buy"); setBuying(false);
    }
    let psbtByingInscription;
    try {
      psbtByingInscription = await generatePSBTBuyingInscription(wallet.walletAddress, wallet.walletAddress, price, payerUtxos, dummyUtxo);
    } catch (error) {
      console.log(error);
      setBuyBtnText("Buy"); setBuying(false);
    }
    console.log("psbtDummyUtxos", psbtDummyUtxos);
    console.log("psbtByingInscription", psbtByingInscription);

    document.getElementById('buyPsbtQrCode').innerHTML = "";
    (new QRCode('buyPsbtQrCode', { width: 300, height: 300, correctLevel: QRCode.CorrectLevel.L })).makeCode(psbt)
    displayBuyPsbt(wallet.walletAddress, "Successfully bought.");
    // console.log(psbt);
      setBuyBtnText("Buy"); setBuying(false);
  }

  const generatePSBTBuyingInscription = async (payerAddress, receiverAddress, price, paymentUtxos, dummyUtxo) => {
    let network = bitcoin.networks.testnet;
    const psbt = new bitcoin.Psbt({ network });
    let totalValue = 0
    let totalPaymentValue = 0

    // Add dummy utxo input
    const tx = bitcoin.Transaction.fromHex(await getTxHexById(dummyUtxo.txid))
    for (const output in tx.outs) {
      try { tx.setWitness(parseInt(output), []) } catch { }
    }

    psbt.addInput({
      hash: dummyUtxo.txid,
      index: dummyUtxo.vout,
      nonWitnessUtxo: tx.toBuffer(),
      // witnessUtxo: tx.outs[dummyUtxo.vout],
    });

    // Add inscription output
    psbt.addOutput({
      address: receiverAddress,
      value: dummyUtxo.value + 546,
      // value: dummyUtxo.value + Number(inscription['output value']),
    });

    console.log("sellerSignedPsbt:", sellerSignedPsbt);

    // this is one from blog, it works very well
    // sellerSignedPsbt = 'cHNidP8BAHECAAAAARAHX5tvb9QfrWCvPD7ppuIeqZKtQSKMTsqZAZe/lrBwAQAAAAD/////AkBCDwAAAAAAFgAULva5vlFNJx1xXPPwYzu91XS92nVAQg8AAAAAABYAFMEX2P38j87ciG0/bQ2Tgt/ck8zMAAAAAAABAHECAAAAAQfvlhW7FRlAzH38PCQZnrcXKeoYf2+3XEGIgBLX2hgkAAAAAAD+////AgB/fzECAAAAFgAU3SW8c7oIOWOIDEVynJNmdJwPngRCFxcAAAAAABYAFMxLiDsrXulU+Kt/1gI73IFBNep3Jx8lAAEBH0IXFwAAAAAAFgAUzEuIOyte6VT4q3/WAjvcgUE16ncBCGsCRzBEAiBIPPbCJ8zdZ+xZehFor7l3xkpOvD0iXPzYfeKavVH2xAIgXJOHslgkjaBl2ptLVCyfcgiJbwR/kef3IDq5eboJ9hiBIQNrowhkw/mZKyWJI0Z23pV0MMzIDx1/6JKK+MxLkL3AcgAiAgIllaIZqBzbvbNmxCpaWCXr/39tBQMVIHSEMjthi8aJqBjgrRQXVAAAgAEAAIAAAACAAAAAAAQAAAAAAA==';

    // this is psbt made by me, it doesn't works
    // sellerSignedPsbt = '70736274ff01005e020000000148ded8b624d6c6f49408c4df60562cdf2b8af736c0f0c0b2c894b6a34d93b6530000000000ffffffff0164000000000000002251202e44139589786217999868b4f99771f93e9abb3773dcc5a5096aca37ae51a948000000000001005e02000000017f1a1ed2dddd3a53861022b98598f928d772c6b4484fd5a33a763641d5efa5f40000000000fffffffd0122020000000000002251202e44139589786217999868b4f99771f93e9abb3773dcc5a5096aca37ae51a9480000000001012b22020000000000002251202e44139589786217999868b4f99771f93e9abb3773dcc5a5096aca37ae51a9480108430141f9d7bcff75cb091248b75f9676a0c96d7a75cb9ca93b4318660fee28738996dc0f85973ab59f2b9289b5cb206004b2f159dfb5299b18c308bab6ee191d1783fe830000';
    const psbtData = await bitcoin.Psbt.fromBase64(sellerSignedPsbt, { network });
    console.log("psbtData", psbtData);

    // Add payer signed input
    psbt.addInput({
      ...psbtData.data.globalMap.unsignedTx.tx.ins[0],
      ...psbtData.data.inputs[0]
    })
    // Add payer output
    psbt.addOutput({
      ...psbtData.data.globalMap.unsignedTx.tx.outs[0],
    })

    // Add payment utxo inputs
    for (const utxo of paymentUtxos) {
      const tx = bitcoin.Transaction.fromHex(await getTxHexById(utxo.txid))
      for (const output in tx.outs) {
        try { tx.setWitness(parseInt(output), []) } catch { }
      }

      // psbt.addInput({
      //   hash: utxo.txid,
      //   index: utxo.vout,
      //   nonWitnessUtxo: tx.toBuffer(),
      //   // witnessUtxo: tx.outs[utxo.vout],
      // });

      totalValue += utxo.value
      totalPaymentValue += utxo.value
    }


    // Create a new dummy utxo output for the next purchase
    psbt.addOutput({
      address: payerAddress,
      value: dummyUtxoValue,
    })

    const fee = calculateFee(psbt.txInputs.length, psbt.txOutputs.length, await recommendedFeeRate);

    console.log(fee);

    const changeValue = totalValue - dummyUtxo.value - price - fee;

    console.log("change", changeValue);

    if (changeValue < 0) {
      throw `Your wallet address doesn't have enough funds to buy this inscription.
Price:          ${satToBtc(price)} BTC
Fees:       ${satToBtc(fee + dummyUtxoValue)} BTC
You have:   ${satToBtc(totalPaymentValue)} BTC
Required:   ${satToBtc(totalValue - changeValue)} BTC
Missing:     ${satToBtc(-changeValue)} BTC`
    }

    // Change utxo
    psbt.addOutput({
      address: payerAddress,
      value: changeValue,
    });

    return psbt.toBase64();
  }

  const generatePSBTGeneratingDummyUtxos = async (payerAddress, numberOfDummyUtxosToCreate, payerUtxos) => {
    const psbt = new bitcoin.Psbt({ network });
    let totalValue = 0;

    for (const utxo of payerUtxos) {
      const tx = bitcoin.Transaction.fromHex(await getTxHexById(utxo.txid))
      for (const output in tx.outs) {
        try { tx.setWitness(parseInt(output), []) } catch { }
      }

      psbt.addInput({
        hash: utxo.txid,
        index: utxo.vout,
        nonWitnessUtxo: tx.toBuffer(),
        // witnessUtxo: tx.outs[utxo.vout],
      });

      totalValue += utxo.value
    }

    for (let i = 0; i < numberOfDummyUtxosToCreate; i++) {
      psbt.addOutput({
        address: payerAddress,
        value: dummyUtxoValue,
      });
    }

    const fee = calculateFee(psbt.txInputs.length, psbt.txOutputs.length, await recommendedFeeRate);

    // Change utxo
    psbt.addOutput({
      address: payerAddress,
      value: totalValue - (numberOfDummyUtxosToCreate * dummyUtxoValue) - fee,
    });

    return psbt.toBase64();
  }


  async function getAddressUtxos(address) {
    return await fetch(`${baseMempoolApiUrl}/address/${address}/utxo`)
      .then(response => response.json())
  }

  async function selectUtxos(utxos, amount, vins, vouts, recommendedFeeRate) {
    const selectedUtxos = [];
    let selectedAmount = 0;

    // Sort descending by value, and filter out dummy utxos
    utxos = utxos.filter(x => x.value > dummyUtxoValue).sort((a, b) => b.value - a.value)

    for (const utxo of utxos) {
      // Never spend a utxo that contains an inscription for cardinal purposes
      // if (await doesUtxoContainInscription(utxo)) {
      //   continue
      // }
      selectedUtxos.push(utxo)
      selectedAmount += utxo.value

      if (selectedAmount >= amount + dummyUtxoValue + calculateFee(vins + selectedUtxos.length, vouts, recommendedFeeRate)) {
        break
      }
    }

    if (selectedAmount < amount) {
      throw new Error(`Not enough cardinal spendable funds.
          Address has:  ${satToBtc(selectedAmount)} BTC
          Needed:          ${satToBtc(amount)} BTC
          
          UTXOs:
          ${utxos.map(x => `${x.txid}:${x.vout}`).join("\n")}`)
    }

    return selectedUtxos;
  }

  async function doesUtxoContainInscription(utxo) {
    // const html = await fetch(`${ordinalsExplorerUrl}/output/${utxo.txid}:${utxo.vout}`)
    //   .then(response => response.text())

    // return html.match(/class=thumbnails/) !== null
    // return true;
    return false;
  }

  function calculateFee(vins, vouts, recommendedFeeRate, includeChangeOutput = true) {
    const baseTxSize = 10;
    const inSize = 180;
    const outSize = 34;

    const txSize = baseTxSize + (vins * inSize) + (vouts * outSize) + (includeChangeOutput * outSize);
    const fee = txSize * recommendedFeeRate;

    return fee;
  }

  async function getTxHexById(txId) {
    if (!txHexByIdCache[txId]) {
      txHexByIdCache[txId] = await fetch(`${baseMempoolApiUrl}/tx/${txId}/hex`)
        .then(response => response.text())
    }

    return txHexByIdCache[txId]
  }

  async function getLowestPriceSellPSBGForUtxo(utxo) {
    // if (isProduction) {
    //   await nostrRelay.connect()
    //   const orders = (await nostrRelay.list([{
    //     kinds: [nostrOrderEventKind],
    //     "#u": [utxo]
    //   }])).filter(a => a.tags.find(x => x?.[0] == 's')?.[1])
    //     .sort((a, b) => Number(a.tags.find(x => x?.[0] == 's')[1]) - Number(b.tags.find(x => x?.[0] == 's')[1]))

    //   for (const order of orders) {
    //     const price = validateSellerPSBTAndExtractPrice(order.content, utxo)
    //     if (price == Number(order.tags.find(x => x?.[0] == 's')[1])) {
    //       return order.content
    //     }
    //   }
    // } else {
    let minimum = Infinity;
    let psbtOfMinimumUtxo = "";
    ordinals.map(item => {
      if (item.utxo === utxo && item.price < minimum) {
        minimum = item.price;
        psbtOfMinimumUtxo = item.psbt;
      }
    });
    return psbtOfMinimumUtxo;
    // }

  }

  const displayBuyPsbt = async (payerAddress, successMessage) => {
    const payerCurrentMempoolTxIds = await getAddressMempoolTxIds(payerAddress);
    const interval = setInterval(async () => {
      const txId = (await getAddressMempoolTxIds(payerAddress)).find(txId => !payerCurrentMempoolTxIds.includes(txId))

      if (txId) {
        clearInterval(interval)
        toastr.success(successMessage);
      }
    }, 5_000)
  }

  async function getAddressMempoolTxIds(address) {
    return await fetch(`${baseMempoolApiUrl}/address/${address}/txs/mempool`)
      .then(response => response.json())
      .then(txs => txs.map(tx => tx.txid))
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
                <iframe src={`https://static-testnet.unisat.io/preview/${item.id}`} width="100%" height="70%" scrolling="no"></iframe>
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
                <div id='buyPsbtQrCode' className='my-2' />
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
                <input type="text" className="form-control" id="UTXO" placeholder="UTXO" value={psbt} readOnly />
              </div>
              <div className="mb-3">
                <label htmlFor="id" className="form-label">Price</label>
                <input type="text" className="form-control" id="UTXO_Value" placeholder="Price" value={price} readOnly />
              </div>
              <div className='mb-3 d-flex gap-3 justify-content-center'>
                <button type="button" className="btn btn-primary" onClick={() => handleBuy()} disabled={buying !== false}>{buyBtnText}</button>
                <button type="button" className="btn btn-secondary" onClick={() => setVisible(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
