import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import Stores from "./pages/stores/Stores";
import AddStore from "./pages/stores/AddStore";
import Navbar from "./components/navbar/Navbar";
import AddProducts from "./pages/products/AddProducts";
import ProductsOfStore from "./pages/products/ProductsOfStore";
import ProductDetail from "./pages/products/ProductDetail";
import Category from "./pages/category/Category";
import Products from "./pages/products/Products";
import CartPage from "./pages/cart/CartPage";
import OrdersPage from "./pages/order/OrdersPage";
import OrderDetailsPage from "./pages/order/OrderDetailsPage";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />

        {/* Toaster */}
        <Toaster
          position="top-center"  
          reverseOrder={false}
          toastOptions={{
            className: "bg-gray-800 text-white px-6 py-4 rounded-lg shadow-lg",
            style: {
              minWidth: "300px",
              maxWidth: "500px",
              fontSize: "16px",
            },
            success: {
              icon: "✅",
              className: "bg-green-600 text-white",
            },
            error: {
              icon: "❌",
              className: "bg-red-600 text-white",
            },
            duration: 4000,
          }}
        />

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          <Route
            path="/add-store"
            element={
              <PrivateRoute>
                <AddStore />
              </PrivateRoute>
            }
          />

          <Route
            path="/add-products"
            element={
              <PrivateRoute>
                <AddProducts />
              </PrivateRoute>
            }
          />

          <Route
            path="/products/store/:storeId"
            element={
              <PrivateRoute>
                <ProductsOfStore />
              </PrivateRoute>
            }
          />

          <Route
            path="/product/:productId"
            element={
              <PrivateRoute>
                <ProductDetail />
              </PrivateRoute>
            }
          />

          <Route
            path="/category/:category"
            element={
              <PrivateRoute>
                <Category />
              </PrivateRoute>
            }
          />

          <Route
            path="/products"
            element={
              <PrivateRoute>
                <Products />
              </PrivateRoute>
            }
          />

          <Route
            path="/stores"
            element={
              <PrivateRoute>
                <Stores />
              </PrivateRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <PrivateRoute>
                <CartPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <PrivateRoute>
                <OrdersPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/order/:id"
            element={
              <PrivateRoute>
                <OrderDetailsPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
