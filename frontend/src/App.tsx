import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MobileLayout } from './components/layout/MobileLayout';
import { Provider } from 'react-redux';
import { store } from './features/store';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Account from './pages/Account';
import OrderHistory from './pages/OrderHistory';

import CategoriesPage from './pages/Categories';
import SearchPage from './pages/Search';
import CategoryProducts from './pages/CategoryProducts';
import OrderSuccess from './pages/OrderSuccess';
import OrderTracking from './pages/OrderTracking';
import ProductDetails from './pages/ProductDetails';
import TraceabilityPage from './pages/Traceability';
import LabReportsPage from './pages/LabReports';
import PrivacyPolicy from './pages/PrivacyPolicy';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import Terms from './pages/Terms';
import Returns from './pages/Returns';

import { ErrorBoundary } from './components/common/ErrorBoundary';

import { ScrollToTop } from './components/common/ScrollToTop';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={
            <ErrorBoundary>
              <MobileLayout />
            </ErrorBoundary>
          }>
            <Route index element={<Home />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="category/:slug" element={<CategoryProducts />} />
            <Route path="product/:slug" element={<ProductDetails />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="account" element={<Account />} />
            <Route path="orders" element={<OrderHistory />} />
            <Route path="order-tracking/:orderId" element={<OrderTracking />} />
            <Route path="order-success" element={<OrderSuccess />} />
            <Route path="traceability" element={<TraceabilityPage />} />
            <Route path="lab-reports" element={<LabReportsPage />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="about-us" element={<AboutUs />} />
            <Route path="contact-us" element={<ContactUs />} />
            <Route path="terms-conditions" element={<Terms />} />
            <Route path="return-policy" element={<Returns />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
