import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./button";
import toast from "react-hot-toast";
import useModalLoginStore from "@/store/modalLoginStore";
import React, { useState } from "react";
import { login, register } from "@/store/loginStore";
import { useForm } from "react-hook-form";

const InputGroup = React.forwardRef(
  ({ label, type, name, placeholder, error, ...rest }, ref) => {
    return (
      <div className="space-y-2">
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          className={`block w-full px-3 py-2 border ${
            error ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
          ref={ref}
          {...rest}
        />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

export default function AuthModal() {
  const { isLoginModalOpen, closeLoginModal } = useModalLoginStore();
  const [isRegister, setIsRegister] = useState(false);
  const [payload, setPayload] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const {
    register: formRegister,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const handleToggle = () => {
    setIsRegister(!isRegister);
  };

  const onSubmit = async (data) => {
    toast.promise(
      new Promise(async (resolve, reject) => {
        try {
          if (isRegister) {
            await register(data);
          } else {
            await login(data);
          }
          closeLoginModal();
          resolve();
        } catch (error) {
          if (error.message == 401) {
            toast.error("Email atau password salah");
          } else {
            toast.error(error.message);
          }
          reject();
        }
      }),
      {
        loading: "Harap tunggu...",
        success: isRegister ? <b>Berhasil Daftar!</b> : <b>Berhasil Login!</b>,
        error: <b>Gagal {isRegister ? "Daftar" : "Login"}</b>,
      }
    );
  };

  return (
    <Dialog open={isLoginModalOpen}>
      <DialogContent onClose={closeLoginModal} className="space-y-3">
        <DialogHeader className="space-y-3">
          <DialogTitle>{isRegister ? "Daftar" : "Login"}</DialogTitle>
          <DialogDescription>
            {isRegister
              ? "Buat akun untuk bergabung dengan komunitas kami"
              : "Masuk ke akun Anda untuk bergabung dengan komunitas kami"}
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {isRegister && (
            <InputGroup
              label="Nama"
              type="text"
              name="name"
              placeholder="Masukkan nama Anda"
              {...formRegister("name", { required: "Nama wajib diisi" })}
              error={errors.name?.message}
            />
          )}

          <InputGroup
            label="Email"
            type="email"
            name="email"
            placeholder="Masukkan email Anda"
            {...formRegister("email", {
              required: "Email wajib diisi",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: "Email tidak valid",
              },
            })}
            error={errors.email?.message}
          />
          <InputGroup
            label="Password"
            type="password"
            name="password"
            placeholder="Masukkan Password Anda"
            {...formRegister("password", {
              required: "Password wajib diisi",
              minLength: {
                value: 8,
                message: "Password minimal 8 karakter",
              },
            })}
            error={errors.password?.message}
          />

          {isRegister && (
            <InputGroup
              label="Konfirmasi Password"
              type="password"
              name="password_confirmation"
              placeholder="Masukkan kembali Password Anda"
              {...formRegister("password_confirmation", {
                required: "Konfirmasi password wajib diisi",
                validate: (value) =>
                  value === watch("password") || "Password tidak cocok",
              })}
              error={errors.password_confirmation?.message}
            />
          )}

          <Button size="lg" type="submit" className="w-full">
            {isRegister ? "Daftar" : "Login"}
          </Button>
        </form>

        <div className="text-center">
          <span className="text-sm">
            {isRegister ? "Sudah punya akun? " : "Belum punya akun? "}
            <button
              type="button"
              onClick={handleToggle}
              className="text-blue-500 hover:underline"
            >
              {isRegister ? "Login" : "Daftar"}
            </button>
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
