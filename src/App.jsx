import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Layout from './components/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Markets from './pages/Markets.jsx';
import Orders from './pages/Orders.jsx';
import Portfolio from './pages/Portfolio.jsx';
import Settings from './pages/Settings.jsx';
import Trade from './pages/Trade.jsx';
import { pulseMarket } from './features/trading/tradingSlice.js';

const pageTitles = {
  '/': 'Dashboard',
  '/markets': 'Markets',
  '/trade': 'Trade Ticket',
  '/portfolio': 'Portfolio',
  '/orders': 'Orders',
  '/settings': 'Settings',
};

function PageTitle() {
  const location = useLocation();

  useEffect(() => {
    const title = pageTitles[location.pathname] || 'Trading';
    document.title = `${title} | Trade World`;
  }, [location.pathname]);

  return null;
}

function MarketPulse() {
  const dispatch = useDispatch();

  useEffect(() => {
    const interval = window.setInterval(() => {
      dispatch(pulseMarket());
    }, 3500);

    return () => window.clearInterval(interval);
  }, [dispatch]);

  return null;
}

export default function App() {
  return (
    <>
      <PageTitle />
      <MarketPulse />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="markets" element={<Markets />} />
          <Route path="trade" element={<Trade />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="orders" element={<Orders />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
