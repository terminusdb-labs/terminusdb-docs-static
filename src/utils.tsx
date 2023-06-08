/* eslint-disable @next/next/no-img-element */


export function renderCodeTable(parameters) {
    const rows = parameters.map(param => {
        return <tr>
            <td>{param.name}</td>
            <td>{param.type}</td>
            <td>{param.summary}</td>
            </tr>
    })
    return <><h5>Parameters</h5><table>
        <thead><tr>
        <th>Name</th>
        <th>Type</th>
        <th>Description</th></tr>
        </thead>
        <tbody>
        {rows}
        </tbody>
    </table></>
}

/**
 * 
 * @param menuItem menu Item list 
 * @param entry current entry ( current menu clicked by user )
 * @param index menu index level
 * @returns checks if menu has to be open based on current entry 
 * if no match found then menu will be folded with className `hidden`
 * if match found then we remove hidden className to unfold the menu item
 */
export function checkIfMenuOpen(menuItem: { Level1: any[]; }, entry: { document: { slug: any; }; }, index: any[]) {
  let className = "hidden"
  if(!entry) return className
  if(Array.isArray(menuItem[`Level${index}`])) {
    menuItem[`Level${index}`].map( level => {
      // match Found
      if(level[`Menu${index}Page`].slug === entry.document.slug) {
        className=""
      }
      // loop further to next menu levels 
      let nextIndex = index + 1
      let nextLevelClassNames = checkIfMenuOpen(level, entry, nextIndex)
      if(nextLevelClassNames !== "hidden") className=nextLevelClassNames
    })
  }
  
  return className
}

export function checkIfSubMenuOpen (menuItem, entry, index) {
  //let className  = level2.Menu2Page.slug === entry.document.slug ? "" : "hidden"
  let className = "hidden"
  if(!entry) return className
  if(menuItem[`Menu${index}Page`].slug === entry.document.slug) {
    className = ""
  }
  let nextIndex = index + 1
  if(Array.isArray(menuItem[`Level${nextIndex}`])) {
    menuItem[`Level${nextIndex}`].map( level => {
      let nextLevelClassNames = checkIfSubMenuOpen(level, entry, nextIndex)
      if(nextLevelClassNames !== "hidden") {
        className=nextLevelClassNames
        return className
      }
    })
  }

  return className
}

/**
 * 
 * @param  menuItem menu Item list 
 * @param entry current entry ( current menu clicked by user )
 * @param index menu index level
 * @returns className activeMenu when slug matches menu List slug 
 */
export function getActiveSlugClassName (menuItem: { Level1: any[]; }, entry: { document: { slug: any; }; }, index: any[]) {
  let className=""
  if(!entry) return className
  let menuPage = menuItem[`Menu${index}Page`]
  // this menu is active
  if(menuPage.slug === entry.document.slug) {
    className="activeMenu"
  }
  return className
}

export function getLogo() {
  return <a href="https://terminusdb.com/" className="flex items-center pl-2.5 mb-5">
    <img src="https://4053281810-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FVZc9T1wJdVvodyIFrJuV%2Flogo%2F5UCCcn4lbzsXbvjpObGc%2FTerminusDB-Logo.svg?alt=media&amp;token=b0b8f1f0-d830-46de-a805-69bdda20bbe0" 
      className="mb-0 mt-0" 
      width="250" height="250" decoding="async"
      alt="TerminusDB Logo" />
  </a>
}

/**
 * 
 * @param link anchor heading links
 * @returns anchor ids 
 */
export function formatAnchorIds(link: string) {
  let id = link.replace(/[^A-Z0-9]/ig, ""); //replace(/\s/g, '')
  //let id = link.replace(/\s/g, '') 
  //let id = link
  //let id = link.replace(/[\[\]']+/g,'')
  return id.toLowerCase()
}

