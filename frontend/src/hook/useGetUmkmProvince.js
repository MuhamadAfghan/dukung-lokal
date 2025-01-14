import { useState, useEffect } from "react";
import axios from "axios";

const fetchProvince = async (latitude, longitude) => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/geocode?lat=${latitude}&long=${longitude}`
    );
    if (data.results && data.results.length > 0) {
      return data.results[0].components.state;
    }
    // const { data } = await axios.get(
    //   `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=03c48dae07364cabb7f121d8c1519492&no_annotations=1&language=id`
    // );
    // if (data.results && data.results.length > 0) {
    //   return data.results[0].components.state;
    // }
    // const { data } = await axios.get(
    //   `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1&format=json`
    // );
    // if (data) {
    //   return data.display_name;
    // }
    return "Provinsi tidak tersedia";
  } catch (error) {
    console.error("Error fetching province:", error);
    return "Provinsi tidak tersedia";
  }
};

const useGetUmkmProvince = (umkmData) => {
  const [provinces, setProvinces] = useState({});

  useEffect(() => {
    const getProvinces = async () => {
      const newProvinces = {};
      const promises = umkmData.flatMap((umkm) =>
        umkm.positions.map(async (pos) => {
          const province = await fetchProvince(pos.latitude, pos.longitude);
          newProvinces[`${umkm.id}-${pos.id}`] = province;
        })
      );

      await Promise.all(promises);
      setProvinces(newProvinces);
    };

    if (umkmData?.length) {
      getProvinces();
    }
  }, [umkmData]);

  return provinces;
};

export default useGetUmkmProvince;
