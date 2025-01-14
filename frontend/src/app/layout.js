import { Toaster } from "react-hot-toast";
import "./globals.css";
import { Bricolage_Grotesque } from "next/font/google";
import ExpandableFAB from "@/components/ui/ExpandableFAB";

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
});

export const metadata = {
  title: "Dukung Lokal",
  description:
    "Dukung Lokal - Platform untuk mendukung produk lokal dan UMKM di Indonesia.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="./dl_icon.svg" sizes="any" />
      </head>
      <body
        className={`${bricolageGrotesque.className} antialiased bg-[#fefefe] overflow-x-hidden`}
      >
        {children}
        <Toaster position="top-right" reverseOrder={false} />
        <div className="fixed z-10">
          <ExpandableFAB />
        </div>
      </body>
    </html>
  );
}
