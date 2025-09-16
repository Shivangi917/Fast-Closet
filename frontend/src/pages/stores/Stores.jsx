import { useEffect, useState, useContext } from "react";
import { LocationContext } from "../../context/LocationContext";
import { getNearbyStores } from "../../utils/api/store.api";
import StoresGrid from "../../components/stores/StoresGrid";

const Stores = () => {
  const { location } = useContext(LocationContext);
  const [stores, setStores] = useState([]);

  useEffect(() => {
    if (location.lat && location.lng) {
      getNearbyStores(location.lat, location.lng)
        .then(setStores)
        .catch(console.error);
    }
  }, [location]);

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-6">Stores Near Me</h1>
      <StoresGrid stores={stores} hideHeader={true}/>
    </div>
  );
};

export default Stores;
