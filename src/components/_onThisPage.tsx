const { JSDOM } = require('jsdom');
import { formatAnchorIds } from "../utils"

function getLinks(anchorLabel: any[]) {
  let links: JSX.Element[] = []
  anchorLabel.map(link => {
    links.push(<li><a href={`#${formatAnchorIds(link)}`} className="">{link}</a></li>)
  })
  return links
}


//return <div className="flex-none hidden w-64 pl-8 mr-8 xl:text-sm xl:block">
export const OnThisPageContent = ({ html }) => {

  let anchorLabel = []

  const dom = new JSDOM(`<!DOCTYPE html>${html}`);
  const document = dom.window.document;
  
  let nodeList = document.querySelectorAll("h2"); 
  for (let i = 0; i < nodeList.length; i++) {
    anchorLabel.push(nodeList[i].textContent)
  }

  //console.log("anchorLabel", anchorLabel)
  
  
  return <div className="flex-none hidden sticky w-64 pl-8 mr-8 xl:text-sm xl:block">
    <div className="flex overflow-y-auto sticky top-14 flex-col justify-between pt-10 pb-6 h-[calc(100vh-5rem)]">
      <div className="mb-8">
        <h4 className="pl-2.5 mb-2 text-sm font-semibold tracking-wide text-gray-900 uppercase dark:text-white lg:text-xs">On this page</h4>
        <nav id="TableOfContents">
          <ul className="tdb__on__this__page">
            {getLinks(anchorLabel)}
          </ul>
        </nav>
      </div>
    </div>
  </div>

 
}

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
