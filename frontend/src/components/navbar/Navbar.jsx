import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { storespingCart, Search, Menu, X, User } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenu, setMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white sticky top-0 z-50 shadow-md">
      <div className="mx-8 px-4 sm:px-8 py-3 flex justify-between items-center">
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          <Link to="/" className="hover:text-indigo-400 transition">Home</Link>
          <Link to="/stores" className="hover:text-indigo-400 transition">stores</Link>
          <Link to="/blog" className="hover:text-indigo-400 transition">Blogs</Link>
        </div>

        {/* Logo */}
        <Link to="/" className="text-2xl font-extrabold tracking-wide text-indigo-400 hover:text-indigo-300 transition">
          Fast Closet
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-6">
          {/* Cart */}
          <Link to="/cart" className="relative hover:text-indigo-400 transition">
            <storespingCart size={24} />
            {user?.cart?.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {user.cart.length}
              </span>
            )}
          </Link>

          {/* Auth */}
          {!user ? (
            <div className="hidden md:flex gap-4">
              <Link to="/login" className="hover:text-indigo-400 transition">Login</Link>
              <Link to="/signup" className="hover:text-indigo-400 transition">Signup</Link>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <User size={20} className="text-gray-400" />
              <Link to="/profile"
                className="text-gray-300 font-medium hover:underline cursor-pointer">Hi, {user.name}
              </Link>
              <button
                onClick={handleLogout}
                className="bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                Logout
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button className="md:hidden" onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenu && (
        <div className="md:hidden bg-gray-800 px-4 py-4 flex flex-col gap-4 border-t border-gray-700">
          <Link to="/" className="hover:text-indigo-400">Home</Link>
          <Link to="/category/men" className="hover:text-indigo-400">Men</Link>
          <Link to="/category/women" className="hover:text-indigo-400">Women</Link>
          <Link to="/category/kids" className="hover:text-indigo-400">Kids</Link>
          <Link to="/category/accessories" className="hover:text-indigo-400">Accessories</Link>

          {!user ? (
            <>
              <Link to="/login" className="hover:text-indigo-400">Login</Link>
              <Link to="/signup" className="hover:text-indigo-400">Signup</Link>
            </>
          ) : (
            <>
              <Link to="/profile" className="hover:text-indigo-400">Go To Profile</Link>
              <Link to="/stores"
              className="hover:text-indigo-400">stores Near Me</Link>
              <button
                onClick={handleLogout}
                className="bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
