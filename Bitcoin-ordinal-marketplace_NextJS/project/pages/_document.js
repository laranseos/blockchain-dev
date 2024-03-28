import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
      <link rel="stylesheet" type="text/css" href="https://unpkg.com/augmented-ui@2/augmented-ui.min.css" />
      </Head>
      <body>
        <Main />
        <NextScript />
        <script src="/js/secp256k1.js"></script>
        <script type="module" src="/js/bitcoinjs-lib.js"></script>
        <script type="module" src="/js/connectjs-lib.js"></script>
        <script src="/js/nostr.js"></script>
        <script src="/js/qrcode.js"></script>
      </body>
    </Html >
  )
}
