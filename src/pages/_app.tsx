//import '@/styles/globals.css'
import React, { useEffect } from "react";
//import "../styles/tailwind.css"
import "../styles/globals.css"
//import "../styles/prism-one-dark.css"
import type { Metadata } from 'next';
import type { AppProps } from 'next/app'
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-powershell';
import 'prismjs/components/prism-graphql';
import 'prismjs/components/prism-python';


/** function to handle theme switcher  */
function handleThemeSwitch_OLD (e) {
  var themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
  var themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

  // Change the icons inside the button based on previous settings
  if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    themeToggleLightIcon.classList.remove('hidden');
    document.documentElement.classList.add('dark');
  } else {
    themeToggleDarkIcon.classList.remove('hidden');
    document.documentElement.classList.remove('dark')
  }

  var themeToggleBtn = document.getElementById('theme-toggle');

  themeToggleBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    e.preventDefault();

    // toggle icons inside button
    themeToggleDarkIcon.classList.toggle('hidden');
    themeToggleLightIcon.classList.toggle('hidden');

    // if set via local storage previously
    if (localStorage.getItem('color-theme')) {
      if (localStorage.getItem('color-theme') === 'light') {
        document.documentElement.classList.add('dark');
        localStorage.setItem('color-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('color-theme', 'light');
      }
      // if NOT set via local storage previously
    } 
    else {
      if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('color-theme', 'light');
      } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('color-theme', 'dark');
      }
    }
  });
}

/** function to handle theme switcher  */
function handleThemeSwitch () {
  var themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
  var themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

  // Change the icons inside the button based on previous settings
  if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    themeToggleLightIcon.classList.remove('hidden');
    document.documentElement.classList.add('dark');
  } else {
    themeToggleDarkIcon.classList.remove('hidden');
    document.documentElement.classList.remove('dark')
  }

  var themeToggleBtn = document.getElementById('theme-toggle');

  themeToggleBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    e.preventDefault();

    // toggle icons inside button
    themeToggleDarkIcon.classList.toggle('hidden');
    themeToggleLightIcon.classList.toggle('hidden');

    // if set via local storage previously
    if (localStorage.getItem('color-theme')) {
      if (localStorage.getItem('color-theme') === 'light') {
        document.documentElement.classList.add('dark');
        localStorage.setItem('color-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('color-theme', 'light');
      }
      // if NOT set via local storage previously
    } 
    else {
      if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('color-theme', 'light');
      } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('color-theme', 'dark');
      }
    }
  });
}


export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    Prism.highlightAll();
    handleThemeSwitch();
  }, []);

  return <Component {...pageProps} />
}
