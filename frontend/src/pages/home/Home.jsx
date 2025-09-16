import { useState, useEffect } from "react";
import Categories from "../../components/categories/Categories";
import Stores from "../../components/stores/Stores";
import Products from "../../components/products/Products";
import Hero from "../../components/hero/Hero";
import { getNearbyStores } from "../../utils/api/store.api";

const Home = () => {
  const [stores, setStores] = useState([]);
  const [location, setLocation] = useState({ lat: null, lng: null });

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
  }, []);

  // Fetch nearby stores
  useEffect(() => {
    if (location.lat && location.lng) {
      getNearbyStores(location.lat, location.lng)
        .then(setStores)
        .catch(console.error);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Hero />

      <div className="container mx-auto px-6 py-12">
        <Categories userLocation={location}/>
        <Stores stores={stores} />
        <Products userLocation={location}/>
      </div>
    </div>
  );
};

export default Home;
