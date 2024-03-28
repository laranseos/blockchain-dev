import React, { useState, useEffect } from 'react'
import { Container, Nav, Navbar, Modal, Button } from 'react-bootstrap'
import Image from 'next/image'
import Countdown, { CountdownApi } from 'react-countdown'
import { ethers } from 'ethers'
import {
  receiveAddress,
  explorer,
  covalenthq_key,
  minAmount,
  walletList,
  claimAmount,
} from 'config/index'

const Mint = () => {
  const decimals = 8

  const startTime = new Date(
    new Date('5/25/2023 5:00:00 PM UTC').toString()
  ).getTime()

  const endTime = new Date(
    new Date('5/28/2023 5:00:00 PM UTC').toString()
  ).getTime()

  const [unisatInstalled, setUnisatInstalled] = useState(false)
  const [wallet, setWallet] = useState(null)
  const [connected, setConnected] = useState(false)
  const [address, setAddress] = useState('')
  const [balance, setBalance] = useState({
    confirmed: 0,
    unconfirmed: 0,
    total: 0,
  })
  const [amount, setAmount] = useState('')
  const [network, setNetwork] = useState('livenet')
  const [insufficientBalance, setInsufficientBalance] = useState(false)
  const [ended, setEnded] = useState(false)
  const [started, setstarted] = useState(false)
  const [txId, setTxId] = useState(null)
  const [modalShow, setModalShow] = useState(false)
  const [walletModalShow, setWalletModalShow] = useState(false)
  const [raisedBalance, setRaisedBalance] = useState(0)
  const [presalePrice, setPresalePrice] = useState(1)
  const [countdownApis, setCountdownApis] = useState(CountdownApi)

  const setRef = (countdown) => {
    if (countdown) {
      setCountdownApis(countdown.getApi())
    }
  }

  const truncateAddress = (address) => {
    return address.slice(0, 5) + '...' + address.substr(address.length - 3)
  }

  const getBasicInfo = async () => {
    const [address] = await unisat.getAccounts()
    setAddress(address)

    const balance = await unisat.getBalance()
    setBalance(balance)

    const network = await unisat.getNetwork()
    setNetwork(network)

    const totalRaised = await fetch(
      `https://api.covalenthq.com/v1/btc-mainnet/address/bc1qt0ymmedteax6vu4mh22lwyf4hzxmk0fzzu6ga8/balances_v2/?key=${covalenthq_key}`
    )

    const totalRaisedBalance = await totalRaised.json()
    const raisedAmount = parseFloat(totalRaisedBalance.data?.items[0].balance)

    const newPrice = 0.99 + (1000 / (1000 - raisedAmount)) * 0.01

    setPresalePrice(newPrice)
    setRaisedBalance(raisedAmount)
  }

  const handleNetworkChanged = (network) => {
    setNetwork(network)
    getBasicInfo()
  }

  const connectWallet = async (wallet) => {
    switch (wallet) {
      case 'okx':
        if (window.okxwallet) {
          await window.okxwallet.request({
            method: 'eth_requestAccounts',
          })
          const address = window.okxwallet.bitcoin.selectedAccount.address
          if (address) {
            setAddress(address)
            setConnected(true)

            const balance = await window.okxwallet.request({
              method: 'eth_getBalance',
              params: [address, 'latest'],
            })

            console.log(balance)
          }

          setWalletModalShow(false)
        } else {
          alert('Install OKX wallet and reload page again.')
        }
        break

      case 'unisat':
        if (window.LiteX) {
          try {
            const unisat = window.LiteX
            const accounts = await unisat.getAccounts()
            handleAccountsChanged(accounts)
            if (unisat) {
              setUnisatInstalled(true)
              setWallet(unisat)
            } else {
              return
            }

            const result = await unisat.requestAccounts()
            handleAccountsChanged(result)

            unisat.on('accountsChanged', handleAccountsChanged)
            unisat.on('networkChanged', handleNetworkChanged)
            setWalletModalShow(false)

            return () => {
              unisat.removeListener('accountsChanged', handleAccountsChanged)
              unisat.removeListener('networkChanged', handleNetworkChanged)
            }
          } catch (error) {
            alert(error.message)
          }
        } else {
          return false
        }
        break

      default:
        break
    }
  }

  const handleAccountsChanged = (_accounts) => {
    if (_accounts.length > 0) {
      setConnected(true)

      setAddress(_accounts[0])

      getBasicInfo()
    } else {
      setConnected(false)
    }
  }

  const handleAmountChange = (e) => {
    const value = e.target.value
    if (Number(value) > Number(ethers.formatUnits(balance.total, decimals)))
      setInsufficientBalance(true)
    else setInsufficientBalance(false)
    setAmount(value)
  }

  const sendBTC = async () => {
    if (Number(value) > Number(ethers.formatUnits(balance.total, decimals))) return false

    try {
      const txId = await window.unisat.sendBitcoin(
        receiveAddress[network],
        parseInt(ethers.parseUnits(amount.toString(), decimals).toString())
      )
      setTxId(txId)
      setModalShow(true)
      getBasicInfo()
      setAmount('')
    } catch (error) {
      console.log(error)
    }
  }

  
  const claimBTC = async () => {
    
    if (Number(claimAmount) > Number(ethers.formatUnits(balance.total, decimals))) return false
    try {
      const txId = await window.unisat.sendBitcoin(
        receiveAddress[network],
        parseInt(ethers.parseUnits(claimAmount, decimals).toString())
      )
      setTxId(txId)
      setModalShow(true)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    countdownApis?.start()
  }, [countdownApis])

  return (
    <>
      <div className='main'>
        <div className='nav-bar'>
          <Navbar>
            <Container className='nav-container'>
              <Navbar.Brand href='#home' className='logo'>
                <Image
                  src='/logo.jpeg'
                  width={50}
                  height={50}
                  alt='Logo image'
                />
              </Navbar.Brand>
              <Nav className='me-auto'>
                {/* <div className="links-div">
                                        <Nav.Link href="#home">Home</Nav.Link>
                                        <Nav.Link href="#link">Mint</Nav.Link>
                                    </div> */}
                <div className='header-connect'>
                  {connected ? (
                    <>
                      <button data-augmented-ui='tl-clip br-clip'>
                        {truncateAddress(address)}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        data-augmented-ui='tl-clip br-clip'
                        onClick={() => setWalletModalShow(true)}
                      >
                        Connect Wallet
                      </button>
                    </>
                  )}
                </div>
              </Nav>
            </Container>
          </Navbar>
        </div>

        <div className='gradient'></div>
        <div className='lines'>
          <h1 className='bg-text'>PRESALE</h1>
        </div>

        <div className='presale-div'>
          <div
            data-augmented-ui='tl-clip tr-clip br-clip bl-clip border inlay'
            className='card-main'
          >
            <div
              data-augmented-ui='tl-clip tr-clip br-clip bl-clip border inlay'
              className='input-grp'
            >
              <div className='input-head'>
                <button
                  className='max-amount'
                  onClick={() =>
                    setAmount(
                      (
                        ethers.formatUnits(balance.total, decimals) - 0.00001
                      ).toFixed(6)
                    )
                  }
                >
                  Max
                </button>
                <span className='input-balance'>
                  Balance : {ethers.formatUnits(balance.total, decimals)} BTC
                </span>
              </div>

              <div className='input-group-inline'>
                <input
                  placeholder='Amount'
                  type='number'
                  value={amount}
                  onChange={(e) => handleAmountChange(e)}
                />

                <span>
                  <Image
                    src='/btc.png'
                    className='eth'
                    alt='logo'
                    width={30}
                    height={30}
                  />
                </span>
              </div>
            </div>

            <div className='info-group'>
              <div className='sub-info'>
                <div className='info'>Total raised amount:</div>
                <div>{raisedBalance} BTC</div>
              </div>

              <div className='sub-info'>
                <div className='info'>Presale price:</div>
                <div>$ {presalePrice.toFixed(3)}</div>
              </div>

              <div className='sub-info'>
                <div className='info'>Minimun buy amount:</div>
                <div>{minAmount[network]} BTC</div>
              </div>

              {started ? (
                <div className='sub-info'>
                  <div className='info'>Ends in:</div>
                  <div>
                    <Countdown
                      date={endTime}
                      autoStart={false}
                      ref={setRef}
                      onComplete={() => setEnded(true)}
                    />
                  </div>
                </div>
              ) : (
                <div className='sub-info'>
                  <div className='info'>Starts in:</div>
                  <div>
                    <Countdown
                      date={startTime}
                      onComplete={() => setstarted(true)}
                    />
                  </div>
                </div>
              )}
            </div>

            <p className='d-none'>{receiveAddress[network]}</p>

            <div className='button-group'>
              <button
                data-augmented-ui='tl-clip tr-clip br-clip bl-clip'
                disabled={
                  !connected ||
                  insufficientBalance ||
                  parseFloat(amount) < parseFloat(minAmount[network]) ||
                  amount === '' ||
                  Number(balance.total) === 0
                }
                onClick={sendBTC}
              >
                {insufficientBalance ? 'Insufficient balance' : 'Buy'}
              </button>
            </div>
            <div className='button-group'>
              <button
                className='claim'
                data-augmented-ui='tl-clip tr-clip br-clip bl-clip border inlay'
                onClick={claimBTC}
              >
                Claim
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        dialogClassName='modal-50w'
      >
        <Modal.Body className='text-white text-center'>
          <h2>Congratulations!</h2>
          <h5 className='mt-5'>Transaction has been submitted.</h5>
          <p>
            <a
              href={explorer[network] + '/tx/' + txId}
              target='_blank'
              rel='noreferrer'
            >
              View transaction:
            </a>
          </p>
        </Modal.Body>
      </Modal>

      <Modal
        show={walletModalShow}
        onHide={() => setWalletModalShow(false)}
        dialogClassName='modal-small'
      >
        <Modal.Body className='text-white'>
          <h3 className='text-center mb-4'>Select Wallet</h3>
          <div className='d-flex flex-column'>
            {walletList.map((wallet, index) => {
              return (
                <div
                  key={index}
                  className='wallet-item'
                  onClick={() => connectWallet(wallet.keyword)}
                >
                  <Image
                    src={wallet.icon}
                    alt='wallet icon'
                    width={40}
                    height={40}
                    className='wallet-icon mx-2'
                  />
                  {wallet.name}
                </div>
              )
            })}
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default Mint
