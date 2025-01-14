"use client";
import { Card } from "@/components/ui/card";
// <<<<<<< HEAD
import { useCallback, useEffect, useState } from "react";
import {
  User,
  Mail,
  Lock,
  Trophy,
  AtSign,
  Menu,
  MoreVertical,
  Delete,
  Undo2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import axios from "axios";
import Cookies from "js-cookie";
import Skeleton from "react-loading-skeleton";
import { Link as LinkIcon, Plus, X, Instagram } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import L from "leaflet";
import useTokenStore from "@/hook/useTokenStore";
import useModalLoginStore from "@/store/modalLoginStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FacebookIcon,
  InstagramIcon,
  TiktokIcon,
  YoutubeIcon,
} from "@/lib/sosmedIcon";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const SocialMediaInput = ({ platform, value, onDelete }) => {
  const getIcon = () => {
    switch (platform.toLowerCase()) {
      case "instagram":
        return (
          <InstagramIcon className="w-4 h-4 mr-2 text-zinc-400 sm:w-5 sm:h-5" />
        );
      case "facebook":
        return (
          <FacebookIcon className="w-4 h-4 mr-2 text-zinc-400 sm:w-5 sm:h-5" />
        );
      case "tiktok":
        return (
          <TiktokIcon className="w-4 h-4 mr-2 text-zinc-400 sm:w-5 sm:h-5" />
        );
      case "youtube":
        return (
          <YoutubeIcon className="w-4 h-4 mr-2 text-zinc-400 sm:w-5 sm:h-5" />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-zinc-700">
        {platform.charAt(0).toUpperCase() + platform.slice(1)}
      </label>
      <div className="flex items-center gap-2 p-2 bg-white border rounded-lg border-zinc-200 sm:p-3">
        {getIcon()}
        <input
          type="text"
          className="flex-1 text-xs bg-transparent outline-none sm:text-sm"
          value={value}
          disabled
        />
        <Delete
          className="w-4 h-4 text-red-500 cursor-pointer"
          onClick={onDelete}
        />
      </div>
    </div>
  );
};

const MyUMKM = () => {
  const [umkm, setUmkm] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // const [token, setToken] = useState(null);
  const token = useTokenStore((state) => state.token);
  const { openLoginModal } = useModalLoginStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      return openLoginModal();
    }
  }, [token]);

  const fetchUMKM = useCallback(async () => {
    setIsLoading(true);
    try {
      if (token) {
        const res = await axios.request({
          headers: {
            Authorization: `Bearer ${token}`,
          },
          method: "GET",
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/my/umkm`,
        });
        setUmkm(res.data.data);

        // console.log(res.data.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUMKM();
  }, [fetchUMKM]);

  const onDeleteProduct = (productId) => async () => {
    setIsSubmitting(true);
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status == 200) {
        setUmkm((prev) => prev.filter((product) => product.id !== productId));
        toast.success("Produk berhasil dihapus");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Gagal menghapus produk");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border rounded-lg border-muted">
      <h2 className="p-6 pb-0 mb-4 text-lg font-semibold sm:text-xl">
        UMKM Yang Disurvei
      </h2>
      <div className="space-y-4 p-6 pt-0 max-h-[233px] overflow-y-auto">
        {isLoading ? (
          <div className="-space-y-2">
            {Array.from({ length: 2 }).map((_, idx) => (
              <div key={idx} className="flex items-center gap-5 ">
                {/* <Skeleton
                  width={33}
                  height={33}
                  circle
                  className="bg-zinc-300 skeleton"
                /> */}
                <div className="text-start">
                  <Skeleton
                    width={200}
                    height={15}
                    className="skeleton bg-zinc-300"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : umkm.length > 0 ? (
          umkm.map((product, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* <div className="rounded-full bg-zinc-300 size-8" /> */}
                <div>
                  <p className="text-sm font-medium text-zinc-700">
                    {product.name}
                  </p>
                  <p className="text-xs text-zinc-500">{product.vendor.name}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex text-sm font-medium text-red-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={20}
                    height={20}
                    viewBox="0 0 24 24"
                  >
                    <rect width={24} height={24} fill="none" />
                    <path
                      fill="currentColor"
                      d="m12 21.35l-1.45-1.32C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.53z"
                    />
                  </svg>
                  {product.likes}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-8 h-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={onDeleteProduct(product.id)}
                      className="cursor-pointer"
                    >
                      Hapus
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-zinc-500">Belum ada UMKM yang disurvei</p>
        )}
      </div>
    </div>
  );
};

const InputGroup = ({
  label,
  icon: Icon,
  type,
  placeholder,
  className,
  value = "",
  readOnly = false,
  ...props
}) => {
  // =======

  // >>>>>>> 4c541e078f6f0b11639c195d79b8cf0faa1bea55
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-zinc-700">{label}</label>
      <div className="flex items-center p-2 bg-white border rounded-lg border-muted sm:p-3">
        <Icon className="w-4 h-4 mr-2 text-zinc-400 sm:w-5 sm:h-5" />
        <input
          type={type}
          className={`flex-1 text-xs bg-transparent outline-none sm:text-sm ${className}`}
          placeholder={placeholder}
          {...(readOnly && { readOnly: true, disabled: true, value: value })}
          {...props}
        />
      </div>
    </div>
  );
};

const SocialMediaSection = ({ medsoses = [] }) => {
  const [currentMedsoses, setCurrentMedsoses] = useState(medsoses);
  const [originalMedsoses, setOriginalMedsoses] = useState(medsoses);
  const [socialLinks, setSocialLinks] = useState([
    { platform: "", username: "", link: "" },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const token = useTokenStore((state) => state.token);
  const { openLoginModal } = useModalLoginStore();

  useEffect(() => {
    if (!token) {
      return openLoginModal();
    }
  }, [token, openLoginModal]);

  useEffect(() => {
    setHasChanges(
      JSON.stringify(originalMedsoses) !== JSON.stringify(currentMedsoses)
    );
  }, [currentMedsoses, originalMedsoses]);

  const handleDelete = (index) => {
    const newMedsoses = currentMedsoses.filter((_, i) => i !== index);
    setCurrentMedsoses(newMedsoses);
  };

  const handleUndo = () => {
    setCurrentMedsoses(originalMedsoses);
  };

  const addSocialLink = () => {
    setSocialLinks([...socialLinks, { platform: "", username: "", link: "" }]);
  };

  const removeSocialLink = (index) => {
    const newLinks = socialLinks.filter((_, i) => i !== index);
    setSocialLinks(newLinks);
  };

  const updateSocialLink = (index, field, value) => {
    const newLinks = [...socialLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setSocialLinks(newLinks);
  };

  const handleSaveChanges = async () => {
    setIsSubmitting(true);

    try {
      const payload = {
        medsoses: currentMedsoses,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/my/medsos`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Media sosial berhasil diperbarui!");
      setCurrentMedsoses(response.data.data);
      setOriginalMedsoses(response.data.data);
      setHasChanges(false);
    } catch (error) {
      if (error.response?.status === 401) {
        openLoginModal();
      }
      console.error("Error updating social media:", error);
      const errorMessage =
        error.response?.data?.message || "Gagal memperbarui media sosial";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const emptyFields = socialLinks.some(
        (link) => !link.platform || !link.username || !link.link
      );

      if (emptyFields && socialLinks.length > 1) {
        toast.error("Semua field harus diisi!");
        setIsSubmitting(false);
        return;
      }

      // Only include non-empty social links
      const validSocialLinks = socialLinks.filter(
        (link) => link.platform || link.username || link.link
      );

      const payload = {
        medsoses: [
          ...currentMedsoses,
          ...validSocialLinks.map((link) => ({
            platform: link.platform,
            username: link.username,
            url: link.link,
          })),
        ],
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/my/medsos`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Media sosial berhasil ditambahkan!");
      setSocialLinks([{ platform: "", username: "", link: "" }]);
      setCurrentMedsoses(response.data.data);
      setOriginalMedsoses(response.data.data);
      setHasChanges(false);
    } catch (error) {
      if (error.response?.status === 401) {
        openLoginModal();
      }
      console.error("Error adding social media:", error);
      const errorMessage =
        error.response?.data?.message || "Gagal menambahkan media sosial";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const socialPlatforms = [
    {
      name: "instagram",
      icon: InstagramIcon,
      color: "#E4405F",
    },
    {
      name: "youtube",
      icon: YoutubeIcon,
      color: "#FF0000",
    },
    {
      name: "facebook",
      icon: FacebookIcon,
      color: "#0000FF",
    },
    {
      name: "tiktok",
      icon: TiktokIcon,
      color: "#000000",
    },
  ];

  return (
    <div className="space-y-4">
      {currentMedsoses?.length > 0 ? (
        currentMedsoses.map((medsos, index) => (
          <SocialMediaInput
            key={index}
            platform={medsos.platform}
            value={medsos.username}
            onDelete={() => handleDelete(index)}
          />
        ))
      ) : (
        <p className="text-sm text-zinc-500">
          Belum ada media sosial yang ditambahkan
        </p>
      )}

      {hasChanges && (
        <Card className="p-4 bg-zinc-50 border-zinc-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <p className="text-sm font-medium">Media Sosial telah diubah</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleUndo}
                className="text-zinc-600"
              >
                <Undo2 className="w-4 h-4 mr-2" />
                Undo Perubahan
              </Button>
              <Button
                size="sm"
                onClick={handleSaveChanges}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </div>
        </Card>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        {socialLinks.map((link, index) => (
          <div
            key={index}
            className="relative p-4 bg-white border rounded-lg border-zinc-200"
          >
            <div className="space-y-3">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-zinc-700">
                  Platform
                </label>
                <div className="flex items-center gap-2">
                  {socialPlatforms.map((platform, idx) => {
                    const Icon = platform.icon;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() =>
                          updateSocialLink(index, "platform", platform.name)
                        }
                        className={`p-2 rounded-lg border ${
                          link.platform === platform.name
                            ? "border-zinc-400 bg-zinc-100"
                            : "border-zinc-200"
                        }`}
                        style={{
                          color:
                            link.platform === platform.name
                              ? platform.color
                              : `${platform.color}B3`,
                        }}
                      >
                        <Icon />
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="space-y-3">
                <label className="block text-sm font-medium text-zinc-700">
                  Username
                </label>
                <div className="flex items-center p-2 bg-white border rounded-lg border-zinc-200 sm:p-3">
                  <AtSign className="w-4 h-4 mr-2 text-zinc-400 sm:w-5 sm:h-5" />
                  <input
                    type="text"
                    className="flex-1 text-xs bg-transparent outline-none sm:text-sm"
                    placeholder="Masukkan username"
                    value={link.username}
                    onChange={(e) =>
                      updateSocialLink(index, "username", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="block text-sm font-medium text-zinc-700">
                  URL
                </label>
                <div className="flex items-center p-2 bg-white border rounded-lg border-zinc-200 sm:p-3">
                  <LinkIcon className="w-4 h-4 mr-2 text-zinc-400 sm:w-5 sm:h-5" />
                  <input
                    type="url"
                    className="flex-1 text-xs bg-transparent outline-none sm:text-sm"
                    placeholder="Masukkan URL"
                    value={link.link}
                    onChange={(e) =>
                      updateSocialLink(index, "link", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
            {socialLinks.length > 1 && (
              <button
                type="button"
                onClick={() => removeSocialLink(index)}
                className="absolute p-1 text-zinc-400 hover:text-red-500 top-4 right-4"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          className="w-full border shadow-none border-zinc-200"
          onClick={addSocialLink}
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Media Sosial
        </Button>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Menyimpan..." : "Simpan Media Sosial"}
        </Button>
      </form>
    </div>
  );
};

const AccountSettings = () => {
  const [user, setUser] = useState(null);
  // const [token, setToken] = useState(null);
  const [payload, setPayload] = useState({
    old_password: "",
    password: "",
    password_confirmation: "",
  });
  const token = useTokenStore((state) => state.token);
  const { openLoginModal } = useModalLoginStore();

  useEffect(() => {
    if (!token) {
      return openLoginModal();
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords
    if (
      !payload.old_password ||
      !payload.password ||
      !payload.password_confirmation
    ) {
      toast.error("Semua field harus diisi");
      return;
    }

    if (payload.password !== payload.password_confirmation) {
      toast.error("Kata sandi baru dan konfirmasi tidak cocok");
      return;
    }

    if (payload.password.length < 8) {
      toast.error("Kata sandi baru minimal 8 karakter");
      return;
    }

    toast.promise(
      axios
        .post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/change-password`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          // Reset form after successful update
          setPayload({
            old_password: "",
            password: "",
            password_confirmation: "",
          });
          return response;
        }),
      {
        loading: "Harap tunggu...",
        success: "Berhasil memperbarui kata sandi!",
        error: (err) =>
          `Error: ${err.response?.data?.message || "Terjadi kesalahan"}`,
      }
    );
  };

  useEffect(() => {
    if (token) {
      axios
        .request({
          headers: {
            Authorization: `Bearer ${token}`,
          },
          method: "GET",
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/my/profile`,
        })
        .then((res) => {
          console.log(res.data.data);
          setUser(res.data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [token]);

  return (
    <div className="max-w-5xl p-4 mx-auto space-y-4 sm:p-6 lg:p-8 sm:space-y-6 lg:space-y-8">
      <div className="p-4 rounded-lg shadow-md bg-secondary sm:p-6 lg:p-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-6">
          <div className="flex items-center justify-center w-20 h-20 border-2 rounded-full bg-zinc-100 border-zinc-200 sm:w-24 sm:h-24 lg:w-32 lg:h-32">
            <User className="w-1/2 text-zinc-400 h-1/2" />
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col items-center gap-2 mb-2 sm:flex-row sm:gap-3">
              <h1 className="text-xl font-bold text-zinc-900 sm:text-2xl lg:text-3xl">
                Pengaturan Akun
              </h1>
              <Badge className="px-2 py-1 text-xs text-white bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 sm:text-sm">
                <Trophy className="w-3 h-3 mr-1 sm:w-4 sm:h-4" />
                Heroic Volunteer
              </Badge>
            </div>
            <p className="text-sm text-zinc-600 sm:text-base">
              Kelola informasi dan preferensi akun Anda
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 sm:gap-6">
        <div className="order-2 space-y-4 lg:order-1 lg:col-span-7 sm:space-y-6">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="profile">Profil</TabsTrigger>
              <TabsTrigger value="social">Media Sosial</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="p-4 border rounded-lg shadow-sm bg-third border-muted sm:p-6">
                  <h2 className="mb-4 text-lg font-semibold sm:text-xl">
                    Informasi Pribadi
                  </h2>
                  <div className="space-y-4">
                    {user ? (
                      <>
                        <InputGroup
                          label="Nama Pengguna"
                          icon={User}
                          type="text"
                          placeholder="Nama Pengguna"
                          value={user.name}
                          readOnly
                          className={"text-zinc-500"}
                        />
                        <InputGroup
                          label="Email"
                          icon={Mail}
                          type="email"
                          placeholder="email@example.com"
                          value={user.email}
                          className={"text-zinc-500"}
                          readOnly
                        />
                      </>
                    ) : (
                      <>
                        <Skeleton
                          className="rounded-md skeleton bg-zinc-200"
                          height={40}
                        />
                        <Skeleton
                          className="rounded-md skeleton bg-zinc-200"
                          height={40}
                        />
                      </>
                    )}
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-third border-muted sm:p-6">
                  <h2 className="mb-4 text-lg font-semibold sm:text-xl">
                    Ubah Kata Sandi
                  </h2>
                  <div className="space-y-4">
                    {[
                      { label: "Kata Sandi Saat Ini", name: "old_password" },
                      { label: "Kata Sandi Baru", name: "password" },
                      {
                        label: "Konfirmasi Kata Sandi Baru",
                        name: "password_confirmation",
                      },
                    ].map(({ label, name }) => (
                      <InputGroup
                        key={name}
                        label={label}
                        icon={Lock}
                        type="password"
                        placeholder="••••••••"
                        value={payload[name]}
                        onChange={(e) =>
                          setPayload({ ...payload, [name]: e.target.value })
                        }
                      />
                    ))}
                  </div>
                  <Button className="w-full mt-5" type="submit">
                    Simpan Perubahan
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="social">
              <div className="space-y-4 sm:space-y-6">
                <div className="p-4 border rounded-lg shadow-sm bg-third border-muted sm:p-6">
                  <h2 className="mb-2 text-lg font-semibold sm:text-xl">
                    Media Sosial
                  </h2>
                  <p className="mb-4 text-sm text-zinc-600">
                    Tambahkan media sosial yang ingin Anda hubungkan dengan akun
                    Anda.
                  </p>
                  <SocialMediaSection
                    medsoses={user && (user.medsoses ?? [])}
                  />
                </div>
                {/* <Button type="submit">Simpan</Button> */}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="order-1 space-y-4 lg:col-span-5 lg:space-y-6">
          <div className="p-6 border border-orange-100 rounded-md h-min bg-gradient-to-br from-red-50 to-orange-50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold sm:text-xl">
                Status Peringkat
              </h2>
              <Badge className="text-white bg-gradient-to-r from-red-500 to-orange-500">
                <Trophy className="w-3 h-3 mr-1 sm:w-4 sm:h-4" />
                Heroic Volunteer
              </Badge>
            </div>
            <div className="space-y-6">
              <div className="p-4 rounded-lg bg-gradient-to-r from-red-50 to-orange-50">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white bg-opacity-50 rounded-full">
                    <Trophy className="w-6 h-6 text-orange-600 sm:w-8 sm:h-8" />
                  </div>
                  <div>
                    {user ? (
                      <>
                        <h3 className="text-base font-semibold text-zinc-900 sm:text-lg">
                          {user.rank <= 5
                            ? "Heroic Volunteer👑"
                            : user.rank <= 15
                            ? "Active Volunteer🔥"
                            : "New Volunteer🌟"}
                        </h3>
                        <p className="mt-1 text-sm text-zinc-600">
                          {user.rank <= 5
                            ? "Pencapaian luar biasa, terus tingkatkan poin Anda"
                            : user.rank <= 10
                            ? "Anda adalah surveyer yang aktif, terus tingkatkan poin Anda"
                            : "Halo surveyer, ayo terus tingkatkan poin Anda"}
                        </p>
                      </>
                    ) : (
                      <>
                        <Skeleton
                          className="skeleton bg-zinc-200"
                          height={20}
                          width={150}
                        />
                        <Skeleton
                          className="skeleton bg-zinc-200"
                          height={15}
                          width={200}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 text-center rounded-lg bg-zinc-50">
                  {user ? (
                    <>
                      <p className="text-2xl font-bold text-orange-600 sm:text-3xl">
                        {user.products_count}
                      </p>
                      <p className="mt-1 text-xs text-zinc-600 sm:text-sm">
                        Survey Selesai
                      </p>
                    </>
                  ) : (
                    <>
                      <Skeleton
                        className="skeleton bg-zinc-200"
                        height={30}
                        width={50}
                      />
                      <Skeleton
                        className="skeleton bg-zinc-200"
                        height={15}
                        width={100}
                      />
                    </>
                  )}
                </div>
                <div className="p-4 text-center rounded-lg bg-zinc-50">
                  {user ? (
                    <>
                      <p className="text-2xl font-bold text-orange-600 sm:text-3xl">
                        {user.points}
                      </p>
                      <p className="mt-1 text-xs text-zinc-600 sm:text-sm">
                        Total Poin
                      </p>
                    </>
                  ) : (
                    <>
                      <Skeleton
                        className="skeleton bg-zinc-200"
                        height={30}
                        width={50}
                      />
                      <Skeleton
                        className="skeleton bg-zinc-200"
                        height={15}
                        width={100}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border-y border-muted">
            <MyUMKM />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
