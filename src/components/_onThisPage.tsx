import { formatAnchorIds } from "../utils"

type NodeObject = {
  text: string | null,
  tagName: string,
  id: string,
}

function intendList(tagName: any): string {
  const listIndents: Record<string, string> = {
    "H2": "",
    "H3": "ml-4 mr-4",
    "H4": "ml-8 mr-4",
  }
  if (tagName in listIndents) {
    return listIndents[tagName]
  }
  return ""
}

function getLinkTitle(linkName: string) {
  let str = linkName.split("(")
  return str[0]
}

function getAnchorId(link: NodeObject) {
  return (link.id !== '' ? link.id : formatAnchorIds(link.text) )
}

function getLinks(anchorLabel: NodeObject[]) {
  let links: JSX.Element[] = []
  anchorLabel.map(link => {
    links.push(<li className={intendList(link.tagName)}>
      <a href={`#${getAnchorId(link)}`} className="tdb__on__this__page__links">
        {getLinkTitle(link.text)}
      </a>
    </li>)
  })
  return links
}

function getNodeList(nodeList: NodeListOf<Element>) {
  let list: NodeObject[] = []
  for (let i = 0; i < nodeList.length; i++) {
    let nodeObject = {
      text: nodeList[i].textContent,
      //text: nodeList[i].textContent.replace(/[\[\]']+/g,''),
      tagName: nodeList[i].tagName,
      id: nodeList[i].id,
    }
    list.push(nodeObject)
  }
  return list
}

//return <div className="flex-none hidden w-64 pl-8 mr-8 xl:text-sm xl:block">
export const OnThisPageContent = (props) => {

  let nodeList = document.querySelectorAll("#mainContent h2:not(.tdb__subtitle), #mainContent h3, #mainContent h4")

  let listArray = getNodeList(nodeList)

  if(!listArray.length) return <div className="flex-none hidden sticky w-64 pl-8 mr-8 xl:text-sm xl:block"/>


  return <div className="flex-none hidden w-64 pl-8 mr-8 xl:text-sm xl:block">
    <div className="flex overflow-y-auto sticky top-28 flex-col justify-between pt-10 pb-6 h-[calc(100vh-5rem)]">
      <div className="mb-8">
        <h4 className="pl-2.5 mb-2 text-sm font-semibold tracking-wide text-gray-900 uppercase dark:text-white lg:text-xs">
          On this page
        </h4>
        <nav id="TableOfContents">
          <ul className="tdb__on__this__page">
            {getLinks(listArray)}
          </ul>
        </nav>
      </div>
    </div>
  </div>
}
