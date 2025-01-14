"use client";

import React, { useRef, useEffect, useState } from "react";
import {
  ClipboardPen,
  TrendingUp,
  EllipsisVertical,
  Trophy,
  UserCog,
  House,
  DoorClosed,
  User,
} from "lucide-react";
import SurveiUmkmModal from "./survei-umkm";
import useModalSurveiStore from "@/store/modalSurveiStore";
import AuthModal from "./login";
import Cookies from "js-cookie";
import useTokenStore from "@/hook/useTokenStore";
import useModalLoginStore from "@/store/modalLoginStore";

export default function ExpandableFAB() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const { openSurveiModal } = useModalSurveiStore();
  const { openLoginModal } = useModalLoginStore();

  const logoutTrigger = () => {
    //get current url
    const currentUrl = window.location.href;
    Cookies.remove("token");
    //refresh page
    window.location.href = currentUrl;
  };

  const menuItems = [
    {
      icon: <House size={24} />,
      label: "Beranda",
      color: "bg-red-500",
      href: "/",
    },
    {
      icon: <ClipboardPen size={24} />,
      label: "Mulai Survei",
      color: "bg-blue-600",
      onClick: openSurveiModal,
    },
    {
      icon: <TrendingUp size={24} />,
      label: "Data UMKM",
      color: "bg-green-500",
      href: "/data-umkm",
    },
    {
      icon: <Trophy size={24} />,
      label: "Papan Peringkat",
      color: "bg-yellow-500",
      href: "/papan-peringkat",
    },
  ];

  if (!useTokenStore((state) => state.token)) {
    menuItems.push(
      {
        icon: <User size={24} />,
        label: "Login",
        color: "bg-red-600",
        onClick: openLoginModal,
      },
    );
  }

  if (useTokenStore((state) => state.token)) {
    menuItems.push(
      {
        icon: <UserCog size={24} />,
        label: "Pengaturan Akun",
        color: "bg-gray-600",
        href: "/pengaturan-akun",
      },
      {
        icon: <DoorClosed size={24} />,
        label: "Keluar",
        color: "bg-red-500",
        onClick: logoutTrigger,
      }
    );
  }

  const renderButton = (item) => {
    return (
      <button
        onClick={item.onClick ?? (() => (window.location.href = item.href))}
        className={`
          ${item.color} text-white p-4 rounded-full shadow-lg
          transform transition-all duration-300
          hover:scale-110 hover:shadow-xl
          flex items-center justify-center
          relative z-10
        `}
      >
        {item.icon}
      </button>
    );
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div
        className="fixed bottom-14 sm:right-8 right-5 md:bottom-8"
        ref={menuRef}
      >
        <div className="relative mb-4">
          <div className="absolute bottom-0 right-0 flex flex-col items-center gap-3 transition-all duration-500">
            {menuItems.map(
              (item, index) =>
                window.location.pathname !== item.href && (
                  <div
                    key={item.label}
                    className={`relative group transition-all duration-500 ${isOpen
                      ? "translate-y-0 opacity-100"
                      : "translate-y-16 opacity-0 -z-999"
                      }`}
                    style={{
                      transitionDelay: isOpen
                        ? `${(menuItems.length - index - 1) * 100}ms`
                        : "0ms",
                    }}
                  >
                    {renderButton(item)}

                    <div className="absolute -translate-y-1/2 pointer-events-none right-[4.5rem] top-1/2">
                      <div
                        className={`px-3 py-2 text-sm text-white transition-all duration-300 transform -translate-x-4 rounded-lg shadow-lg opacity-0 whitespace-nowrap group-hover:opacity-100 group-hover:translate-x-0 ${item.color}`}
                      >
                        {item.label}
                      </div>
                    </div>
                  </div>
                )
            )}
          </div>
        </div>



        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            bg-primary text-white p-4 rounded-full shadow-lg
            transform transition-all duration-500 ease-in-out
            hover:shadow-xl hover:scale-105
            relative z-20
          `}
        >
          <EllipsisVertical
            size={24}
            className={`transform transition-transform duration-500 ${isOpen ? "rotate-90" : "rotate-0"
              }`}
          />
        </button>
      </div>
      <SurveiUmkmModal />
      <AuthModal />
    </>
  );
}
