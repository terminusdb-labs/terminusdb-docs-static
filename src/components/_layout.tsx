import renderMainMenu  from "./_menu"
import { Nav } from "../components/_nav"
import { OnThisPageContent } from "../components/_onThisPage"
import { handleScroll } from "../utils"
import Seo from "../components/seo"

import React, { useEffect, useCallback } from "react";
import Prism from "prismjs";
import { initFlowbite } from 'flowbite'
import "prismjs/themes/prism-tomorrow.css";
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-powershell';
import 'prismjs/components/prism-graphql';
import 'prismjs/components/prism-python';

/** Header component */
const Header = () => {
  return <header className="sticky top-0 z-40 flex-none w-full mx-auto bg-white border-b border-gray-200 dark:border-gray-600 dark:bg-gray-800">
    <Nav/>
  </header>
}

/** Side Bar nav component  */
const SideBarComponent = (props) => {
  return <>
    <aside id="sidebar-multi-level-sidebar"
      className="fixed inset-0 z-20 flex-none h-full w-72 lg:static lg:h-auto lg:overflow-y-visible lg:pt-0 lg:w-96 lg:block hidden"
      aria-labelledby="sidebar-label">
   
      <div id="navWrapper"
        className="overflow-y-auto z-20 h-full bg-gray-50 scrolling-touch max-w-2xs lg:h-[calc(100vh-3rem)] lg:block lg:sticky top:24 lg:top-28 dark:bg-gray-900 lg:mr-0">
        <nav id="nav"
          className="pt-16 px-1 pl-3 lg:pl-0 lg:pt-2 font-normal text-base lg:text-sm pb-10 lg:pb-20 sticky?lg:h-(screen-18)"
          aria-label="Docs navigation">
            <ul className="space-y-2 font-medium tdb__li ">
              { renderMainMenu(props.menu, props.entry) }
            </ul>
        </nav>
      </div>  
    </aside>
  </>
}

/** Main body of page */
const MainContent = (props) => {

  useEffect(() => {
      if (typeof window !== 'undefined') {
          Prism.highlightAll();
          handleScroll();
          initFlowbite();
          document.getElementById("sidebar-multi-level-sidebar").classList.add("hidden")
      }
  }, [props.displayElement]);

  return <main id="content-wrapper"
    className="flex-auto w-full min-w-0 lg:static lg:max-h-full lg:overflow-visible">

    <div className="flex w-full">
      <div className="flex-auto max-w-4xl min-w-0 pt-6 lg:px-8 lg:pt-8 pb:12 xl:pb-24 lg:pb-16">
        <div id="mainContent">
          <div className="pb-2 mb-4 border-b border-gray-200 dark:border-gray-800">
            <h1 className="font-barlow font-semibold">{props.heading}</h1>
          </div>
          <h2 className="font-barlow font-semibold tdb__subtitle">{props.subtitle}</h2>
          {props.displayElement}
        </div>
      </div> 
      <OnThisPageContent html={props.html}/>
    </div>
  </main>
}

/** layout for all pages to be displayed */
export const Layout = (props) => {
  return <>
    <Header/>
    <Seo seo_metadata={props.seo_metadata}/>
    <div className="w-full px-4 mx-auto max-w-8xl">
      <div className="lg:flex">
        <SideBarComponent {...props}/>
       { <div className="fixed inset-0 z-10 hidden bg-gray-900/50 dark:bg-gray-900/60" id="sidebarBackdrop"/>}
        <MainContent {...props}/>
      </div>
    </div>
  </>
}
