import renderMainMenu  from "./_menu"

export const SideBar = (props: { menu: any[]; entry: any[] }) => {
  return <aside id="sidebar-multi-level-sidebar" 
    className="fixed left-0 z-40 w-96 h-screen transition-transform -translate-x-full sm:translate-x-0" 
    aria-label="Sidebar">
    <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
      
      {/*<Search/>*/}
      {/*<div className="pt-5 mt-5 space-y-2 border-t border-gray-200 dark:border-gray-700"/>*/}
      <ul className="space-y-2 font-medium tdb__li">
        { renderMainMenu(props.menu, props.entry) }
      </ul>
    </div> 
  </aside>
}
