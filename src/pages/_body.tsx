

export function getHtml(entry) {
  return entry['html']
}
//h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800

function getSubTitle(document) {
  if(!document.subtitle) return <div/>
  return document.subtitle.value
}

export const BodyContent = ({ entry }) => {

  return <div className="p-4 sm:ml-96 p-4 sm:ml-96 h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
    <div className="pl-20 rounded-lg font-normal">
      <h1 className="font-barlow font-semibold">{entry.document.title.value}</h1>
      <h2 className="font-barlow font-semibold tdb__subtitle">{getSubTitle(entry.document)}</h2>
      <div dangerouslySetInnerHTML={{__html: getHtml(entry)}}/>
    </div>
  </div>
}