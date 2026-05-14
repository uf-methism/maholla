import { useParams, Link } from 'react-router-dom';
import './StorePage.css';

// Mock store data — will be replaced with API calls in Sprint 1
const MOCK_STORES: Record<string, {
  name: string;
  category: string;
  emoji: string;
  rating: number;
  distance: string;
  isOpen: boolean;
  timings: string;
  address: string;
  phone: string;
  products: Array<{ name: string; price: string; unit: string }>;
}> = {
  'sharma-kirana': {
    name: 'Sharma Kirana Store',
    category: 'Grocery',
    emoji: '🛒',
    rating: 4.5,
    distance: '200m',
    isOpen: true,
    timings: '7:00 AM – 10:00 PM',
    address: 'Shop 12, Sector 5, Near Hanuman Mandir',
    phone: '+91 98765 43210',
    products: [
      { name: 'Toor Dal (1kg)', price: '₹145', unit: 'kg' },
      { name: 'Basmati Rice (5kg)', price: '₹420', unit: 'bag' },
      { name: 'Amul Butter (500g)', price: '₹280', unit: 'pack' },
      { name: 'Sugar (1kg)', price: '₹48', unit: 'kg' },
      { name: 'Sunflower Oil (1L)', price: '₹165', unit: 'bottle' },
      { name: 'Atta (10kg)', price: '₹380', unit: 'bag' },
    ],
  },
  'ramesh-sabzi': {
    name: 'Ramesh Sabzi Wala',
    category: 'Vegetables',
    emoji: '🥬',
    rating: 4.8,
    distance: '350m',
    isOpen: true,
    timings: '6:00 AM – 8:00 PM',
    address: 'Gali No. 3, Sabzi Mandi Road',
    phone: '+91 91234 56789',
    products: [
      { name: 'Tomatoes', price: '₹40', unit: 'kg' },
      { name: 'Onions', price: '₹35', unit: 'kg' },
      { name: 'Potatoes', price: '₹30', unit: 'kg' },
      { name: 'Green Chillies', price: '₹60', unit: 'kg' },
      { name: 'Coriander Bunch', price: '₹10', unit: 'bunch' },
      { name: 'Cauliflower', price: '₹40', unit: 'piece' },
    ],
  },
  'gupta-dairy': {
    name: 'Gupta Dairy Farm',
    category: 'Dairy',
    emoji: '🥛',
    rating: 4.3,
    distance: '500m',
    isOpen: false,
    timings: '5:30 AM – 9:00 PM',
    address: '45, Dairy Colony, Main Road',
    phone: '+91 87654 32109',
    products: [
      { name: 'Full Cream Milk (1L)', price: '₹68', unit: 'litre' },
      { name: 'Curd (400g)', price: '₹35', unit: 'cup' },
      { name: 'Paneer (200g)', price: '₹90', unit: 'pack' },
      { name: 'Buttermilk (500ml)', price: '₹25', unit: 'bottle' },
      { name: 'Ghee (500ml)', price: '₹350', unit: 'jar' },
    ],
  },
  'amma-kitchen': {
    name: 'Amma\'s Kitchen',
    category: 'Food',
    emoji: '🍛',
    rating: 4.9,
    distance: '150m',
    isOpen: true,
    timings: '11:00 AM – 9:00 PM',
    address: 'Block C, Near School Gate',
    phone: '+91 99887 76655',
    products: [
      { name: 'Thali (Veg)', price: '₹80', unit: 'plate' },
      { name: 'Thali (Non-Veg)', price: '₹120', unit: 'plate' },
      { name: 'Biryani', price: '₹150', unit: 'plate' },
      { name: 'Roti (4 pcs)', price: '₹20', unit: 'set' },
      { name: 'Raita', price: '₹30', unit: 'bowl' },
    ],
  },
};

export function StorePage() {
  const { id } = useParams<{ id: string }>();
  const store = id ? MOCK_STORES[id] : null;

  if (!store) {
    return (
      <div className="store-not-found container" id="store-not-found">
        <div className="not-found-content">
          <span className="not-found-emoji">🔍</span>
          <h1>Store not found</h1>
          <p>This store doesn't exist or may have been removed.</p>
          <Link to="/" className="btn btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const whatsappMessage = encodeURIComponent(
    `Hi! I found your store "${store.name}" on Mohalla. I'd like to place an order.`
  );
  const whatsappUrl = `https://wa.me/${store.phone.replace(/\s+/g, '')}?text=${whatsappMessage}`;

  return (
    <div className="store-page" id="store-page">
      {/* Store Header */}
      <section className="store-hero">
        <div className="container">
          <Link to="/" className="back-link" id="store-back-link">
            ← Back to stores
          </Link>

          <div className="store-header-card">
            <div className="store-header-top">
              <span className="store-page-emoji">{store.emoji}</span>
              <div className="store-header-info">
                <h1 className="store-page-name">{store.name}</h1>
                <p className="store-page-category">{store.category}</p>
              </div>
              <span className={`store-badge ${store.isOpen ? 'open' : 'closed'}`}>
                {store.isOpen ? '🟢 Open' : '🔴 Closed'}
              </span>
            </div>

            <div className="store-details-grid">
              <div className="store-detail">
                <span className="detail-icon">⭐</span>
                <span className="detail-value">{store.rating}/5</span>
                <span className="detail-label">Rating</span>
              </div>
              <div className="store-detail">
                <span className="detail-icon">📍</span>
                <span className="detail-value">{store.distance}</span>
                <span className="detail-label">Away</span>
              </div>
              <div className="store-detail">
                <span className="detail-icon">🕐</span>
                <span className="detail-value">{store.timings}</span>
                <span className="detail-label">Timings</span>
              </div>
            </div>

            <p className="store-address">📌 {store.address}</p>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="store-products" id="store-products">
        <div className="container">
          <h2 className="section-title">Products</h2>
          <div className="products-list">
            {store.products.map((product, i) => (
              <div key={i} className="product-row" id={`product-${i}`}>
                <div className="product-info">
                  <span className="product-name">{product.name}</span>
                  <span className="product-unit">per {product.unit}</span>
                </div>
                <span className="product-price">{product.price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Action Buttons */}
      <section className="store-actions" id="store-actions">
        <div className="container">
          <div className="actions-row">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp"
              id="whatsapp-order-btn"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Order via WhatsApp
            </a>
            <button className="btn btn-outline" id="show-upi-btn">
              💳 Show UPI QR
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
