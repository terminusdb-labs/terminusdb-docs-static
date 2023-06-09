
import { OnThisPageContent } from "./_onThisPage"

export function getHtml(entry: { [x: string]: any }) {
  return entry['html']
}
//h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800

function getSubTitle(document: { subtitle: { value: any } }) {
  if(!document.subtitle) return <div/>
  return document.subtitle.value
}

export const BodyContent = ({ entry }) => {
  
  //return <div className="flex-auto max-w-4xl min-w-0 pt-6 lg:px-8 lg:pt-8 pb:12 xl:pb-24 lg:pb-16"> 
  return <div className="flex p-4 sm:ml-96 p-4 sm:ml-96 h-screen px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
    {/*<div className="pl-20 rounded-lg font-normal container sm">*/}
    <div className="pl-20 rounded-lg font-normal max-w-4xl">
      <h1 className="font-barlow font-semibold">{entry.document.title.value}</h1>
      <h2 className="font-barlow font-semibold tdb__subtitle">{getSubTitle(entry.document)}</h2>
      <div dangerouslySetInnerHTML={{__html: getHtml(entry)}}/>
    </div>
    <OnThisPageContent html={getHtml(entry)}/>
  </div>
}