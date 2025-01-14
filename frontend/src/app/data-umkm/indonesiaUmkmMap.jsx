"use client";

import { useState, useEffect, useMemo, use } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { generateDummyUMKMData } from "./dummyData";
import PieChartComponent from "./pieChart";
import TableComponent from "./tableComponent";
import { CategoryBadges } from "./categoryBadges";
import useGeolocation from "@/hook/useGeoLocation";
import toast from "react-hot-toast";
import { fetchUMKMData } from "./fetchData";
import axios from "axios";

const categories = [
  "Makanan",
  "Minuman",
  "Pakaian",
  "Furnitur",
  "Elektronik",
  "Jasa & Layanan",
  "Kerajinan",
  "Pertanian/Perkebunan",
  "Bahan Pokok",
  "Lainnya",
];

const IndonesiaUMKMMap = () => {
  const [map, setMap] = useState(null);
  const [geoJsonLayer, setGeoJsonLayer] = useState(null);
  const [indonesiaProvinces, setIndonesiaProvinces] = useState(null);
  const [umkmData, setUmkmData] = useState([]);
  const [umkmProvinces, setUmkmProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [hoveredData, setHoveredData] = useState(null);
  const { position } = useGeolocation();

  useEffect(() => {
    if (!map) {
      const mapInstance = L.map("umkmMap", {
        dragging: false,
        scrollWheelZoom: false,
        zoomControl: true,
        doubleClickZoom: false,
        attributionControl: false,
      }).setView([-2.5, 118], 4);

      L.tileLayer("", {
        opacity: 0,
      }).addTo(mapInstance);

      setMap(mapInstance);
    }

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://super-duper.fr/geojson/indonesia/provinsi.geojson"
        );
        const data = await response.json();
        setIndonesiaProvinces(data);
        if (data && data.features) {
          const dummyData = await fetchUMKMData(data.features);
          console.log(dummyData);
          setUmkmData(dummyData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setIndonesiaProvinces(null);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchAddress = async () => {
      console.log(position);
      if (!position || !position.latitude || !position.longitude)
        return toast.error(
          "Posisi saat ini tidak dapat ditemukan, klik pada provinsi tertentu untuk melihat data"
        );
      try {
        // const response = await fetch(
        //   `https://api.opencagedata.com/geocode/v1/json?q=${position.latitude}+${position.longitude}&key=03c48dae07364cabb7f121d8c1519492&no_annotations=1&language=id`
        // );
        const response = await axios.get(
          // `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1&format=json`
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/geocode?lat=${latitude}&long=${longitude}`
        );
        const data = await response.json();
        if (data && data.results) {
          setSelectedProvince(
            data.results[0].components.state ?? "Jakarta Raya"
          );
          // if (data && data.address) {
          //   setSelectedProvince(data.address.state ?? "Jakarta Raya");
        } else {
          console.error("Alamat tidak ditemukan");
        }
      } catch (error) {
        console.error("Error fetching address:", error);
      }
    };

    if (position?.latitude && position?.longitude) {
      fetchAddress();
    } else {
      console.error("Posisi tidak valid");
    }
  }, [position]);

  const getColor = (provinceName) => {
    if (!Array.isArray(umkmData)) {
      console.error("umkmData is not an array");
      return "#FFF5E6"; // Default color
    }
    const provinceData = umkmData.filter(
      (item) => item.province == provinceName
    );
    const percentage = (provinceData.length / umkmData.length) * 100;
    if (percentage > 10) return "#FF7F00";
    if (percentage > 8) return "#FF8C1A";
    if (percentage > 6) return "#FF9F33";
    if (percentage > 4) return "#FFB266";
    if (percentage > 2) return "#FFCC99";
    return "#FFF5E6";
  };

  useEffect(() => {
    if (map && indonesiaProvinces && !geoJsonLayer) {
      L.rectangle(
        [
          [-90, -180],
          [90, 180],
        ],
        {
          color: "none",
          fillColor: "#ffffff",
          fillOpacity: 0,
        }
      ).addTo(map);

      const layer = L.geoJSON(indonesiaProvinces, {
        data: indonesiaProvinces,
        style: (feature) => ({
          fillColor: getColor(feature.properties.province),
          fillOpacity: 0.7,
          weight: 1,
          color: "#000000",
        }),
        onEachFeature: (province, layer) => {
          const provinceName = province.properties.province;
          const provinceData = umkmData.filter(
            (item) => item.province == provinceName
          );
          const percentage = (
            (provinceData.length / umkmData.length) *
            100
          ).toFixed(2);

          layer.on({
            mouseover: (e) => {
              const layer = e.target;
              layer.setStyle({
                fillColor: "#ffffff",
                fillOpacity: 0.7,
                weight: 2,
                color: "#000000",
              });
              setHoveredData({
                name: provinceName,
                traders: provinceData.length,
                percentage: percentage,
              });
            },
            mouseout: (e) => {
              const layer = e.target;
              layer.setStyle({
                fillColor: getColor(provinceName),
                fillOpacity: 0.7,
                weight: 1,
                color: "#000000",
              });
              setHoveredData(null);
            },
            click: () => {
              setSelectedProvince(provinceName);
            },
          });
        },
      }).addTo(map);

      setGeoJsonLayer(layer);
    }

    return () => {
      if (geoJsonLayer) {
        geoJsonLayer.remove();
      }
    };
  }, [map, indonesiaProvinces, umkmData]);

  const provinceData = useMemo(() => {
    return umkmData.filter((item) => item.province === selectedProvince);
  }, [umkmData, selectedProvince]);

  return (
    <div className="max-w-screen-xl px-5 py-10 mx-auto space-y-8">
      <div className="grid grid-cols-12 gap-4 ">
        <div className="col-span-12 md:col-span-8">
          <div className="relative overflow-hidden bg-third">
            <div
              id="umkmMap"
              style={{ background: "transparent" }}
              className="border rounded-lg border-muted h-[200px] lg:h-[350px] z-1"
            />
            {hoveredData && (
              <div className="absolute p-3 bg-white border border-gray-200 rounded-lg shadow-lg top-4 right-4">
                <div className="text-sm font-bold">{hoveredData.name}</div>
                <div className="text-sm">
                  UMKM Traders: {hoveredData.traders}
                </div>
                <div className="text-sm">
                  {hoveredData.percentage}% of total
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="col-span-12 md:col-span-4">
          <PieChartComponent
            data={provinceData}
            className="size-[220px]"
            selectedProvince={selectedProvince}
          />
        </div>
      </div>

      <CategoryBadges
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <TableComponent data={provinceData} selectedCategory={selectedCategory} />
    </div>
  );
};

export default IndonesiaUMKMMap;
