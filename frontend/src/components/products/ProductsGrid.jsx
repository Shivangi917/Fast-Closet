import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { fetchProducts } from "../../utils/api/product.api";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";

const ProductsGrid = ({ userLocation }) => {
  const [products, setProducts] = useState([]);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    if (userLocation.lat && userLocation.lng) {
      fetchProducts(userLocation.lat, userLocation.lng)
        .then(setProducts)
        .catch((err) => {
          console.error(err);
          toast.error("Failed to load products. Please try again.");
        });
    }
  }, [userLocation]);

  return (
    <div className="mb-16 px-6 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-800 border-b border-gray-400 pb-2 inline-block">
          Explore Products
        </h2>
        <Link
          to="/products"
          className="text-gray-600 hover:text-gray-800 font-semibold transition-colors"
        >
          View All →
        </Link>
      </div>

      {products?.length > 0 ? (
        <div className="relative">
          {/* Custom arrows */}
          <button
            ref={prevRef}
            className="absolute -left-6 top-1/2 -translate-y-1/2 z-10 
                       bg-white shadow-md rounded-full p-2 hover:bg-gray-100 
                       transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <button
            ref={nextRef}
            className="absolute -right-6 top-1/2 -translate-y-1/2 z-10 
                       bg-white shadow-md rounded-full p-2 hover:bg-gray-100 
                       transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>

          <Swiper
            modules={[Navigation]}
            spaceBetween={20}
            slidesPerView={2}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
            onInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
              swiper.navigation.init();
              swiper.navigation.update();
            }}
          >
            {products.map((product) => (
              <SwiperSlide key={product._id}>
                <Link
                  to={`/product/${product._id}`}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg border border-gray-200 hover:border-gray-400 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={product.images?.[0] || "/placeholder.png"}
                      alt={product.name}
                      className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-800 mb-1">
                      {product.name}
                    </h3>
                    <p className="text-lg font-bold text-gray-700">
                      ₹{product.price}
                    </p>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        <p className="text-gray-500">No products available.</p>
      )}
    </div>
  );
};

export default ProductsGrid;
