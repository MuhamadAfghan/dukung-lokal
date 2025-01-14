import { useState, useEffect } from "react";
import axios from "axios";

const fetchAddress = async (latitude, longitude) => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/geocode?lat=${latitude}&long=${longitude}`
    );
    if (data.results && data.results.length > 0) {
      return data.results[0].formatted;
    }
    // const { data } = await axios.get(
    //   `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=03c48dae07364cabb7f121d8c1519492&no_annotations=1&language=id`
    // );
    // if (data.results && data.results.length > 0) {
    //   return data.results[0].formatted;
    // }
    // const { data } = await axios.get(
    //   `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1&format=json`
    // );
    // if (data) {
    //   return data.display_name;
    // }
    return "Alamat tidak tersedia";
  } catch (error) {
    console.error("Error fetching address:", error);
    return "Alamat tidak tersedia";
  }
};

const useGetUmkmAddress = (umkmData) => {
  const [addresses, setAddresses] = useState({});

  useEffect(() => {
    const getAddresses = async () => {
      const newAddresses = {};
      const promises = umkmData.flatMap((umkm) =>
        umkm.positions.map(async (pos) => {
          const address = await fetchAddress(pos.latitude, pos.longitude);
          newAddresses[`${umkm.id}-${pos.id}`] = address;
        })
      );

      await Promise.all(promises);
      setAddresses(newAddresses);
    };

    if (umkmData?.length) {
      getAddresses();
    }
  }, [umkmData]);

  return addresses;
};

export default useGetUmkmAddress;
