import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import useCalculateDistance from "@/hook/useCalculateDistance";
import { Button } from "../ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
// import { useState } from "react";
import { CornerUpRight } from "lucide-react";
import useTokenStore from "@/hook/useTokenStore";
import useModalLoginStore from "@/store/modalLoginStore";

export default function InfoCard({
  umkm,
  pos,
  addresses,
  position,
  addWaypoints,
  showOtherLocation,
  initLiked,
  umkmPosition,
  myPosition,
  openReportModal,
  is_reported,
}) {
  const [isOpenReportDropdown, setIsOpenReportDropdown] = useState(false);
  const [isLiked, SetIsLiked] = useState(initLiked);
  const token = useTokenStore((state) => state.token);
  const { openLoginModal } = useModalLoginStore();

  // useEffect(() => {
  //   if (!token) {
  //     return openLoginModal();
  //   }
  // }, [token]);

  const distance = useCalculateDistance(
    position.latitude,
    position.longitude,
    umkm.positions[0].latitude,
    umkm.positions[0].longitude
  );

  const isTimeOpen = (openTime, closeTime) => {
    // Get current time
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // Parse opening and closing time
    const [openHour, openMinute] = openTime.split(":").map(Number);
    const [closeHour, closeMinute] = closeTime.split(":").map(Number);

    // Convert to minutes since midnight
    let currentMinutes = currentHour * 60 + currentMinute;
    const openMinutes = openHour * 60 + openMinute;
    let closeMinutes = closeHour * 60 + closeMinute;

    // If closing time is earlier than opening time, add 24 hours to closing time
    if (closeMinutes < openMinutes) {
      closeMinutes += 24 * 60;
      // If current time is after midnight, add 24 hours to current time
      if (currentMinutes < openMinutes) {
        currentMinutes += 24 * 60;
      }
    }

    return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
  };

  const toogleClick = (id) => {
    if (token) {
      SetIsLiked(!isLiked);
      axios
        .put(
          process.env.NEXT_PUBLIC_BACKEND_URL +
            `/api/products/${id}/toggle-like`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          toast.success(
            `Berhasil ${
              res.data.message == "liked" ? "menyukai" : "membatalkan suka"
            } UMKM`
          );
        })
        .catch((error) => {
          toast.error("Terjadi kesalahan saat mengirim survei.");
        });
    } else {
      return openLoginModal();
    }
  };

  return (
    <div className="relative umkm-info-card">
      {umkm.images.length > 1 ? (
        <Carousel>
          <CarouselContent className="w-full m-0">
            {umkm.images.map((_, idx) => (
              <CarouselItem
                key={idx}
                className="pl-0 overflow-hidden rounded-t-md"
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${umkm.images[idx]}`}
                  width={300}
                  height={300}
                  alt="UMKM"
                  className="w-full"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
      ) : (
        <Image
          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${umkm.images[0]}`}
          width={300}
          height={300}
          alt="UMKM"
          className="w-full rounded-t-md"
        />
      )}

      <div className="relative w-full p-4 space-y-3 bg-white rounded-b-md">
        <div className="absolute -top-5 right-4">
          <span
            className="flex items-center justify-center bg-white rounded-full size-10"
            onClick={() => toogleClick(umkm.id)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              viewBox="0 0 24 24"
              className={`cursor-pointer ${
                isLiked && isLiked == true ? "text-red-600" : "text-zinc-300"
              } size-6`}
            >
              <rect width={24} height={24} fill="none" />
              <path
                fill="currentColor"
                d="m12 21.35l-1.45-1.32C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.53z"
              />
            </svg>
          </span>
        </div>

        <div className=" flex items-center gap-4 !-mt-0">
          <div className="relative">
            <div
              onClick={() => setIsOpenReportDropdown(!isOpenReportDropdown)}
              className="border rounded-full cursor-pointer size-12 bg-muted border-zinc-200"
            />

            {isOpenReportDropdown &&
              (!is_reported ? (
                <div
                  className="absolute flex items-center gap-2 px-3 py-2 font-medium -translate-x-1/2 bg-white border rounded-md shadow-md cursor-pointer left-1/2 -bottom-7 border-zinc-200 text-zinc-600"
                  onClick={() => openReportModal(umkm)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={48}
                    height={48}
                    viewBox="0 0 24 24"
                    className="text-red-500 size-4"
                  >
                    <rect width={24} height={24} fill="none" />
                    <path
                      fill="currentColor"
                      fillRule="evenodd"
                      d="m11.998 4.4l-8.92 15.454l17.843-.001zM2.732 21.054a1 1 0 0 1-.866-1.5L11.132 3.5a1 1 0 0 1 1.732 0l9.27 16.053a1 1 0 0 1-.866 1.5zm8.64-11.1h1.255l-.097 4.722h-1.06l-.097-4.722zm.626 7.144a.696.696 0 0 1-.708-.694c0-.385.312-.688.708-.688c.4 0 .712.303.712.688a.697.697 0 0 1-.712.694"
                    />
                  </svg>
                  Laporkan
                </div>
              ) : (
                <div className="absolute px-3 py-2 font-medium -translate-x-1/2 bg-white border rounded-md shadow-md left-1/2 -bottom-7 border-zinc-200 text-zinc-600">
                  Sudah dilaporkan
                </div>
              ))}
          </div>

          <div>
            <h1 className="text-lg font-semibold text-secondary-foreground">
              {umkm.vendor.name}
            </h1>
            <div className="flex items-center gap-[.4rem]">
              <span className="text-sm text-zinc-400">
                {umkm.vendor.contact.phone}
              </span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="text-yellow-500"
                      viewBox="0 0 16 16"
                    >
                      <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.15.15 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.2.2 0 0 1-.054.06.1.1 0 0 1-.066.017H1.146a.1.1 0 0 1-.066-.017.2.2 0 0 1-.054-.06.18.18 0 0 1 .002-.183L7.884 2.073a.15.15 0 0 1 .054-.057m1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767z" />
                      <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" />
                    </svg>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Hati-hati penipuan! Kami tidak pernah meminta kode OTP
                      atau data pribadi lainnya.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-zinc-700">{umkm.name}</h2>
          <span>
            {umkm.category} | {umkm.type}
          </span>
        </div>

        <div className="text-sm font-bold text-green-600">
          {umkm.price.max
            ? `Rp ${new Intl.NumberFormat("id-ID").format(
                umkm.price.min
              )} - Rp ${new Intl.NumberFormat("id-ID").format(umkm.price.max)}`
            : `Mulai dari Rp ${new Intl.NumberFormat("id-ID").format(
                umkm.price.min
              )}`}
        </div>

        <div className="flex items-start justify-between">
          <div className="space-y-1 leading-4 tracking-tight">
            <div className="flex items-center gap-2">
              <span>
                <svg
                  className="size-4 text-secondary-foreground"
                  xmlns="http://www.w3.org/2000/svg"
                  width={20}
                  height={20}
                  viewBox="0 0 1024 1024"
                >
                  <rect width={1024} height={1024} fill="none" />
                  <path
                    fill="currentColor"
                    d="M800 416a288 288 0 1 0-576 0c0 118.144 94.528 272.128 288 456.576C705.472 688.128 800 534.144 800 416M512 960C277.312 746.688 160 565.312 160 416a352 352 0 0 1 704 0c0 149.312-117.312 330.688-352 544"
                  />
                  <path
                    fill="currentColor"
                    d="M512 512a96 96 0 1 0 0-192a96 96 0 0 0 0 192m0 64a160 160 0 1 1 0-320a160 160 0 0 1 0 320"
                  />
                </svg>
              </span>
              <span>
                {(addresses[`${umkm.id}-${pos.id}`] || "").replace(
                  "unnamed road,",
                  ""
                ) || "Alamat tidak tersedia"}
              </span>
            </div>

            {/* <<<<<<< HEAD
            <span>
              {umkm.open_time.slice(0, -3)} - {umkm.close_time.slice(0, -3)} WIB
              | {isTimeOpen(umkm.open_time, umkm.close_time) ? "Buka" : "Tutup"}
            </span>
======= */}
            <div className="flex items-center gap-2">
              <span>
                <svg
                  className="size-4 text-secondary-foreground"
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                >
                  <rect width={24} height={24} fill="none" />
                  <g fill="none">
                    <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                    <path
                      fill="currentColor"
                      d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2m0 2a8 8 0 1 0 0 16a8 8 0 0 0 0-16m0 2a1 1 0 0 1 .993.883L13 7v4.586l2.707 2.707a1 1 0 0 1-1.32 1.497l-.094-.083l-3-3a1 1 0 0 1-.284-.576L11 12V7a1 1 0 0 1 1-1"
                    />
                  </g>
                </svg>
              </span>

              <span>
                {umkm.open_time.slice(0, -3)} - {umkm.close_time.slice(0, -3)}{" "}
                WIB |{" "}
                {isTimeOpen(umkm.open_time, umkm.close_time) ? "Buka" : "Tutup"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span>
                <svg
                  className="size-4 text-secondary-foreground"
                  xmlns="http://www.w3.org/2000/svg"
                  width={256}
                  height={256}
                  viewBox="0 0 256 256"
                >
                  <rect width={256} height={256} fill="none" />
                  <path
                    fill="currentColor"
                    d="m235.32 73.37l-52.69-52.68a16 16 0 0 0-22.63 0L20.68 160a16 16 0 0 0 0 22.63l52.69 52.68a16 16 0 0 0 22.63 0L235.32 96a16 16 0 0 0 0-22.63M84.68 224L32 171.31l32-32l26.34 26.35a8 8 0 0 0 11.32-11.32L75.31 128L96 107.31l26.34 26.35a8 8 0 0 0 11.32-11.32L107.31 96L128 75.31l26.34 26.35a8 8 0 0 0 11.32-11.32L139.31 64l32-32L224 84.69Z"
                  />
                </svg>
              </span>

              <span>{(distance / 1000).toFixed(0)} km</span>
            </div>
            {/* >>>>>>> 4c541e078f6f0b11639c195d79b8cf0faa1bea55 */}
          </div>

          <div
            onClick={() =>
              addWaypoints([
                L.latLng(myPosition.latitude, myPosition.longitude),
                L.latLng(umkmPosition),
              ])
            }
            className="p-2 border-2 border-blue-500 rounded-full cursor-pointer"
          >
            <Image
              src="/direction.svg"
              height={10}
              width={10}
              alt="Direction"
              className="max-w-6 max-h-6"
            />
          </div>
        </div>

        {umkm.positions.length > 1 && (
          <Button onClick={() => showOtherLocation(umkm.id)} className="w-full">
            Lihat lokasi lainnya
          </Button>
        )}
      </div>
    </div>
  );
}
