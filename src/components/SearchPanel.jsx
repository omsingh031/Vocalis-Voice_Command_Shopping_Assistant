import { getCategoryMeta } from '../lib/categories';

/**
 * SearchPanel — bottom sheet that slides up with catalog search results.
 * Shows product name, brand, price, and "Add" button for each match.
 */
export default function SearchPanel({ results, query, onAdd, onClose }) {
  if (!results || results.length === 0) {
    return (
      <>
        <div className="search-overlay" onClick={onClose} />
        <div className="search-panel">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-300">
              <i className="ti ti-search text-emerald-400 mr-2" />
              Search: "{query}"
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg glass flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              aria-label="Close search"
            >
              <i className="ti ti-x text-sm" />
            </button>
          </div>
          <div className="empty-state py-8">
            <div className="empty-icon" style={{ animation: 'none' }}>
              <i className="ti ti-search-off" />
            </div>
            <p className="text-sm text-slate-500">No products found for "{query}"</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="search-overlay" onClick={onClose} />
      <div className="search-panel">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-300">
            <i className="ti ti-search text-emerald-400 mr-2" />
            {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg glass flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            aria-label="Close search"
          >
            <i className="ti ti-x text-sm" />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {results.map((product) => {
            const meta = getCategoryMeta(product.category);
            return (
              <div key={product.id} className="search-result-card animate-fade-in">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-medium text-slate-200 truncate">
                      {product.name}
                    </span>
                    <span className={`category-badge ${meta.colorClass}`}>
                      {meta.emoji}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span>{product.brand}</span>
                    <span className="text-emerald-400 font-semibold">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.inSeason && (
                      <span className="text-green-500 flex items-center gap-0.5">
                        <i className="ti ti-leaf text-xs" /> In season
                      </span>
                    )}
                  </div>
                </div>
                <button
                  className="search-add-btn"
                  onClick={() => onAdd(product.name, 1)}
                >
                  <i className="ti ti-plus text-xs mr-1" /> Add
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
