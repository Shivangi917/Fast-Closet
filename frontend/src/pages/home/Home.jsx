import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Categories from "../../components/categories/Categories";
import Stores from "../../components/stores/Stores";
import Products from "../../components/products/Products";
import Hero from "../../components/hero/Hero";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
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
      axios
        .get(`${import.meta.env.VITE_API_URL}/stores/nearby`, {
          params: { lat: location.lat, lng: location.lng },
        })
        .then((res) => setStores(res.data))
        .catch((err) => console.error(err));
    }
  }, [location]);

  // Fetch trending products
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/products/trending`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Hero search={search}/>

      <div className="container mx-auto px-6 py-12">
        <Categories />

        <Stores stores={stores} />

        <Products products={products} />
      </div>
    </div>
  );
};

export default Home;
