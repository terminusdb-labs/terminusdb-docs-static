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

/**
 * 
 * @param  menuItem menu Item list 
 * @param entry current entry ( current menu clicked by user )
 * @param index menu index level
 * @returns className activeMenu when slug matches menu List slug 
 */
export function getActiveSlugClassName (menuItem: { Level1: any[]; }, entry: { document: { slug: any; }; }, index: any[]) {
  let className=""
  let menuPage = menuItem[`Menu${index}Page`]
  // this menu is active
  if(menuPage.slug === entry.document.slug) {
    className="activeMenu"
  }
  return className
}

/**
 * 
 * @param menu menu Array with Order
 * @returns ordered array menu
 */
export function menuItemsByOrder (menu: any[]) {
  return menu.sort(function(a: { Order: number; }, b: { Order: number; }){return a.Order-b.Order})
}