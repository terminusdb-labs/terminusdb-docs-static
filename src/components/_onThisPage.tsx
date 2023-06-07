const { JSDOM } = require('jsdom');
import { formatAnchorIds } from "../utils"

function getLinks(anchorLabel: any[]) {
  let links: JSX.Element[] = []
  anchorLabel.map(link => {
    links.push(<li><a href={`#${formatAnchorIds(link)}`} className="">{link}</a></li>)
  })
  return links
}

function getNodeList(nodeList) {
  let list = []
  for (let i = 0; i < nodeList.length; i++) {
    list.push(nodeList[i].textContent)
  }
  return list
}

//return <div className="flex-none hidden w-64 pl-8 mr-8 xl:text-sm xl:block">
export const OnThisPageContent = ({ html }) => {

  let anchorLabel = []

  const dom = new JSDOM(`<!DOCTYPE html>${html}`);
  const document = dom.window.document;

  let nodeList = document.querySelectorAll("h2, h3, h4")
  let listArray = getNodeList(nodeList) 
  
  /*let h2NodeList = document.querySelectorAll("h2"); 
  let h3NodeList = document.querySelectorAll("h3"); 
  let h4NodeList = document.querySelectorAll("h4"); 

  /*let h2ListArray = getNodeList(h2NodeList) 
  let h3ListArray = getNodeList(h3NodeList) 
  let h4ListArray = getNodeList(h4NodeList) */

  if(!listArray.length) return <div className="flex-none hidden sticky w-64 pl-8 mr-8 xl:text-sm xl:block"/>
  
  return <aside id="otherBar" 
  className="fixed top-0 right-0 z-40 w-96 h-screen transition-transform -translate-x-full sm:translate-x-0" 
  aria-label="Sidebar">
    <div className="mb-8">
        <h4 className="pl-2.5 mb-2 text-sm font-semibold tracking-wide text-gray-900 uppercase dark:text-white lg:text-xs">On this page</h4>
        <nav id="TableOfContents">
          <ul className="tdb__on__this__page">
            {getLinks(listArray)}
          </ul>
        </nav>
      </div>
  </aside>
}

/**
 * return <div className="flex-none hidden sticky w-64 pl-8 mr-8 xl:text-sm xl:block">
    <div className="flex overflow-y-auto sticky top-14 flex-col justify-between pt-10 pb-6 h-auto">
      <div className="mb-8">
        <h4 className="pl-2.5 mb-2 text-sm font-semibold tracking-wide text-gray-900 uppercase dark:text-white lg:text-xs">On this page</h4>
        <nav id="TableOfContents">
          <ul className="tdb__on__this__page">
            {getLinks(listArray)}
          </ul>
        </nav>
      </div>
    </div>
  </div>
 */

/**
 * <li><a href="#multi-level-menu" className="">Multi-level menu</a></li>
            <li><a href="#content-separator" className="">Content separator</a></li>
            <li><a href="#cta-button" className="">CTA button</a></li>
            <li><a href="#logo-branding" className="">Logo branding</a></li>
            <li><a href="#sidebar-with-navbar" className="">Sidebar with navbar</a></li>
            <li><a href="#off-canvas-sidebar" className="!border-blue-700 !after:opacity-100 !text-blue-700 dark:!border-blue-500 dark:!text-blue-500">Off-canvas sidebar</a></li>
            <li><a href="#more-examples" className="">More examples</a></li>
            <li><a href="#dashboard-layout" className="">Dashboard Layout</a></li>
 */
