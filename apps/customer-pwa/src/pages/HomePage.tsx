import { Link } from 'react-router-dom';
import './HomePage.css';

const CATEGORIES = [
  { emoji: '🛒', label: 'Grocery', slug: 'grocery', color: '#F97316' },
  { emoji: '🥬', label: 'Vegetables', slug: 'vegetables', color: '#22C55E' },
  { emoji: '🥛', label: 'Dairy', slug: 'dairy', color: '#3B82F6' },
  { emoji: '🍛', label: 'Food', slug: 'food', color: '#EF4444' },
  { emoji: '💊', label: 'Medicine', slug: 'medicine', color: '#8B5CF6' },
  { emoji: '✂️', label: 'Services', slug: 'services', color: '#EC4899' },
];

const FEATURED_STORES = [
  {
    id: 'sharma-kirana',
    name: 'Sharma Kirana Store',
    category: 'Grocery',
    rating: 4.5,
    distance: '200m',
    isOpen: true,
    emoji: '🛒',
  },
  {
    id: 'ramesh-sabzi',
    name: 'Ramesh Sabzi Wala',
    category: 'Vegetables',
    rating: 4.8,
    distance: '350m',
    isOpen: true,
    emoji: '🥬',
  },
  {
    id: 'gupta-dairy',
    name: 'Gupta Dairy Farm',
    category: 'Dairy',
    rating: 4.3,
    distance: '500m',
    isOpen: false,
    emoji: '🥛',
  },
  {
    id: 'amma-kitchen',
    name: 'Amma\'s Kitchen',
    category: 'Food',
    rating: 4.9,
    distance: '150m',
    isOpen: true,
    emoji: '🍛',
  },
];

export function HomePage() {
  return (
    <div className="home" id="home-page">
      {/* Hero Section */}
      <section className="hero" id="hero-section">
        <div className="container hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            <span>Now live in your area</span>
          </div>
          <h1 className="hero-title">
            Your neighbourhood,
            <br />
            <span className="hero-highlight">now digital</span>
          </h1>
          <p className="hero-subtitle">
            Discover kirana stores, sabzi wallahs, and local vendors near you.
            Order via WhatsApp. Support your neighbourhood.
          </p>
          <div className="hero-actions">
            <Link to="/search" className="btn btn-primary" id="hero-explore-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              Explore Stores
            </Link>
            <a href="#categories" className="btn btn-outline" id="hero-categories-btn">
              Browse Categories
            </a>
          </div>

          {/* Stats */}
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-value">500+</span>
              <span className="hero-stat-label">Local Vendors</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-value">12</span>
              <span className="hero-stat-label">Neighbourhoods</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-value">10K+</span>
              <span className="hero-stat-label">Orders Delivered</span>
            </div>
          </div>
        </div>

        {/* Animated gradient background */}
        <div className="hero-bg" aria-hidden="true">
          <div className="hero-blob hero-blob-1" />
          <div className="hero-blob hero-blob-2" />
          <div className="hero-blob hero-blob-3" />
        </div>
      </section>

      {/* Categories */}
      <section className="categories" id="categories">
        <div className="container">
          <h2 className="section-title">Browse by Category</h2>
          <p className="section-subtitle">Find exactly what you need from stores near you</p>
          <div className="categories-grid">
            {CATEGORIES.map((cat) => (
              <Link
                to={`/search?category=${cat.slug}`}
                key={cat.slug}
                className="category-card"
                id={`category-${cat.slug}`}
                style={{ '--cat-color': cat.color } as React.CSSProperties}
              >
                <span className="category-emoji">{cat.emoji}</span>
                <span className="category-label">{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Stores */}
      <section className="featured" id="featured-stores">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Near You</h2>
              <p className="section-subtitle">Popular stores in your neighbourhood</p>
            </div>
            <Link to="/search" className="see-all-link" id="see-all-stores">
              See all →
            </Link>
          </div>
          <div className="stores-grid">
            {FEATURED_STORES.map((store) => (
              <Link
                to={`/store/${store.id}`}
                key={store.id}
                className="store-card"
                id={`store-card-${store.id}`}
              >
                <div className="store-card-header">
                  <span className="store-emoji">{store.emoji}</span>
                  <span className={`store-status ${store.isOpen ? 'open' : 'closed'}`}>
                    {store.isOpen ? 'Open' : 'Closed'}
                  </span>
                </div>
                <h3 className="store-name">{store.name}</h3>
                <p className="store-category">{store.category}</p>
                <div className="store-meta">
                  <span className="store-rating">
                    ⭐ {store.rating}
                  </span>
                  <span className="store-distance">
                    📍 {store.distance}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta" id="cta-section">
        <div className="container">
          <div className="cta-card">
            <h2 className="cta-title">Are you a local vendor?</h2>
            <p className="cta-subtitle">
              Digitise your store in minutes. Manage inventory by voice.
              Receive orders on WhatsApp. Zero commission.
            </p>
            <button className="btn btn-primary btn-lg" id="cta-download-btn">
              Download Mohalla Vendor App
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
