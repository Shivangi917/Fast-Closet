import { useState, useContext, useEffect } from "react";
import { LocationContext } from "../../context/LocationContext";
import Categories from "../../components/categories/Categories";
import StoresGrid from "../../components/stores/StoresGrid";
import ProductsGrid from "../../components/products/ProductsGrid";
import Hero from "../../components/hero/Hero";
import { getNearbyStores } from "../../utils/api/store.api";

const Home = () => {
  const { location, setLocation } = useContext(LocationContext);
  const [stores, setStores] = useState([]);

  // Get user geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      });
    }
  }, [setLocation]);

  // Fetch nearby stores
  useEffect(() => {
    if (location?.lat && location?.lng) {
      getNearbyStores(location.lat, location.lng)
        .then(setStores)
        .catch(console.error);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Hero />
      <div className="container mx-auto px-6 py-12">

        <Categories userLocation={location} />
        <StoresGrid stores={stores} />
        <ProductsGrid userLocation={location} />
      </div>
    </div>
  );
};

export default Home;
