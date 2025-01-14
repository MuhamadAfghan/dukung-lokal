const productNames = {
  Makanan: ["Nasi Goreng", "Sate", "Rendang", "Gado-gado", "Bakso"],
  Minuman: ["Es Teh", "Kopi", "Jus Buah", "Es Cendol", "Bandrek"],
  Pakaian: ["Batik", "Kebaya", "Sarung", "Peci", "Selendang"],
  Furnitur: [
    "Kursi Rotan",
    "Meja Jati",
    "Lemari Ukir",
    "Dipan Kayu",
    "Rak Bambu",
  ],
  Elektronik: [
    "Radio Portable",
    "Kipas Angin",
    "Lampu LED",
    "Power Bank",
    "Speaker Bluetooth",
  ],
  "Jasa & Layanan": [
    "Pijat Tradisional",
    "Laundry",
    "Tukang Cukur",
    "Bengkel Motor",
    "Les Privat",
  ],
  Kerajinan: [
    "Anyaman Bambu",
    "Ukiran Kayu",
    "Gerabah",
    "Batik Tulis",
    "Tenun Ikat",
  ],
  "Pertanian/Perkebunan": [
    "Beras Organik",
    "Sayur Hidroponik",
    "Buah Lokal",
    "Rempah-rempah",
    "Kopi Arabika",
  ],
  "Bahan Pokok": [
    "Beras",
    "Minyak Goreng",
    "Gula Pasir",
    "Telur",
    "Tepung Terigu",
  ],
  Lainnya: ["Batu Bara", "Minyak Bumi", "Pertalite", "Kalung Emas"],
};

const categories = Object.keys(productNames);

export const generateDummyUMKMData = (provinces) => {
  const data = [];
  provinces.forEach((province) => {
    const traderCount = Math.floor(Math.random() * 100) + 50;
    for (let i = 0; i < traderCount; i++) {
      const category =
        categories[Math.floor(Math.random() * categories.length)];
      const productName =
        productNames[category][
          Math.floor(Math.random() * productNames[category].length)
        ];
      data.push({
        productName,
        category,
        province: province.properties.province,
      });
    }
  });
  return data;
};
