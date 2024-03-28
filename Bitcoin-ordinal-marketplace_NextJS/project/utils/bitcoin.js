'use client'
import { networks, initEccLib } from "bitcoinjs-lib";
// console.log(bitcoin);
let network = networks.testnet;
// let network = isProduction ? bitcoin.networks.bitcoin : bitcoin.networks.testnet;

export const btcToSat = (btc) => {
    return Math.floor(Number(btc) * Math.pow(10, 8))
}

export const satToBtc = (sat) => {
    return Number(sat) / Math.pow(10, 8)
}

export const modulesInitializedPromise = new Promise(resolve => {
    const interval = setInterval(() => {
        if (window.bitcoin && window.secp256k1 && window.connect) {
            initEccLib(secp256k1)
            installedWalletName = getInstalledWalletName()
            isWalletInstalled = Boolean(getInstalledWalletName())
            if (isWalletInstalled) {
                [...document.getElementsByClassName('btnsSignWithWallet')].map(el => el.style.display = 'revert');
                [...document.getElementsByClassName('walletName')].map(el => el.textContent = installedWalletName);
            } else {
                [...document.getElementsByClassName('walletSuggestions')].map(el => el.style.display = 'revert');
                [...document.getElementsByClassName('walletsList')].map(el => el.innerHTML = walletsListHtml);
            }
            if (installedWalletName == 'Hiro') {
                connectAppConfig = new connect.AppConfig(['store_write', 'publish_data']);
                connectUserSession = new connect.UserSession({ connectAppConfig });
            }
            console.log("Bitcoin initialized.");
            clearInterval(interval)
            resolve()
        }
    }, 50)
})

export const generateSalePsbt = async (output, price, owner) => {
    let generatedPsbt = await generatePSBTListingInscriptionForSale(utx0, btcToSat(price), owner)
    return generatedPsbt;
}

const generatePSBTListingInscriptionForSale = async (ordinalOutput, price, paymentAddress) => {
    let psbt = new bitcoin.Psbt({ network });

    const [ordinalUtxoTxId, ordinalUtxoVout] = ordinalOutput.split(':')
    const tx = bitcoin.Transaction.fromHex(await getTxHexById(ordinalUtxoTxId))
    if (installedWalletName != 'Hiro') {
        for (const output in tx.outs) {
            try { tx.setWitness(parseInt(output), []) } catch { }
        }
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

export const processSellerPsbt = async (_sellerSignedPsbt) => {
    const sellerSignedPsbtBase64 = (_sellerSignedPsbt || '').trim().replaceAll(' ', '+')
    if (sellerSignedPsbtBase64) {
        sellerSignedPsbt = bitcoin.Psbt.fromBase64(sellerSignedPsbtBase64, { network })
        const sellerInput = sellerSignedPsbt.txInputs[0]
        const sellerSignedPsbtInput = `${sellerInput.hash.reverse().toString('hex')}:${sellerInput.index}`

        if (sellerSignedPsbtInput != inscription.output) {
            throw `Seller signed PSBT does not match this inscription\n\n${sellerSignedPsbtInput}\n!=\n${inscription.output}`
        }

        if (sellerSignedPsbt.txInputs.length != 1 || sellerSignedPsbt.txInputs.length != 1) {
            throw `Invalid seller signed PSBT`
        }

        const sellerOutput = sellerSignedPsbt.txOutputs[0]
        price = sellerOutput.value
        const sellerOutputValueBtc = satToBtc(price)
        const sellPriceText = `${sellerOutputValueBtc} BTC ($${(sellerOutputValueBtc * await bitcoinPrice).toFixed(2)})`
        document.getElementById('btnBuyInscriptionNow').style.display = 'revert'
        document.getElementById('btnBuyInscriptionNow').textContent = `Buy Inscription ${inscriptionNumber} Now For ${sellPriceText}`

        for (const span of document.getElementsByClassName('price')) {
            span.textContent = sellPriceText;
        }
    }
}