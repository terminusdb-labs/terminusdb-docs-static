

export function getHtml(entry) {
  return entry['html']
}
//h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800

export const BodyContent = ({ entry }) => {

  return <div className="p-4 sm:ml-96 p-4 sm:ml-96 h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
    <div className="p-24 rounded-lg ">
      <div dangerouslySetInnerHTML={{__html: getHtml(entry)}}/>
    </div>
  </div>
}