import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

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
            path="/stores"
            element={
              <PrivateRoute>
                <Stores />
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
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
