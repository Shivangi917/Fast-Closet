import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ShoppingCart, Menu, X, User } from "lucide-react";
import { getUserDetails } from "../../utils/api/user.api";
import { getUserStores } from "../../utils/api/store.api";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [canAddProducts, setCanAddProducts] = useState(false);
  const [hasStore, setHasStore] = useState(false); // NEW

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const checkVendorStatus = async () => {
      if (!user) return;

      try {
        const res = await getUserDetails(user.id);
        const isVendor = res.roles?.includes("vendor");
        if (!isVendor) return;

        const stores = await getUserStores(user.id);
        const verifiedStore = stores.find(store => store.isVerified);

        setCanAddProducts(Boolean(verifiedStore));
        setHasStore(stores.length > 0); // hide add store if already exists
      } catch (error) {
        console.error("Error fetching vendor/store info:", error);
      }
    };

    checkVendorStatus();
  }, [user]);

  return (
    <nav className="bg-gray-900 text-white sticky top-0 z-50 shadow-md">
      <div className="mx-8 px-4 sm:px-8 py-3 flex justify-between items-center">
        
        <div className="hidden md:flex items-center gap-10">
          <Link to="/" className="hover:text-indigo-400 transition">Home</Link>
          <Link to="/stores" className="hover:text-indigo-400 transition">Stores</Link>
          <Link to="/blog" className="hover:text-indigo-400 transition">Blogs</Link>

          {canAddProducts && (
            <Link to="/add-products" className="hover:text-indigo-400 transition">
              Add Products
            </Link>
          )}

          {!hasStore && ( // only show if user doesn't have a store
            <Link to="/add-store" className="hover:text-indigo-400 transition">
              Add Store
            </Link>
          )}
        </div>

        <Link
          to="/"
          className="text-2xl font-extrabold tracking-wide text-indigo-400 hover:text-indigo-300 transition"
        >
          Fast Closet
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/cart" className="relative hover:text-indigo-400 transition">
            <ShoppingCart size={24} />
            {user?.cart?.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {user.cart.length}
              </span>
            )}
          </Link>

          {!user ? (
            <div className="hidden md:flex gap-4">
              <Link to="/login" className="hover:text-indigo-400 transition">Login</Link>
              <Link to="/signup" className="hover:text-indigo-400 transition">Signup</Link>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Link to="/profile">
                <User size={20} className="cursor-pointer hover:text-indigo-400" />
              </Link>
              <span className="text-gray-300 font-medium">Hi, {user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                Logout
              </button>
            </div>
          )}

          <button className="md:hidden" onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
