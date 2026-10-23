import Icon from './Icon.jsx'

const STATUSES = ['Applied', 'Assessment', 'Interview', 'Offer', 'Rejected']

export default function SearchFilter({
  query,
  status,
  onQueryChange,
  onStatusChange,
  fixedStatus,
}) {
  return (
    <div className="table-toolbar">
      <label className="search-box">
        <Icon name="search" size={18} />
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search applications…"
          aria-label="Search applications"
        />
        {query && (
          <button className="search-clear" onClick={() => onQueryChange('')} aria-label="Clear search">
            <Icon name="close" size={15} />
          </button>
        )}
      </label>
      {!fixedStatus && (
        <label className="filter-select">
          <Icon name="filter" size={17} />
          <select value={status} onChange={(event) => onStatusChange(event.target.value)} aria-label="Filter by status">
            <option>All statuses</option>
            {STATUSES.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
      )}
    </div>
  )
}
