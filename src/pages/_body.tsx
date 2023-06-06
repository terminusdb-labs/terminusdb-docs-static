

export function getHtml(entry) {
  return entry['html']
}
//h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800

export const BodyContent = ({ entry }) => {

  return <div className="p-4 sm:ml-96 p-4 sm:ml-96 h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
    <div className="pl-20 rounded-lg ">
      <h1>{entry.document.title.value}</h1>
      <h2>{entry.document.subtitle.value}</h2>
      <div dangerouslySetInnerHTML={{__html: getHtml(entry)}}/>
    </div>
  </div>
}