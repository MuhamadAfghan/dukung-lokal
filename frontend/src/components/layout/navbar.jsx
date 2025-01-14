"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Input } from "../ui/input";
import searchIcon from "../icons/search.svg";
import axios from "axios";

export default function Navbar({ onSearchSelect }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [UMKM, setUMKM] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products`)
      .then((res) => {
        console.log('data: ',res.data.data);
        setUMKM(res.data.data);
      });
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      setSuggestions([]);
    } else {
      const filteredSuggestions = UMKM.filter((umkm) =>
        umkm.name.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    }
  };

  const handleSuggestionSelect = (location) => {
    onSearchSelect(location);
    setSuggestions([]);
    setSearchQuery("");
  };

  return (
    <header className="absolute top-0 z-10 px-5 py-3 bg-transparent">
      <div className="flex items-center gap-16">
        <div className="relative flex items-center h-12 px-3 bg-white border rounded-full shadow-lg border-zinc-200 w-[22rem]">
          <Input
            type="text"
            placeholder="Cari UMKM di sekitarmu"
            className="border-none shadow-none focus-visible:ring-0"
            value={searchQuery}
            onChange={handleSearchChange}
          />

          <Image src={searchIcon} alt="Search" />

          {suggestions.length > 0 && (
            <div className="absolute max-h-72 overflow-y-auto top-full left-0 w-full mt-2 bg-white border rounded-md shadow-lg z-[9999]">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100"
                  onClick={() =>
                    handleSuggestionSelect(suggestion.positions[0])
                  }
                >
                  {suggestion.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
