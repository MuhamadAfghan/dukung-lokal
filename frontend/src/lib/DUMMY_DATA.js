const Faq = [
  {
    question: "Apa itu Dukung Lokal?",
    answer:
      "Dukung Lokal adalah platform yang bertujuan untuk memperkenalkan dan mempromosikan UMKM lokal kepada publik, mempermudah pelanggan menemukan UMKM di sekitar mereka, serta memberikan dukungan berupa feedback dan survei langsung dari pelanggan untuk membantu UMKM berkembang. Dengan begitu, UMKM dapat meningkatkan kualitas layanan mereka dan menarik lebih banyak pelanggan.",
  },
  {
    question: "Bagaimana cara mendaftar sebagai UMKM di Dukung Lokal?",
    answer:
      "Untuk mendaftar sebagai UMKM, Anda dapat mengisi formulir pendaftaran yang tersedia di situs kami. Formulir ini akan meminta Anda untuk memberikan informasi mengenai usaha, produk atau layanan yang ditawarkan, serta lokasi usaha Anda. Setelah pengisian formulir, tim kami akan melakukan proses verifikasi untuk memastikan keakuratan data yang Anda berikan sebelum UMKM Anda terdaftar di platform.",
  },
  {
    question: "Apakah layanan Dukung Lokal gratis?",
    answer:
      "Ya, layanan dasar di Dukung Lokal, seperti pendaftaran UMKM dan pencarian UMKM di sekitar Anda, sepenuhnya gratis. Kami hanya memungut biaya untuk fitur premium yang dapat memberikan keuntungan lebih bagi UMKM, seperti promosi lebih luas dan visibilitas yang lebih tinggi di platform kami, yang bertujuan untuk membantu UMKM dikenal lebih banyak orang.",
  },
  {
    question: "Bagaimana cara menemukan UMKM di sekitar saya?",
    answer:
      "Untuk menemukan UMKM di sekitar Anda, cukup gunakan fitur pencarian kami yang terintegrasi dengan peta interaktif. Anda dapat mencari UMKM berdasarkan kategori tertentu, seperti makanan, fashion, atau kerajinan tangan, atau berdasarkan lokasi terdekat dengan Anda. Dengan peta yang real-time, Anda dapat melihat secara langsung lokasi dan keberadaan UMKM yang terdaftar di platform kami.",
  },
  {
    question: "Apakah saya bisa melihat rating dan ulasan UMKM lain?",
    answer:
      "Tentu, kami menyediakan fitur rating dan ulasan yang dapat diakses oleh setiap pengguna untuk UMKM yang terdaftar. Pelanggan yang telah berinteraksi dengan UMKM dapat memberikan ulasan berdasarkan pengalaman mereka, yang dapat Anda baca untuk membantu Anda dalam membuat keputusan sebelum membeli atau mengunjungi UMKM tersebut. Fitur ini juga memberikan transparansi dan membangun kepercayaan antara UMKM dan pelanggan.",
  },
  {
    question: "Bagaimana cara memberikan survei atau feedback untuk UMKM?",
    answer:
      "Setelah melakukan transaksi atau berinteraksi dengan sebuah UMKM, Anda dapat memberikan feedback atau mengisi survei singkat melalui platform kami. Survei ini dirancang untuk membantu UMKM memahami kekuatan mereka serta area yang perlu perbaikan. Umpan balik dari pelanggan sangat penting untuk meningkatkan kualitas layanan dan produk yang ditawarkan oleh UMKM.",
  },
];

const DUMMY_UMKM_DATA = [
  {
    id: 1,
    name: "Bakso tiren khas Malang",
    type: "Keliling",
    category: "Makanan",
    description: "Bakso tiren khas Malang adalah bakso yang terkenal di Malang",
    price: {
      min: 10000,
      max: 20000,
    },
    images: ["1.png", "2.png", "3.png"],
    open_time: "08:00",
    close_time: "17:00",
    created_at: "2021-08-01T00:00:00",
    updated_at: "2021-08-01T00:00:00",
    positions: [
      {
        id: 1,
        latitude: -6.6479136409785315,
        longitude: 106.82796478271486,
        created_at: "2021-08-01T00:00:00",
        updated_at: "2021-08-01T00:00:00",
      },
      {
        id: 2,
        latitude: -6.64,
        longitude: 106.83,
        created_at: "2021-08-01T00:00:00",
        updated_at: "2021-08-01T00:00:00",
      },
    ],
    vendor: {
      id: 1,
      name: "Mang Riski",
      contact: {
        phone: "08123456789",
        email: "riski@example.com",
      },
      created_at: "2021-08-01T00:00:00",
      updated_at: "2021-08-01T00:00:00",
    },
  },
  {
    id: 2,
    name: "Bubur sapi gurih",
    type: "Keliling",
    category: "Makanan",
    description: "Bubur sapi gurih khas dengan rempah yang lezat",
    price: {
      min: 15000,
      max: null,
    },
    images: ["bubur1.png", "bubur2.png"],
    open_time: "07:00",
    close_time: "14:00",
    created_at: "2021-08-01T00:00:00",
    updated_at: "2021-08-01T00:00:00",
    positions: [
      {
        id: 1,
        latitude: -6.630236409785315,
        longitude: 106.82796478271486,
        created_at: "2021-08-01T00:00:00",
        updated_at: "2021-08-01T00:00:00",
      },
      {
        id: 2,
        latitude: -6.633,
        longitude: 106.8305,
        created_at: "2021-08-01T00:00:00",
        updated_at: "2021-08-01T00:00:00",
      },
    ],
    vendor: {
      id: 2,
      name: "Ceu Enah",
      contact: {
        phone: "08133456789",
        email: "ceu_enah@example.com",
      },
      created_at: "2021-08-01T00:00:00",
      updated_at: "2021-08-01T00:00:00",
    },
  },
  {
    id: 3,
    name: "Nasi kebuli istimewa",
    type: "Ruko",
    category: "Makanan",
    description: "Nasi kebuli istimewa dengan rasa rempah yang kaya",
    price: {
      min: 30000,
      max: null,
    },
    images: ["nasi_kebuli1.png"],
    open_time: "10:00",
    close_time: "20:00",
    created_at: "2021-08-01T00:00:00",
    updated_at: "2021-08-01T00:00:00",
    positions: [
      {
        id: 1,
        latitude: -6.648952181471443,
        longitude: 106.84581756591798,
        created_at: "2021-08-01T00:00:00",
        updated_at: "2021-08-01T00:00:00",
      },
    ],
    vendor: {
      id: 3,
      name: "Bu Dewi",
      contact: {
        phone: "08124567890",
        email: "dewi@example.com",
      },
      created_at: "2021-08-01T00:00:00",
      updated_at: "2021-08-01T00:00:00",
    },
  },
  {
    id: 4,
    name: "Es doger tradisional",
    type: "Gerobak Tetap",
    category: "Minuman",
    description: "Es doger tradisional dengan rasa segar dan manis",
    price: {
      min: 8000,
      max: 15000,
    },
    images: ["es_doger1.png"],
    open_time: "09:00",
    close_time: "18:00",
    created_at: "2021-08-01T00:00:00",
    updated_at: "2021-08-01T00:00:00",
    positions: [
      {
        id: 1,
        latitude: -6.646906095403726,
        longitude: 106.83792114257814,
        created_at: "2021-08-01T00:00:00",
        updated_at: "2021-08-01T00:00:00",
      },
      {
        id: 2,
        latitude: -6.648,
        longitude: 106.84,
        created_at: "2021-08-01T00:00:00",
        updated_at: "2021-08-01T00:00:00",
      },
    ],
    vendor: {
      id: 4,
      name: "Kang Asep",
      contact: {
        phone: "08129876543",
        email: "asep@example.com",
      },
      created_at: "2021-08-01T00:00:00",
      updated_at: "2021-08-01T00:00:00",
    },
  },
  {
    id: 5,
    name: "Sate ayam legendaris",
    type: "Tenda",
    category: "Makanan",
    description: "Sate ayam legendaris yang empuk dan lezat",
    price: {
      min: 25000,
      max: 35000,
    },
    images: ["sate1.png"],
    open_time: "11:00",
    close_time: "22:00",
    created_at: "2021-08-01T00:00:00",
    updated_at: "2021-08-01T00:00:00",
    positions: [
      {
        id: 1,
        latitude: -6.645201017176115,
        longitude: 106.85817718505861,
        created_at: "2021-08-01T00:00:00",
        updated_at: "2021-08-01T00:00:00",
      },
    ],
    vendor: {
      id: 5,
      name: "Pak Budi",
      contact: {
        phone: "08135678902",
        email: "budi@example.com",
      },
      created_at: "2021-08-01T00:00:00",
      updated_at: "2021-08-01T00:00:00",
    },
  },
];

const DUMMY_TESTIMONY = [
  {
    name: "Alex",
    role: "Penjual Nasi Goreng",
    description:
      "Saya berjualan nasi goreng sejak 5 tahun lalu. Platform ini membantu saya menjangkau lebih banyak pelanggan, meningkatkan omzet, dan membangun reputasi yang lebih baik melalui ulasan pelanggan.",
    created_at: "2024-02-15T10:30:00",
    rating: 4.8,
  },
  {
    name: "Asep",
    role: "Surveyor",
    description:
      "Sebagai surveyor, saya sering menggunakan platform ini untuk menemukan berbagai UMKM yang relevan dengan proyek saya. Akses yang mudah dan informasi yang terpercaya sangat membantu.",
    created_at: "2024-03-10T14:00:00",
    rating: 4.8,
  },
  {
    name: "Budi",
    role: "Pedagang Batu Bara",
    description:
      "Tambang saya dikenal berkat platform ini. Saya mendapatkan banyak pelanggan baru yang datang berkat kemudahan mereka menemukan tambang  yang enak dan terjangkau.",
    created_at: "2024-01-25T09:45:00",
    rating: 4.7,
  },
];

export { Faq, DUMMY_UMKM_DATA, DUMMY_TESTIMONY };
