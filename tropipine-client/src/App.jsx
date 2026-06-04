import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { AnimatePresence } from 'framer-motion'
import store from './store'

// Layout
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import PrivateRoute from './components/PrivateRoute'
import ScrollToTop from './components/ScrollToTop'
import AuthInitializer from './components/AuthInitializer'
import AppLoader from './components/AppLoader'
import RouteProgress from './components/RouteProgress'

// Pages
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderTracking from './pages/OrderTracking'
import MyOrders from './pages/MyOrders'
import TrackOrder from './pages/TrackOrder'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Profile from './pages/Profile'
import Wishlist from './pages/Wishlist'
import Gallery from './pages/Gallery'
import About from './pages/About'
import Contact from './pages/Contact'

function Layout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}

function GalleryLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}

function App() {
  const [appReady, setAppReady] = useState(false)

  return (
    <Provider store={store}>
      <AnimatePresence>
        {!appReady && <AppLoader onDone={() => setAppReady(true)} />}
      </AnimatePresence>
      <AuthInitializer>
        <BrowserRouter>
          <RouteProgress />
          <ScrollToTop />
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route
            path="/shop"
            element={
              <Layout>
                <Shop />
              </Layout>
            }
          />
          <Route
            path="/product/:id"
            element={
              <Layout>
                <ProductDetail />
              </Layout>
            }
          />
          <Route
            path="/cart"
            element={
              <Layout>
                <Cart />
              </Layout>
            }
          />
          <Route
            path="/checkout"
            element={
              <Layout>
                <Checkout />
              </Layout>
            }
          />
          <Route
            path="/orders"
            element={
              <Layout>
                <PrivateRoute>
                  <MyOrders />
                </PrivateRoute>
              </Layout>
            }
          />
          <Route
            path="/orders/:orderId"
            element={
              <Layout>
                <PrivateRoute>
                  <OrderTracking />
                </PrivateRoute>
              </Layout>
            }
          />
          <Route
            path="/track-order"
            element={
              <Layout>
                <TrackOrder />
              </Layout>
            }
          />
          <Route
            path="/contact"
            element={
              <Layout>
                <Contact />
              </Layout>
            }
          />
          <Route
            path="/login"
            element={
              <Layout>
                <Login />
              </Layout>
            }
          />
          <Route
            path="/register"
            element={
              <Layout>
                <Register />
              </Layout>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <Layout>
                <ForgotPassword />
              </Layout>
            }
          />
          <Route
            path="/reset-password/:token"
            element={
              <Layout>
                <ResetPassword />
              </Layout>
            }
          />
          <Route
            path="/profile"
            element={
              <Layout>
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              </Layout>
            }
          />
          <Route
            path="/wishlist"
            element={
              <Layout>
                <Wishlist />
              </Layout>
            }
          />
          <Route
            path="/gallery"
            element={
              <GalleryLayout>
                <Gallery />
              </GalleryLayout>
            }
          />
          <Route
            path="/about"
            element={
              <Layout>
                <About />
              </Layout>
            }
          />
        </Routes>
      </BrowserRouter>
      </AuthInitializer>
    </Provider>
  )
}

export default App
