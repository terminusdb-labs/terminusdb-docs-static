//import '@/styles/globals.css'
import React, { useEffect, useCallback } from "react"
//import "../styles/tailwind.css"
import "flowbite"
import "../styles/globals.css"
//import "../styles/test.css"
//import "../styles/prism-one-dark.css"
import type { Metadata } from "next"
import type { AppProps } from "next/app"

/** function to handle theme switcher  */
function handleThemeSwitch() {
  var themeToggleDarkIcon = document.getElementById("theme-toggle-dark-icon")
  var themeToggleLightIcon = document.getElementById("theme-toggle-light-icon")

  // Change the icons inside the button based on previous settings
  if (
    localStorage.getItem("color-theme") === "dark" ||
    (!("color-theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    themeToggleLightIcon.classList.remove("hidden")
    document.documentElement.classList.add("dark")
  } else {
    themeToggleDarkIcon.classList.remove("hidden")
    document.documentElement.classList.remove("dark")
  }

  var themeToggleBtn = document.getElementById("theme-toggle")

  themeToggleBtn.addEventListener("click", function (e) {
    e.stopPropagation()
    e.preventDefault()

    // toggle icons inside button
    themeToggleDarkIcon.classList.toggle("hidden")
    themeToggleLightIcon.classList.toggle("hidden")

    // if set via local storage previously
    if (localStorage.getItem("color-theme")) {
      if (localStorage.getItem("color-theme") === "light") {
        document.documentElement.classList.add("dark")
        localStorage.setItem("color-theme", "dark")
      } else {
        document.documentElement.classList.remove("dark")
        localStorage.setItem("color-theme", "light")
      }
      // if NOT set via local storage previously
    } else {
      if (document.documentElement.classList.contains("dark")) {
        document.documentElement.classList.remove("dark")
        localStorage.setItem("color-theme", "light")
      } else {
        document.documentElement.classList.add("dark")
        localStorage.setItem("color-theme", "dark")
      }
    }
  })
}

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    //    handleThemeSwitch();
  }, [])

  return <Component {...pageProps} />
}
