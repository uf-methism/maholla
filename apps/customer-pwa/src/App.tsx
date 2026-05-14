import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { StorePage } from './pages/StorePage';
import { SearchPage } from './pages/SearchPage';
import './App.css';

export function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/store/:id" element={<StorePage />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </main>
      <footer className="footer">
        <div className="container">
          <p className="footer-text">
            © 2026 Mohalla · Your neighbourhood, now digital
          </p>
        </div>
      </footer>
    </div>
  );
}
