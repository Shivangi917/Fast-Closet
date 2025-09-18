import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import { useRef } from "react";

const StoresGrid = ({ stores, hideHeader = false }) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <div className="mb-16 px-6 relative">
      {/* Header */}
      {!hideHeader && (
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-800 border-b border-gray-500 pb-2 inline-block">
            Stores Near You
          </h2>
          <Link
            to="/stores"
            className="text-gray-600 hover:text-gray-800 font-semibold transition-colors"
          >
            View All →
          </Link>
        </div>
      )}

      {stores.length > 0 ? (
        <div className="relative">
          {/* Custom navigation arrows */}
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

          {/* Swiper carousel */}
          <Swiper
            modules={[Navigation]}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            onInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
              swiper.navigation.init();
              swiper.navigation.update();
            }}
          >
            {stores.map((store) => (
              <SwiperSlide key={store._id}>
                <Link
                  to={`/products/store/${store._id}`}
                  state={{ store }}
                  className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200
                             hover:shadow-lg hover:border-teal-500 hover:-translate-y-1 
                             transition-all duration-300 block"
                >
                  {/* Store Name + Verified Badge */}
                  <h3 className="font-bold text-xl text-gray-800 mb-2 flex items-center gap-2">
                    {store.name}
                    {store.isVerified && (
                      <span className="text-teal-600 text-sm font-medium">✔ Verified</span>
                    )}
                  </h3>

                  {/* Address */}
                  <p className="text-gray-600">
                    📍 {store.address.street}, {store.address.city}, {store.address.state}
                  </p>

                  {/* Owner */}
                  <p className="text-gray-600 mt-1">👤 {store.owner.name}</p>

                  {/* Contact */}
                  {store.contactNumber && (
                    <p className="text-gray-600 mt-1">📞 {store.contactNumber}</p>
                  )}

                  {/* Products Count */}
                  <p className="text-gray-700 mt-3 font-medium">
                    🛒 {store.products.length} products available
                  </p>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        <p className="text-gray-500">No stores found near you.</p>
      )}
    </div>
  );
};

export default StoresGrid;
