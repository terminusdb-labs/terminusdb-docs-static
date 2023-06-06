/* eslint-disable @next/next/no-img-element */
import Image from 'next/image'
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
import 'flowbite';
import { checkIfMenuOpen, getActiveSlugClassName, menuItemsByOrder } from "./utils"

const menuClassName = "flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"

/** level 3 */
function renderLevel3Menu(menuLevel3: any[], entry: any[]) {

  let orderedMenuLevel3 = menuItemsByOrder(menuLevel3)

  const level3Items = orderedMenuLevel3.map((level3, index) => {
    let activeClassName = getActiveSlugClassName(level3, entry, 3)
    return <li key={`level3_${index}`}>
      <a href={level3.Menu3Page.slug} 
        className={`${menuClassName} pl-32 ${activeClassName}`}>
        {level3.Menu3Label}
      </a>
    </li>
  })
  return level3Items
}

/** level 2 */
function renderLevel2Menu(menuLevel2: any[], entry: any[]) {
  let orderedMenuLevel2 = menuItemsByOrder(menuLevel2)

  const level2Items = orderedMenuLevel2.map((level2, index) => {
    if (typeof level2 === 'undefined') {
      return ''
    }

    let activeClassName = getActiveSlugClassName(level2, entry, 2)

    if(Array.isArray(level2.Level3) && !level2.Level3.length) {
      /** menu with no level 3 */
      return <li key={`level2_${index}`}>
        <a href={level2.Menu2Page.slug} 
          className={`${menuClassName} pl-20 ${activeClassName}`}>
            {level2.Menu2Label}
        </a>
      </li>
    }

    let className  =  checkIfMenuOpen(level2, entry, 3)

    /** menu with level 3 */
    return <li key={`level2_${index}`}>
      <button type="button" 
        className={`${menuClassName} pl-20`}
        aria-controls={level2.Menu2Label}
        data-collapse-toggle={level2.Menu2Label}>
        <span className="flex-1 ml-3 text-left whitespace-nowrap" sidebar-toggle-item>
          {level2.Menu2Label}
        </span>
        <svg sidebar-toggle-item className="w-6 h-6" 
          fill="currentColor" 
          viewBox="0 0 20 20" 
          xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
          </svg>
      </button>
      
      <ul id={level2.Menu2Label} className={`${className} py-2 space-y-2`}>{ renderLevel3Menu(level2.Level3, entry) }</ul>
    </li>
  })
  return level2Items
}

/** level 1 */
function renderLevel1Menu(menuLevel1: any[], entry: any[]) {

  let orderedMenuLevel1 = menuItemsByOrder(menuLevel1)

  const menuItems = orderedMenuLevel1.map((level1: { Level2?: any; Menu1Page?: any; Menu1Label?: any; Level1?: any[]; }, index: any) => {

    let activeClassName = getActiveSlugClassName(level1, entry, 1)

    if(Array.isArray(level1.Level2) && !level1.Level2.length) {
      /** menu with no level 2 */
      return <li key={level1.Menu1Page.slug}>
        <a href={level1.Menu1Page.slug} 
          className={`${menuClassName} pl-11 ${activeClassName}`}>
          <span className="ml-3">{level1.Menu1Label}</span>
        </a>
      </li>
    }
    //console.log("level1", level1)
    
    let className  =  checkIfMenuOpen(level1, entry, 2)

    /** menu with level 2 */
    return <li key={`level1_${index}`}>
      <button type="button" 
      className={`${menuClassName} pl-11`}
      aria-controls={level1.Menu1Label}
      data-collapse-toggle={level1.Menu1Label}>
        <span className="flex-1 ml-3 text-left whitespace-nowrap" sidebar-toggle-item>
          {level1.Menu1Label}
        </span>
        <svg sidebar-toggle-item className="w-6 h-6" 
          fill="currentColor" 
          viewBox="0 0 20 20" 
          xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
          </svg>
      </button>
      
      <ul id={level1.Menu1Label} className={`${className} py-2 space-y-2`}>{ renderLevel2Menu(level1.Level2, entry) }</ul>
    </li>
  })
  return menuItems
}




/** level 0 */
export default function renderMainMenu(menu: any[], entry: any[]) {

  const mainMenuItems = menu.map((menuItem, index) => {

    let className  =  checkIfMenuOpen(menuItem, entry, 1)

    return <li key={index}>
      <button type="button" 
        className={`${menuClassName}`}
        aria-controls={menuItem.MenuTitle}
        data-collapse-toggle={menuItem.MenuTitle}>
          <span className="flex-1 ml-3 text-left whitespace-nowrap" sidebar-toggle-item>
            {menuItem.MenuTitle}
          </span>
          <svg sidebar-toggle-item className="w-6 h-6" 
            fill="currentColor" 
            viewBox="0 0 20 20" 
            xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
      </button>
      <ul id={menuItem.MenuTitle} className={`${className} py-2 space-y-2`}>
        { renderLevel1Menu(menuItem.Level1, entry) }
      </ul>
    </li>
  })

  return mainMenuItems
}