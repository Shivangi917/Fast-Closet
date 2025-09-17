import { useState } from "react";
import { motion } from "framer-motion";
import Search from "../search/Search";

const Hero = () => {
  const [search, setSearch] = useState("");

  return (
    <section className="bg-neutral-900 text-gray-100 py-24 px-6 text-center relative">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-gray-900/10 via-gray-400/10 to-transparent blur-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      />

      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.h1
          className="text-5xl md:text-6xl font-extrabold mb-6 text-gray-100"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          Fresh Looks, Fast Delivery
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl mb-10 text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Order from local stores and get your clothes in under an hour.
        </motion.p>

        <Search search={search} setSearch={setSearch}/>
      </div>
    </section>
  );
};

export default Hero;
