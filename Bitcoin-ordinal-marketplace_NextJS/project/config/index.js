const receiveAddress = {
  livenet: 'bc1qt0ymmedteax6vu4mh22lwyf4hzxmk0fzzu6ga8',
  testnet: 'tb1qn9h64zqesnudcwnqeuujaw829e374ls4u6jq26',
}

const explorer = {
  livenet: 'https://mempool.space/testnet',
  testnet: 'https://mempool.space',
}

const minAmount = {
  livenet: 0.01,
  testnet: 0.00001,
}

const claimAmount = '0.00011'

const covalenthq_key = 'cqt_rQ73HvHPXXvrVTPdVk6K9pbV34Q7'

const walletList = [
  // {
  //   name: 'Okx Wallet',
  //   keyword: 'okx',
  //   icon: '/okx.png',
  // },
  {
    name: 'Unisat Wallet',
    keyword: 'unisat',
    icon: '/unisat.png',
  },
];

export { receiveAddress, explorer, covalenthq_key, minAmount, walletList, claimAmount }
