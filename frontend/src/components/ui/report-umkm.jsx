import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "./badge";
import { useState } from "react";
import { Textarea } from "./textarea";
import { Button } from "./button";
import toast from "react-hot-toast";
import useTokenStore from "@/hook/useTokenStore";
import useModalLoginStore from "@/store/modalLoginStore";
import axios from "axios";

const reportReasons = [
  { value: "fraud", label: "Penipuan" },
  { value: "poor_service", label: "Layanan Buruk" },
  { value: "misleading_info", label: "Informasi Menyesatkan" },
  { value: "poor_quality", label: "Kualitas Buruk" },
  { value: "unsafe_product", label: "Produk Tidak Aman" },
  { value: "illegal_activity", label: "Kegiatan Ilegal" },
  { value: "wrong_product", label: "Produk Tidak Sesuai" },
  { value: "overcharged", label: "Harga Terlalu Mahal" },
  { value: "other", label: "Lainnya" },
];

export default function ReportUmkmModal({
  isOpen,
  onClose,
  selectedReportUmkm,
}) {
  const [selectedReason, setSelectedReason] = useState(null);
  const [description, setDescription] = useState("");
  const token = useTokenStore((state) => state.token);
  const { openLoginModal } = useModalLoginStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState({});

  // useEffect(() => {
  //   if (!token) {
  //     return openLoginModal();
  //   }
  // }, [token]);

  const handleRadioChange = (value) => {
    setSelectedReason(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      return openLoginModal();
    }
    if (!selectedReason) {
      return setError({ selectedReason: "Pilih alasan laporan" });
    }
    if (selectedReason == "other" && !description) {
      return setError({ description: "Deskripsi tidak boleh kosong" });
    }

    toast.promise(
      // Simulasi
      new Promise((resolve, reject) => {
        // setTimeout(() => {
        //   console.log({ selectedReason, description });
        //   resolve();
        //   // reject();
        // }, 1000);
        axios
          .post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/${selectedReportUmkm.id}/report`,
            {
              category: selectedReason,
              description,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((response) => {
            resolve(response.data);
          })
          .catch((error) => {
            reject(error);
          });
      }),
      {
        loading: "Harap tunggu...",
        success: <b>Laporan berhasil dikirim!</b>,
        error: <b>Kamu sudah melaporkan umkm ini sebelumnya</b>,
      }
    );
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent onClose={onClose} className="space-y-3">
        <DialogHeader className="space-y-3">
          <DialogTitle>
            Laporkan{" "}
            <span className=" text-primary">
              {selectedReportUmkm && selectedReportUmkm.vendor.name}
            </span>
          </DialogTitle>
          <DialogDescription>
            Jika Anda mengalami masalah atau memiliki umpan balik mengenai UMKM
            ini, silakan berikan laporan Anda di bawah ini.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex flex-wrap gap-2">
            {reportReasons.map((reason, idx) => (
              <div key={idx}>
                <input
                  type="radio"
                  name="reportReasons"
                  id={`reportReasons-${idx}`}
                  value={reason.value}
                  onChange={() => handleRadioChange(reason.value)}
                  checked={selectedReason == reason.value}
                  className="absolute hidden sr-only"
                />
                <label htmlFor={`reportReasons-${idx}`}>
                  <Badge
                    className={`px-5 py-2 text-sm font-normal  ${
                      selectedReason === reason.value
                        ? "bg-primary !text-white"
                        : "bg-[#f0f0f0] text-zinc-500 hover:bg-zinc-200 hover:text-gray-600"
                    } rounded-full shadow-none  cursor-pointer `}
                  >
                    {reason.label}
                  </Badge>
                </label>
              </div>
            ))}
            {error.selectedReason && (
              <p className="text-sm text-red-500">{error.selectedReason}</p>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold">Alasan</h3>
            <p className="text-sm font-normal text-zinc-500">
              Jelaskan permasalahan yang Anda hadapi.
            </p>
          </div>

          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tuliskan detail masalah"
            className="placeholder:text-sm bg-muted rounded-xl focus-visible:ring-primary min-h-28"
          />

          {error.description && (
            <p className="pt-0 text-sm text-red-500">{error.description}</p>
          )}

          <Button size="lg" type="submit" className="w-full">
            Kirim Laporan
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
