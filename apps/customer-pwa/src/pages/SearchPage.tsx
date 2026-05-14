import { Link, useSearchParams } from 'react-router-dom';
import './SearchPage.css';

const ALL_STORES = [
  { id: 'sharma-kirana', name: 'Sharma Kirana Store', category: 'Grocery', emoji: '🛒', rating: 4.5, distance: '200m', isOpen: true },
  { id: 'ramesh-sabzi', name: 'Ramesh Sabzi Wala', category: 'Vegetables', emoji: '🥬', rating: 4.8, distance: '350m', isOpen: true },
  { id: 'gupta-dairy', name: 'Gupta Dairy Farm', category: 'Dairy', emoji: '🥛', rating: 4.3, distance: '500m', isOpen: false },
  { id: 'amma-kitchen', name: 'Amma\'s Kitchen', category: 'Food', emoji: '🍛', rating: 4.9, distance: '150m', isOpen: true },
  { id: 'singh-medical', name: 'Singh Medical Store', category: 'Medicine', emoji: '💊', rating: 4.6, distance: '400m', isOpen: true },
  { id: 'raju-salon', name: 'Raju Hair Salon', category: 'Services', emoji: '✂️', rating: 4.2, distance: '300m', isOpen: true },
];

const CATEGORIES = ['All', 'Grocery', 'Vegetables', 'Dairy', 'Food', 'Medicine', 'Services'];

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';

  const filteredStores = activeCategory === 'all'
    ? ALL_STORES
    : ALL_STORES.filter(s => s.category.toLowerCase() === activeCategory);

  const handleCategoryClick = (cat: string) => {
    if (cat === 'All') {
      setSearchParams({});
    } else {
      setSearchParams({ category: cat.toLowerCase() });
    }
  };

  return (
    <div className="search-page" id="search-page">
      <div className="container">
        <div className="search-header">
          <h1 className="search-title">Find Stores</h1>
          <p className="search-subtitle">Discover local vendors in your neighbourhood</p>
        </div>

        <div className="search-input-wrapper" id="search-input-wrapper">
          <svg className="search-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input type="text" className="search-input" placeholder="Search by store name or product..." id="search-input" aria-label="Search stores" />
        </div>

        <div className="filter-chips" id="filter-chips">
          {CATEGORIES.map((cat) => (
            <button key={cat} className={`filter-chip ${(cat === 'All' && activeCategory === 'all') || cat.toLowerCase() === activeCategory ? 'active' : ''}`} onClick={() => handleCategoryClick(cat)} id={`filter-${cat.toLowerCase()}`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="search-results" id="search-results">
          <p className="results-count">{filteredStores.length} store{filteredStores.length !== 1 ? 's' : ''} found</p>
          <div className="results-list">
            {filteredStores.map((store) => (
              <Link to={`/store/${store.id}`} key={store.id} className="result-card" id={`result-${store.id}`}>
                <span className="result-emoji">{store.emoji}</span>
                <div className="result-info">
                  <h3 className="result-name">{store.name}</h3>
                  <p className="result-meta">{store.category} · ⭐ {store.rating} · 📍 {store.distance}</p>
                </div>
                <span className={`result-status ${store.isOpen ? 'open' : 'closed'}`}>{store.isOpen ? 'Open' : 'Closed'}</span>
              </Link>
            ))}
          </div>
          {filteredStores.length === 0 && (
            <div className="no-results">
              <span className="no-results-emoji">🏪</span>
              <p>No stores found in this category</p>
              <button className="btn btn-outline" onClick={() => setSearchParams({})}>Show all stores</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
