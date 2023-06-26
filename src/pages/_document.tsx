/* eslint-disable @next/next/no-img-element */
import { Html, Head, Main, NextScript } from "next/document"
import Script from "next/script"
import "flowbite"

/**
 * 
 * @returns if (li.href.includes(current)) {
li.classList.add('active');
}
 */

export default function Document() {
  const basePath = process.env.BASE_PATH || ""
  return (
    <Html lang="en">
      <Head>
        <Script src={basePath + "/darkmode.js"} strategy="beforeInteractive" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Semi+Condensed:wght@600&family=Lexend+Deca&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="antialiased dark:bg-gray-900">
        {/*<header className="sticky top-0 z-40 flex-none w-full mx-auto bg-white border-b border-gray-200 dark:border-gray-600 dark:bg-gray-800">
          <Nav/>
          </header>*/}
        <Main />
        <NextScript />
        {/*       <Script id="theme-switcher">handleThemeSwitch();</Script>*/}
        <Script
          strategy="lazyOnload"
          data-domain="terminusdb.com"
          src="https://plausible.io/js/script.js"
        ></Script>
      </body>
    </Html>
  )
}

//<Script onLoad={loadTheme}/>

//<ThemeSwitcher/>
