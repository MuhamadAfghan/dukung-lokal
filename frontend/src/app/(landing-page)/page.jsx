"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Navbar from "@/components/layout/navbar";
import Map from "@/components/Map";
import BottomDrawer from "@/components/ui/bottom-drawer";
import { Faq, DUMMY_UMKM_DATA, DUMMY_TESTIMONY } from "@/lib/DUMMY_DATA";
import useCalculateDistance from "@/hook/useCalculateDistance";
import useGeolocation from "@/hook/useGeoLocation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import useGetUmkmAddress from "@/hook/useGetUmkmAddress";
import useModalSurveiStore from "@/store/modalSurveiStore";
// import SurveiUmkmModal from "@/components/ui/survei-umkm";
import useModalLoginStore from "@/store/modalLoginStore";
import axios from "axios";

const TitleSection = ({ className, children }) => {
  return (
    <h2
      className={cn(
        "lg:text-[2rem] text-center text-lg xs:text-xl mb-6 md:text-2xl font-semibold",
        className
      )}
    >
      {children}
    </h2>
  );
};

const FAQ = () => {
  const [isOpen, setIsOpen] = useState(null);

  const handleToggle = (idx) => {
    setIsOpen(isOpen === idx ? null : idx);
  };

  return (
    <section className="lg:space-y-12 md:space-y-10 sm:space-y-8 xs:space-y-6">
      <TitleSection> Cari Jawaban Anda di Sini</TitleSection>

      <Accordion type="single" collapsible className="flex flex-col gap-4 ">
        {Faq.map((item, idx) => (
          <AccordionItem
            key={idx}
            value={`item-${idx}`}
            className="border-b-0 group"
          >
            <AccordionTrigger
              className="flex items-center justify-between px-3 border-2 rounded-lg sm:px-4 md:px-5 lg:px-6 md:py-5 lg:py-6 bg-third border-zinc-100"
              onClick={() => handleToggle(idx)}
            >
              <div className="space-y-2">
                <h3 className="text-sm font-medium xs:text-base md:text-lg lg:text-xl group-hover:underline">
                  {item.question}
                </h3>

                <AccordionContent
                  className="text-base font-normal leading-[1.5] tracking-tight text-zinc-600"
                  style={{ display: isOpen === idx ? "block" : "none" }}
                >
                  <p className="lg:w-2/3 md:w-3/4 w-[95%] sm:w-[90%] md:text-base text-xs xs:text-sm">
                    {item.answer}
                  </p>
                </AccordionContent>
              </div>

              <span>
                {isOpen != idx ? (
                  <svg
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    fill="none"
                    viewBox="0 0 24 24"
                    className="md:h-6 md:w-6 text-zinc-600 sm:h-5 sm:w-5 ms-4"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 7.757v8.486M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                ) : (
                  <svg
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                )}
              </span>
            </AccordionTrigger>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};

const NearestUMKM = () => {
  const [UMKM, setUMKM] = useState([]);
  const addresses = useGetUmkmAddress(UMKM);
  const { position } = useGeolocation({
    latitude: -6.2088,
    longitude: 106.8456,
  });

  const scrollContainerRef = useRef(null);
  const cardRef = useRef(null);

  const getCardWidth = () => {
    return cardRef.current ? cardRef.current.offsetWidth : 0;
  };

  const scrollLeft = () => {
    const cardWidth = getCardWidth();
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -cardWidth - 16,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    const cardWidth = getCardWidth();
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: cardWidth + 16,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products`)
      .then((res) => {
        // console.log(res.data.data);
        setUMKM(res.data.data);
      });
  }, []);

  const distances = useMemo(
    () =>
      UMKM.map((umkm) => {
        if (!umkm.positions?.[0]) return 0;
        return L.latLng(position.latitude, position.longitude).distanceTo(
          L.latLng(umkm.positions[0].latitude, umkm.positions[0].longitude)
        );
      }),
    [UMKM, position.latitude, position.longitude]
  );

  return (
    <section className="pt-4 lg:pt-10 md:pt-8 sm:pt-6 lg:space-y-12 md:space-y-10 sm:space-y-8 xs:space-y-6 ">
      <TitleSection>UMKM di Sekitarmu</TitleSection>
      <div className="relative">
        <button
          onClick={scrollLeft}
          className="absolute z-10 xs:flex hidden items-center justify-center -translate-y-1/2 bg-white border rounded-full size-12 border-zinc-200 xl:right-[calc(100%+2rem)] md:right-[calc(100%-4rem)] right-[calc(100%-4rem)]  top-1/2"
          aria-label="Scroll left"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-6"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
        </button>

        <div
          ref={scrollContainerRef}
          className="grid grid-flow-col gap-4 py-3 overflow-x-auto  no-scrollbar auto-cols-[calc((100%)-5rem/1)] xs:auto-cols-[calc((100%-1rem)/2)] sm:auto-cols-[calc((100%-2rem)/3)] lg:auto-cols-[calc((100%-3rem)/4)] rounded-xl scroll-smooth"
        >
          {UMKM.map((umkm, index) => {
            const distance = distances[index];
            const imagesLength = umkm.images.length;
            const randomInt = (min, max) => {
              return Math.floor(Math.random() * (max - min)) + min;
            };

            return (distance / 1000).toFixed(0) <= 2 ? (
              <Card
                key={umkm.id}
                ref={index === 0 ? cardRef : null}
                className="flex flex-col h-full p-0 border-2 border-zinc-100"
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${
                    umkm.images[randomInt(0, imagesLength)]
                  }`}
                  width={500}
                  height={300}
                  alt="UMKM Terdekat"
                  className="object-cover w-full h-40 rounded-t-xl"
                />
                <div className="flex flex-col h-full gap-2 p-4 text-sm text-zinc-600">
                  <h3 className="text-base font-semibold text-secondary-foreground">
                    {umkm.name}
                  </h3>
                  {/* <span className="leading-[1.2]">
                    {(
                      addresses[`${umkm.id}-${umkm.positions[0].id}`] || ""
                    ).replace("unnamed road,", "") || "Alamat tidak tersedia"}
                  </span> */}
                  <span>
                    {(
                      addresses[`${umkm.id}-${umkm.positions?.[0]?.id}`] || ""
                    ).replace("unnamed road,", "") || "Alamat tidak tersedia"}
                  </span>
                  <span>{`${(distance / 1000).toFixed(0)} km`}</span>
                </div>
              </Card>
            ) : (
              ""
            );
          })}
        </div>

        <button
          onClick={scrollRight}
          className="absolute z-10 xs:flex items-center justify-center -translate-y-1/2 hidden bg-white border rounded-full size-12 border-zinc-200 left-[calc(100%-4rem)] md:left-[calc(100%-4rem)] xl:left-[calc(100%+2rem)] top-1/2"
          aria-label="Scroll right"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-6"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
};

const Testimony = () => {
  return (
    <section className="lg:space-y-12 md:space-y-10 sm:space-y-8 xs:space-y-6">
      <TitleSection>Apa Kata Mereka?</TitleSection>

      <div className="grid gap-4 md:grid-cols-3 sm:grid-cols-2">
        {DUMMY_TESTIMONY.map((item, idx) => (
          <Card
            key={idx}
            className={`flex flex-col p-4 space-y-5 transition-all duration-300 border-2 shadow-none hover:bg-secondary bg-third border-zinc-100 group  ${
              idx == 2 ? "sm:col-span-2 md:col-span-1" : ""
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="rounded-full size-12 bg-zinc-200" />
              <div>
                <h3 className="text-base font-semibold text-secondary-foreground">
                  {item.name}
                </h3>
                <span className="text-sm group-hover:text-secondary-foreground text-zinc-600">
                  {item.role}
                </span>
              </div>
            </div>
            <p className="text-sm group-hover:text-secondary-foreground text-zinc-800">
              {item.description}
            </p>
            <div className="flex-grow" />
            <div className="flex items-center justify-between mt-auto">
              <span className="text-sm group-hover:text-secondary-foreground text-zinc-600">
                {new Date(item.created_at).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </span>

              <span>
                <svg
                  className="size-8 text-secondary group-hover:text-secondary-foreground"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 6a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h3a3 3 0 0 1-3 3H5a1 1 0 1 0 0 2h1a5 5 0 0 0 5-5V8a2 2 0 0 0-2-2H6Zm9 0a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h3a3 3 0 0 1-3 3h-1a1 1 0 1 0 0 2h1a5 5 0 0 0 5-5V8a2 2 0 0 0-2-2h-3Z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

const CTA = ({ setDrawerOpen, openSurveiModal }) => {
  return (
    <section className="py-10">
      <div className="w-full px-5 py-10 sm:px-10 md:py-28 rounded-xl bg-gradient-to-br from-secondary to-secondary/80">
        <div className="grid max-w-screen-lg grid-cols-1 gap-20 mx-auto md:gap-8 md:grid-cols-2">
          <div className="flex items-center order-last md:order-none ">
            <div className="space-y-5">
              <TitleSection
                className={
                  "text-left sm:text-xl md:text-[2.65rem] text-lg font-bold !leading-[1.15] max-w-[60%] md:max-w-full"
                }
              >
                Bantu Kami Meningkatkan Layanan untuk UMKM Lokal
              </TitleSection>
              <p className="text-base text-zinc-800">
                Partisipasi Anda dalam survei ini membantu UMKM lokal
                berkembang. Suara Anda sangat berarti.
              </p>
              <Button
                onClick={() => {
                  setDrawerOpen(false);
                  openSurveiModal();
                }}
                className="flex items-center gap-2 font-medium bg-white text-secondary-foreground"
              >
                Mulai Survei
                <svg
                  className="size-6"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 12H5m14 0-4 4m4-4-4-4"
                  />
                </svg>
              </Button>
            </div>
          </div>

          <div className="relative">
            <svg
              className="size-48 lg:size-[calc(100%+8rem)] md:size-[calc(100%-1rem)] fill-[#aad663] z-10 absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M56.2,-30C68.6,-11,71.5,16,60.6,35C49.6,54,24.8,65,1.7,64.1C-21.5,63.1,-43,50.2,-51,32.9C-59,15.6,-53.4,-6,-42.7,-24.1C-31.9,-42.1,-16,-56.6,3,-58.3C21.9,-60,43.8,-49,56.2,-30Z"
                transform="translate(100 100)"
              />
            </svg>

            <div className="relative grid grid-cols-2 gap-2 place-items-center">
              <Image
                src="/images/umkm/umkm_ilust_1.jpg"
                width={700}
                height={500}
                alt="CTA Illustration"
                className="relative shadow-xl z-20 rounded-sm object-cover lg:w-[11rem] w-[7rem] col-span-2 rounded-xs"
              />
              <Image
                src="/images/umkm/umkm_ilust_2.jpg"
                width={700}
                height={500}
                alt="CTA Illustration"
                className="relative shadow-xl z-20 rounded-sm object-cover w-[11rem] lg:w-[14rem] rounded-xs"
              />
              <Image
                src="/images/umkm/umkm_ilust_3.jpg"
                width={700}
                height={500}
                alt="CTA Illustration"
                className="relative shadow-xl z-20 rounded-sm object-cover lg:top-5 top-3 w-[14rem] lg:w-[18rem] h-[calc(100%+1.5rem)] rounded-xs"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-8 text-sm text-center border-t bg-muted border-zinc-200">
      <div className="container mx-auto">
        <p className="text-lg font-semibold">Dukung Lokal</p>
        <p className="mt-2">
          Sumber:
          <a
            href="https://www.leafletjs.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 text-blue-500 hover:underline"
          >
            {/* Flaticon (Icons)
          </a> */}
            Map (Leaflet Js)
          </a>
          ,
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 text-blue-500 hover:underline"
          >
            Generate AI (Images)
          </a>
        </p>
        <p className="mt-2 text-gray-500">
          &copy; 2024 Dukung Lokal. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default function Page() {
  const [searchLocation, setSearchLocation] = useState(undefined);
  const [isSurveiModalOpen, setIsSurveiModalOpen] = useState(false);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const handleSurveiModalOpen = () => {
    setIsSurveiModalOpen(true);
  };

  const handleSurveiModalClose = () => {
    setIsSurveiModalOpen(false);
  };
  const handleSearchSelect = (location) => setSearchLocation(location);
  const { openSurveiModal } = useModalSurveiStore();

  return (
    <div>
      <div className="overflow-hidden h-dvh">
        <Navbar onSearchSelect={handleSearchSelect} />
        <div className="relative w-full h-full">
          <Map
            zoom={14}
            scrollWheelZoom={true}
            classname="w-full h-full z-1"
            searchLocation={searchLocation}
          />
        </div>
        <BottomDrawer isDrawerOpen={isDrawerOpen} setDrawerOpen={setDrawerOpen}>
          <div className="max-w-screen-xl px-5 mx-auto space-y-6 lg:lg:space-y-12 md:space-y-10 sm:space-y-8">
            <NearestUMKM />
            <FAQ />
            <Testimony />
            <CTA
              setDrawerOpen={setDrawerOpen}
              openSurveiModal={openSurveiModal}
            />
          </div>
          <Footer />
        </BottomDrawer>
      </div>

      {/* <SurveiUmkmModal
        isOpen={isSurveiModalOpen}
        onClose={handleSurveiModalClose}
      /> */}
    </div>
  );
}
