/* eslint-disable @next/next/no-img-element */
import { Html, Head, Main, NextScript } from 'next/document'
import Script from "next/script";
import { Nav } from "../components/_nav"

 
export default function Document() {

  /** on load function to swap between light & dark mode  */
  function loadTheme() {
    if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark')
    }
  }


  
  return (
    <Html lang="en">
      <Head>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.5/flowbite.min.css" rel="stylesheet" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/default.min.css" rel="stylesheet"/>
        <Script onLoad={loadTheme}/>
      </Head>
      <body className='dark:bg-gray-900 antialiased'>
        <header className="sticky top-0 z-40 flex-none w-full mx-auto bg-white border-b border-gray-200 dark:border-gray-600 dark:bg-gray-800">
          <Nav/>
        </header>
        <NextScript/>
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.5/flowbite.min.js"></Script>
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/es/highlight.min.js"></Script>
        <Script id="highlight">hljs.highlightAll();</Script>
        <Script id="theme-switcher">handleThemeSwitch();</Script>
      </body>
    </Html>
  )
}

//<Script onLoad={loadTheme}/>

//<ThemeSwitcher/>
