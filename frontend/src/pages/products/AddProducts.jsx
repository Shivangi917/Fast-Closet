import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { addProduct } from "../../utils/api/product.api";

const cloud_name = import.meta.env.VITE_CLOUD_NAME;
const upload_preset = import.meta.env.VITE_UPLOAD_PRESET;

const AddProduct = () => {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Hardcoded categories for testing
  const categories = [
    { _id: "64f1a1a3b2f5a1a2c3d4e5f6", name: "Men" },
    { _id: "64f1a1a3b2f5a1a2c3d4e5f7", name: "Women" },
    { _id: "64f1a1a3b2f5a1a2c3d4e5f8", name: "Kids" },
    { _id: "64f1a1a3b2f5a1a2c3d4e5f9", name: "Accessories" },
  ];

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    const uploadedUrls = [];

    setLoading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("file", files[i]);
        formData.append("upload_preset", upload_preset); // replace with your Cloudinary preset

        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, // replace YOUR_CLOUD_NAME
          formData
        );
        uploadedUrls.push(res.data.secure_url);
      }

      console.log(uploadedUrls);

      setImages(uploadedUrls);
    } catch (err) {
      console.error("Error uploading images:", err);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !price || !category || images.length === 0) {
      setMessage("Please fill all required fields and upload at least 1 image.");
      return;
    }

    const productData = {
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      category,
      brand,
      images,
      userId: user.id,
    };

    try {
      const res = await addProduct(productData);
      setMessage("Product added successfully!");
      console.log(res.data);
    } catch (err) {
      console.error(err);
      setMessage("Error adding product.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Add Product</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border p-2 rounded"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="border p-2 rounded"
        />

        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="border p-2 rounded"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="border p-2 rounded"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="file"
          multiple
          onChange={handleImageUpload}
          className="border p-2 rounded"
        />

        {loading && <p>Uploading images...</p>}

        <button
          type="submit"
          className="bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700 transition"
        >
          Add Product
        </button>

        {message && <p className="text-red-500">{message}</p>}
      </form>
    </div>
  );
};

export default AddProduct;
