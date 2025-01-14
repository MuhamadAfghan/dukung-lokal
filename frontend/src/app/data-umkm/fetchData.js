import axios from "axios";

const fetchAddress = async (latitude, longitude) => {
  if (!latitude || !longitude) {
    return null;
  }
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/geocode?lat=${latitude}&long=${longitude}`
    );
    if (response.data.results && response.data.results.length > 0) {
      return response.data.results[0].formatted;
    }
    //opencagedata
    // const response = await axios.get(
    //   `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=03c48dae07364cabb7f121d8c1519492&no_annotations=1&language=id`
    // );
    // if (response.data.results && response.data.results.length > 0) {
    //   return response.data.results[0].formatted;
    // }
    //openstreetmap
    // const response = await axios.get(
    //   `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1&format=json`
    // );
    // if (response.data) {
    //   return response.data.display_name;
    // }
    return null;
  } catch (error) {
    console.error("Error fetching address:", error);
    return null;
  }
};

const fetchProvince = async (latitude, longitude) => {
  if (!latitude || !longitude) {
    return null;
  }
  try {
    const { data } = await axios.get(
      // `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=03c48dae07364cabb7f121d8c1519492&no_annotations=1&language=id`
      // `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1&format=json`
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/geocode?lat=${latitude}&long=${longitude}`
    );
    if (data.results && data.results.length > 0) {
      //   console.log(data.results[0].components);
      return data.results[0].components.state ?? "Jakarta Raya";
      // return data.address.state ?? "Jakarta Raya";
    }
    return "Provinsi tidak tersedia";
  } catch (error) {
    console.error("Error fetching province:", error);
    return "Provinsi tidak tersedia";
  }
};

export const fetchUMKMData = async (provinces) => {
  if (!provinces) {
    return [];
  }
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products`
    );
    const products = response.data.data;

    const data = await Promise.all(
      products.map(async (product) => {
        if (!product.positions || product.positions.length === 0) {
          return null;
        }

        const province = await fetchProvince(
          product.positions[0].latitude,
          product.positions[0].longitude
        );

        const address = await fetchAddress(
          product.positions[0].latitude,
          product.positions[0].longitude
        );

        console.log(province);

        return {
          productName: product.name,
          vendorName: product.vendor.name,
          category: product.category,
          province: province ?? "Jakarta Raya",
          likes: product.likes,
          address: address,
          position: {
            latitude: product.positions[0].latitude,
            longitude: product.positions[0].longitude,
          },
          open_time: product.open_time,
          close_time: product.close_time,
        };
      })
    );
    return data.filter((item) => item !== null);
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};
