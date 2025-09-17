import { addSellerRole } from '../../utils/api/role.api';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import { getUserDetails, updateUserProfile } from '../../utils/api/user.api';

const Profile = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  const becomeSeller = async (userId) => {
    try {
      const res = await addSellerRole(userId);
      console.log(res);
    } catch (error) {
      console.log("Error in adding user as seller: ", error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await getUserDetails(user.id);
        setUserData(res);
        setFormData(res); // prefill update form
      } catch (error) {
        console.log("Error fetching user data: ", error);
      }
    };

    fetchUserData();
  }, [user.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUpdate = async () => {
    try {
      const updated = await updateUserProfile(user.id, formData);
      setUserData(updated);
      setEditing(false);
    } catch (error) {
      console.log("Error updating profile: ", error);
    }
  };

  if (!userData) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="flex flex-col items-center min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      {/* Profile Info */}
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg mb-6">
        {!editing ? (
          <>
            <p><strong>Name:</strong> {userData.name}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Phone:</strong> {userData.phone || "Not provided"}</p>
            <p>
              <strong>Role:</strong>{" "}
              {Array.isArray(userData.roles)
              ? userData.roles.join(", ")
              : userData.roles || "Not assigned"}
            </p>
            <p><strong>Verified Vendor:</strong> {userData.isVerifiedVendor ? "Yes" : "No"}</p>

            {userData.address && (
              <div className="mt-2">
                <p><strong>Address:</strong></p>
                <p>{userData.address.street}, {userData.address.city}</p>
                <p>{userData.address.state} - {userData.address.postalCode}</p>
                <p>{userData.address.country}</p>
              </div>
            )}

            <button
              className="mt-4 w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </button>
          </>
        ) : (
          <>
            <div className="space-y-3">
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                placeholder="Name"
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="phone"
                value={formData.phone || ""}
                onChange={handleChange}
                placeholder="Phone"
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="address.street"
                value={formData.address?.street || ""}
                onChange={handleChange}
                placeholder="Street"
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="address.city"
                value={formData.address?.city || ""}
                onChange={handleChange}
                placeholder="City"
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="address.state"
                value={formData.address?.state || ""}
                onChange={handleChange}
                placeholder="State"
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="address.postalCode"
                value={formData.address?.postalCode || ""}
                onChange={handleChange}
                placeholder="Postal Code"
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="address.country"
                value={formData.address?.country || ""}
                onChange={handleChange}
                placeholder="Country"
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="flex gap-4 mt-4">
              <button
                className="flex-1 bg-green-600 text-white p-2 rounded hover:bg-green-700 transition"
                onClick={handleUpdate}
              >
                Save
              </button>
              <button
                className="flex-1 bg-gray-400 text-white p-2 rounded hover:bg-gray-500 transition"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>

      {/* Seller Button */}
      <button
        className="w-full max-w-lg bg-gray-800 text-white p-2 rounded hover:bg-gray-900 transition"
        onClick={() => becomeSeller(user.id)}
      >
        Become a seller
      </button>
    </div>
  );
};

export default Profile;
