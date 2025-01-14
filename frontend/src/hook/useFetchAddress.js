import { useState, useEffect } from "react";
import axios from "axios";

const useFetchAddress = (latitude, longitude) => {
  const [address, setAddress] = useState("Alamat tidak tersedia");

  // const response = await axios.get(
  //   `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1&format=json`
  // );
  // if (response.data) {
  //   return response.data.display_name;
  // }

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/geocode?lat=${latitude}&long=${longitude}`
        );
        if (data.results && data.results.length > 0) {
          // console.log(data);
          setAddress(data.results[0].formatted);
        }

        // const { data } = await axios.get(
        //   `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1&format=json`
        // );
        // if (data) {
        //   setAddress(data.display_name);
        // }
      } catch (error) {
        console.error("Error fetching address:", error);
        setAddress("Alamat tidak tersedia");
      }
    };

    if (latitude && longitude) {
      fetchAddress();
    }
  }, [latitude, longitude]);

  return address;
};

export default useFetchAddress;
