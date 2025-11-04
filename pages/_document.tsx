import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="description" content="Founders Fest 2025-26 - Ignite. Build. Celebrate. Two days of innovation, networking, and celebration." />
        <meta name="keywords" content="Founders Fest, innovation, networking, startup, entrepreneurs, 2025, 2026" />
        <meta property="og:title" content="Founders Fest 2025-26" />
        <meta property="og:description" content="Two days of innovation, networking, and celebration." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Righteous&display=swap" rel="stylesheet" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
