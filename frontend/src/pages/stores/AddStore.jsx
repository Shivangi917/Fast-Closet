import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addStore } from "../../utils/api/store.api";
import { useAuth } from "../../context/AuthContext";

const AddStore = () => {
  const navigate = useNavigate();

  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    contactNumber: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const storeData = {
      name: formData.name,
      description: formData.description,
      contactNumber: formData.contactNumber,
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country,
      },
      owner: user.id, // pass vendor id
    };

    try {
      await addStore(storeData);
      alert("Store created successfully!");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to create store");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Add Store</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="name"
          placeholder="Store Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="p-2 border rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="contactNumber"
          placeholder="Contact Number"
          value={formData.contactNumber}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="street"
          placeholder="Street"
          value={formData.street}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          required
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="state"
          placeholder="State"
          value={formData.state}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="postalCode"
          placeholder="Postal Code"
          value={formData.postalCode}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="country"
          placeholder="Country"
          value={formData.country}
          onChange={handleChange}
          required
          className="p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700"
        >
          Add Store
        </button>
      </form>
    </div>
  );
};

export default AddStore;
