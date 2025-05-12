import { vasSearchStyles } from './VasSearchBar.styles'

export function VasSearchBar() {
  return (
    <>
      <style>{vasSearchStyles}</style>
      <div className="vasSearchContainer">
        <div className="vasLabel">VAS</div>

        <div className="searchBox">
          <span className="searchBy">
            Search By <span className="dropdownIcon">▼</span>
          </span>
          <input className="searchInput" type="text" placeholder="Search Vas" />
          <span className="searchIcon">🔍</span>
        </div>
      </div>
    </>
  )
}
