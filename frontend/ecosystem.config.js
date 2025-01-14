module.exports = {
  apps: [
    {
      name: "nextjs-app-dev", // Nama aplikasi
      script: "node_modules/next/dist/bin/next", // Jalankan Next.js
      args: "next dev --turbopack", // Jalankan mode development dengan TurboPack (Opsional)
      cwd: "./frontend", // Direktori kerja proyek Next.js
      env: {
        NODE_ENV: "production", // Variabel lingkungan untuk mode pengembangan
        PORT: 8008, // Port di mana aplikasi berjalan
      },
    },
  ],
};
