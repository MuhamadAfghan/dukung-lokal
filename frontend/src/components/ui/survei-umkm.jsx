"use client";

import React, { use, useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Checkbox } from "@/components/ui/checkbox";
import useTokenStore from "@/hook/useTokenStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import useGeolocation from "@/hook/useGeoLocation";
import InputGroup from "./input-group";
import { Label } from "./label";
import { Button } from "./button";
import Image from "next/image";
import useFetchAddress from "@/hook/useFetchAddress";
import toast from "react-hot-toast";
import axios from "axios";
import Cookies from "js-cookie";
import useModalSurveiStore from "@/store/modalSurveiStore";
import useModalLoginStore from "@/store/modalLoginStore";

const defaultIcon = L.icon({
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  iconSize: [25, 41],
  shadowSize: [41, 41],
  iconAnchor: [12, 41],
  shadowAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const UMKM_Category = [
  { label: "Makanan", value: "Makanan" },
  { label: "Minuman", value: "Minuman" },
  { label: "Pakaian", value: "Pakaian" },
  { label: "Furnitur", value: "Furnitur" },
  { label: "Elektronik", value: "Elektronik" },
  { label: "Jasa & Layanan", value: "Jasa & Layanan" },
  { label: "Kerajinan", value: "Kerajinan" },
  { label: "Pertanian/Perkebunan", value: "Pertanian/Perkebunan" },
  { label: "Bahan Pokok", value: "Bahan Pokok" },
];

// const dummyRequest = {
//   uid: "123",
//   product: {
//     name: "Product Name",
//     description: "Product Description",
//     category: "Product Category",
//     type: "Product Type",
//   },
// };

const formSchema = z
  .object({
    productName: z.string().min(3, "Nama produk minimal 3 karakter"),
    productDescription: z.string().optional(),
    vendorName: z.string().min(3, "Nama pedagang minimal 3 karakter"),
    contact: z
      .string()
      .min(10, "Nomor telepon minimal 10 digit")
      .max(13, "Nomor telepon maksimal 13 digit"),
    email: z.string().email("Email tidak valid").or(z.literal("")).optional(),
    category: z.string().min(1, "Kategori harus dipilih"),
    type: z.string().min(1, "Tipe harus dipilih"),
    minPrice: z.string().min(1, "Harga minimum harus diisi"),
    maxPrice: z.string().min(1, "Harga maksimum harus diisi"),
    openTime: z.string().min(1, "Waktu buka harus diisi"),
    closeTime: z.string().min(1, "Waktu tutup harus diisi"),
    address: z.string().min(5, "Alamat harus diisi"),
    images: z.array(z.any()).min(1, "Gambar harus diisi"),
    omzetPerWeek: z.string().min(1, "Omzet per minggu harus diisi"),
    position: z.object({
      latitude: z.number(),
      longitude: z.number(),
    }),
  })
  .refine(
    (data) => {
      const minPrice = parseInt(data.minPrice.replace(/\D/g, ""));
      const maxPrice = parseInt(data.maxPrice.replace(/\D/g, ""));
      return minPrice <= maxPrice;
    },
    {
      message: "Harga minimum melebihi harga maksimum",
      path: ["minPrice"], // shows error on minPrice field
    }
  )
  .refine(
    (data) => {
      console.log(data.address);
      return data.address.toLowerCase().includes("indonesia");
    },
    {
      message: "Lokasi harus berada di Indonesia",
      path: ["address"],
    }
  );

const Map = ({ setValue, error = null }) => {
  const { position } = useGeolocation();
  const [markerPosition, setMarkerPosition] = useState(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [currentAddress, setCurrentAddress] = useState(null);
  const address = useFetchAddress(
    markerPosition ? markerPosition.lat : position.latitude,
    markerPosition ? markerPosition.lng : position.longitude,
    (newAddress) => {
      setCurrentAddress(newAddress);
      setValue("address", newAddress);
    }
  );

  useEffect(() => {
    if (address) {
      setCurrentAddress(address);
      setValue("address", address);
    }
  }, [address, setValue]);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("mapSurvei", {
        dragging: false,
        scrollWheelZoom: true,
        zoomControl: false,
        doubleClickZoom: true,
      }).setView(
        [
          markerPosition ? markerPosition.lat : position.latitude,
          markerPosition ? markerPosition.lng : position.longitude,
        ],
        12
      );

      L.tileLayer(
        "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
        {
          maxZoom: 18,
          id: "mapbox/streets-v11",
          tileSize: 512,
          zoomOffset: -1,
          accessToken:
            "pk.eyJ1IjoidGFyLWhlbCIsImEiOiJjbDJnYWRieGMwMTlrM2luenIzMzZwbGJ2In0.RQRMAJqClc4qoNwROT8Umg",
        }
      ).addTo(mapRef.current);

      L.Marker.prototype.options.icon = defaultIcon;

      markerRef.current = L.marker(
        [
          markerPosition ? markerPosition.lat : position.latitude,
          markerPosition ? markerPosition.lng : position.longitude,
        ],
        {
          draggable: true,
        }
      ).addTo(mapRef.current);

      mapRef.current.on("click", (e) => {
        const newPosition = e.latlng;
        setMarkerPosition(newPosition);
        markerRef.current.setLatLng(newPosition);
        setValue("address", address);
        setValue("position", {
          latitude: newPosition.lat,
          longitude: newPosition.lng,
        });
      });

      markerRef.current.on("dragend", (e) => {
        const marker = e.target;
        const position = marker.getLatLng();
        setMarkerPosition(position);
        setValue("address", address);
        setValue("position", {
          latitude: position.lat,
          longitude: position.lng,
        });
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, [position, address, setValue]);

  useEffect(() => {
    if (markerRef.current && markerPosition) {
      markerRef.current.setLatLng(markerPosition);
    }
  }, [markerPosition]);

  return (
    <div className="space-y-5">
      <Label className="block">Lokasi</Label>
      {/* <div
        id="map"
        className="!h-80  outline-none border border-zinc-300 rounded-lg"
      ></div> */}
      <div
        id="mapSurvei"
        className="!h-80  outline-none border border-zinc-300 rounded-lg"
      ></div>
      <Label className="block">
        {(address ? address : "Klik pada peta untuk menentukan alamat").replace(
          "unnamed road,",
          ""
        )}
      </Label>
      {error && <p className="text-sm text-red-500 !mt-1 ">{error}</p>}
    </div>
  );
};

const ImagePicker = ({ setValue }) => {
  const [images, setImages] = useState([]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map((file) => ({
      id: URL.createObjectURL(file),
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prevImages) => [...prevImages, ...newImages]);
    setValue("images", [...images, ...newImages]);
  };

  const removeImage = (id) => {
    setImages((prevImages) => prevImages.filter((image) => image.id !== id));
    setValue(
      "images",
      images.filter((image) => image.id !== id)
    );
  };

  return (
    <div className="space-y-3">
      <Label>Upload gambar</Label>
      {images.length > 0 && (
        <div className="flex max-w-full gap-2.5 overflow-auto no-scrollbar">
          {images.map((image) => (
            <div className="relative w-auto" key={image.id}>
              <Image
                src={image.preview}
                width={64}
                height={64}
                alt="Preview"
                className="object-cover h-20 border rounded min-w-20 border-zinc-200"
              />
              <button
                onClick={() => removeImage(image.id)}
                className="absolute flex items-center justify-center text-xs text-white bg-red-600 rounded-full size-4 bottom-1 right-1"
              >
                -
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full border-2 border-dashed rounded-lg cursor-pointer h-44 border-zinc-300 bg-zinc-50 hover:bg-zinc-100"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-4 text-zinc-500"
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
                d="m3 16 5-7 6 6.5m6.5 2.5L16 13l-4.286 6M14 10h.01M4 19h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z"
              />
            </svg>
            <p className="mb-2 text-sm text-zinc-500">Click to upload</p>
            <p className="text-xs text-zinc-500">
              {" "}
              PNG, JPG or JPEG (MAX. 2MB)
            </p>
          </div>
          <input
            id="dropzone-file"
            multiple
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>

      <p className="text-xs text-red-500">
        {images.length < 1 && "Upload gambar produk minimal 1 gambar"}
      </p>
    </div>
  );
};

export default function SurveiUmkmModal({ isOpen, onClose }) {
  const { isSurveiModalOpen, closeSurveiModal } = useModalSurveiStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = useTokenStore((state) => state.token);
  const { openLoginModal } = useModalLoginStore();

  // useEffect(() => {
  //   const newToken = Cookies.get("token");
  //   if (newToken) {
  //     setToken(newToken);
  //   } else {
  //     setIsGuest(true);
  //   }
  // }, []);

  // useEffect(() => {
  //   const newToken = Cookies.get("token") || null;
  //   setToken(newToken);
  //   setIsGuest(!newToken);
  // }, [closeLoginModal]);

  useEffect(() => {
    if (isSurveiModalOpen) {
      document.body.classList.add("pointer-events-full-auto");
    }
  }, [isSurveiModalOpen]);

  const formatRupiah = (value) => {
    if (!value) return "";
    const number = value.replace(/[^,\d]/g, "");
    return new Intl.NumberFormat("id-ID").format(number);
  };

  const parseRupiah = (formattedValue) => {
    if (!formattedValue) return "";
    return formattedValue.replace(/\D/g, "");
  };

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
      vendorName: "",
      contact: "",
      email: "",
      category: "",
      type: "",
      minPrice: "",
      maxPrice: "",
      openTime: "",
      closeTime: "",
      address: "",
      images: [],
      omzetPerWeek: "",
      position: {
        latitude: 0,
        longitude: 0,
      },
    },
  });

  const onSubmit = (data) => {
    setIsSubmitting(true);

    const formData = new FormData();
    // Add basic fields
    formData.append("name", data.productName);
    formData.append("description", "No description provided");
    formData.append(
      "category",
      data.category.charAt(0).toUpperCase() +
        data.category.slice(1).replace("_", " ")
    );
    formData.append("type", data.type);
    formData.append("open_time", data.openTime);
    formData.append("close_time", data.closeTime);
    formData.append("omzet_per_week", data.omzetPerWeek);

    // Add images
    data.images.forEach((img, index) => {
      formData.append(`images[${index}]`, img.file);
    });

    // Add price array
    formData.append(
      "price[min]",
      parseInt(data.minPrice.replace(/\./g, ""), 10)
    );
    formData.append(
      "price[max]",
      parseInt(data.maxPrice.replace(/\./g, ""), 10)
    );

    // Add position array
    formData.append("position[latitude]", data.position.latitude);
    formData.append("position[longitude]", data.position.longitude);

    // Add vendor information
    formData.append("vendor[name]", data.vendorName);
    formData.append("vendor[contact][email]", data.email);
    formData.append("vendor[contact][phone]", data.contact);

    // // Log the FormData entries for debugging
    // for (let pair of formData.entries()) {
    //   console.log(pair[0] + ": " + pair[1]);
    // }

    if (!token) {
      setIsSubmitting(false);
      toast.error("Anda harus login terlebih dahulu.");
      openLoginModal();
      return;
    }

    axios
      .post(process.env.NEXT_PUBLIC_BACKEND_URL + "/api/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res);
        toast.success("Survei berhasil dikirim!");
        closeSurveiModal();
        window.location.reload();
      })
      .catch((error) => {
        setIsSubmitting(false);
        // console.error("Error response:", error.response?.data);
        // toast.error("Terjadi kesalahan saat mengirim survei.");
        if (error.response?.data?.errors) {
          Object.values(error.response.data.errors).forEach((errArray) => {
            errArray.forEach((err) => {
              toast.error(err);
            });
          });
        } else {
          toast.error(error.response.data.message);
        }
      });
  };

  return (
    <>
      <Dialog open={isSurveiModalOpen}>
        {/* <Dialog open={isOpen}> */}
        <DialogContent
          onClose={closeSurveiModal}
          className="w-full no-scrollbar bg-transparent max-w-2xl p-0 border-0 active:ring-0 h-full max-h-[calc(100vh-2rem)] overflow-auto sm:rounded-none border-none"
          id="umkm-survei-form"
        >
          <VisuallyHidden.Root>
            <DialogHeader>
              <DialogTitle />
              <DialogDescription />
            </DialogHeader>
          </VisuallyHidden.Root>
          {/* <<<<<<< HEAD */}
          <div className="max-w-2xl p-6 mx-auto space-y-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-zinc-800 ">
              Tambahkan UMKM Lokal Baru
            </h1>
            <p className="text-zinc-600 ">
              Bantu kami memperkenalkan UMKM lokal ke lebih banyak orang dan
              memberikan dukungan kepada usaha kecil di sekitar Anda.
            </p>
            {/* =======
        <DialogContent onClose={closeSurveiModal} className="w-full no-scrollbar bg-transparent max-w-2xl p-0 border-0 active:ring-0 h-full max-h-[calc(100vh-2rem)] overflow-auto sm:rounded-none border-none" id="umkm-survei-form">
          <div className="max-w-2xl p-6 mx-auto space-y-6 bg-white rounded-lg shadow-md" >
            <h1 className="text-2xl font-bold text-zinc-800 ">Tambahkan UMKM Lokal Baru</h1>
            <p className="text-zinc-600 ">Bantu kami memperkenalkan UMKM lokal ke lebih banyak orang dan memberikan dukungan kepada usaha kecil di sekitar Anda.</p>
>>>>>>> 4c541e078f6f0b11639c195d79b8cf0faa1bea55 */}

            <form
              className="w-full space-y-6"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Controller
                name="productName"
                control={control}
                render={({ field }) => (
                  <InputGroup
                    label="Nama Produk"
                    placeholder="Input Nama Produk"
                    error={errors.productName?.message}
                    {...field}
                  />
                )}
              />
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Controller
                  name="vendorName"
                  control={control}
                  render={({ field }) => (
                    <InputGroup
                      label="Nama Pedagang"
                      placeholder="Contoh: John Doe"
                      error={errors.vendorName?.message}
                      {...field}
                    />
                  )}
                />
                <Controller
                  name="contact"
                  control={control}
                  render={({ field }) => (
                    <InputGroup
                      label="Kontak"
                      placeholder="Contoh: 081234567890"
                      error={errors.contact?.message}
                      type="number"
                      compareValue="08"
                      {...field}
                    />
                  )}
                />
              </div>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <InputGroup
                    label="Email Penjual"
                    optional={true}
                    placeholder="Contoh: email@example"
                    error={errors.email?.message}
                    {...field}
                  />
                )}
              />

              <div className="space-y-3">
                <Label>Kategori Product</Label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full h-10 focus-visible:ring-primary">
                        <SelectValue placeholder="Kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        {UMKM_Category.map((category) => (
                          <SelectItem
                            key={category.value}
                            value={category.value}
                          >
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category && (
                  <p className="text-sm text-red-500">
                    {errors.category.message}
                  </p>
                )}
              </div>

              {/* <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <InputGroup
                  label="Tipe Produk"
                  placeholder="Contoh: Makanan Ringan"
                  error={errors.type?.message}
                  {...field}
                />
              )}
            /> */}

              <div className="space-y-3">
                <Label>Tipe Berjualan</Label>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full h-10 focus-visible:ring-primary">
                        <SelectValue placeholder="Tipe Berjualan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tetap">Tetap</SelectItem>
                        <SelectItem value="Keliling">Berkeliling</SelectItem>
                        <SelectItem value="Ruko">Memiliki Ruko</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category && (
                  <p className="text-sm text-red-500">
                    {errors.category.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Controller
                  name="minPrice"
                  control={control}
                  render={({ field }) => (
                    <InputGroup
                      label="Harga Minimum"
                      placeholder="Contoh: 5000"
                      error={errors.minPrice?.message}
                      prefix="Rp"
                      value={formatRupiah(field.value || "")}
                      onChange={(e) => {
                        const rawValue = parseRupiah(e.target.value);
                        field.onChange(rawValue);
                      }}
                    />
                  )}
                />
                <Controller
                  name="maxPrice"
                  control={control}
                  render={({ field }) => (
                    <InputGroup
                      label="Harga Maksimum"
                      placeholder="Contoh: 20000"
                      error={errors.maxPrice?.message}
                      prefix="Rp"
                      value={formatRupiah(field.value || "")}
                      onChange={(e) => {
                        const rawValue = parseRupiah(e.target.value);
                        field.onChange(rawValue);
                      }}
                    />
                  )}
                />
              </div>

              {/* <Controller
              name="omzetPerWeek"
              control={control}
              render={({ field }) => (
                <InputGroup
                  label="Omzet per Minggu"
                  placeholder="Contoh: 1000000"
                  type="number"
                  error={errors.omzetPerWeek?.message}
                  {...field}
                />
              )}
            /> */}

              <div className="space-y-3">
                <Label>Omzet per Minggu</Label>
                <Controller
                  name="omzetPerWeek"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full h-10 focus-visible:ring-primary">
                        <SelectValue placeholder="Perkiraan pendapatan omset perminggu" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">{"< Rp. 100.000"}</SelectItem>
                        <SelectItem value="2">
                          {"Rp. 100.000 - Rp. 500.000"}
                        </SelectItem>
                        <SelectItem value="3">
                          {"Rp. 500.000 - Rp. 1.000.000"}
                        </SelectItem>
                        <SelectItem value="4">
                          {"Rp. 1.000.000 - Rp. 2.000.000"}
                        </SelectItem>
                        <SelectItem value="5">
                          {"Rp. 2.000.000 - Rp. 5.000.000"}
                        </SelectItem>
                        <SelectItem value="6">
                          {"Rp. 5.000.000 - Rp. 10.000.000"}
                        </SelectItem>
                        <SelectItem value="7">
                          {"Rp. 10.000.000 - Rp. 15.000.000"}
                        </SelectItem>
                        <SelectItem value="8">
                          {"Rp. 15.000.000 - Rp. 20.000.000"}
                        </SelectItem>
                        <SelectItem value="9">
                          {"Rp. 20.000.000 - Rp. 24.000.000"}
                        </SelectItem>
                        <SelectItem value="25000000">
                          {"Rp. 24.000.000 >"}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.omzetPerWeek && (
                  <p className="text-sm text-red-500">
                    {errors.omzetPerWeek.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Controller
                  name="openTime"
                  control={control}
                  render={({ field }) => (
                    <InputGroup
                      label="Waktu Buka"
                      type="time"
                      error={errors.openTime?.message}
                      {...field}
                    />
                  )}
                />
                <Controller
                  name="closeTime"
                  control={control}
                  render={({ field }) => (
                    <InputGroup
                      label="Waktu Tutup"
                      type="time"
                      error={errors.closeTime?.message}
                      {...field}
                    />
                  )}
                />
              </div>

              <Map setValue={setValue} error={errors.address?.message} />

              <ImagePicker setValue={setValue} />

              <div className="flex items-center gap-3">
                <Checkbox id="confirm" />
                <Label className="font-normal" htmlFor="confirm">
                  Dengan ini, saya menyatakan bahwa data yang saya masukkan
                  sudah benar dan sesuai.
                </Label>
              </div>

              {/* <<<<<<< HEAD
            <Button size="lg" type="submit">
              Submit
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
======= */}
              {/* <div className="flex items-center gap-3">
                <Checkbox />
                <Label className="font-normal">Dengan ini, saya menyatakan bahwa data yang saya masukkan sudah benar dan sesuai.</Label>
              </div> */}

              <Button size="lg" type="submit" disabled={isSubmitting}>
                {isSubmitting ? <span className="loading-spiner" /> : "Submit"}
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
    // >>>>>>> 4c541e078f6f0b11639c195d79b8cf0faa1bea55
  );
}
