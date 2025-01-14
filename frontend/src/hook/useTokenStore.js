import { create } from "zustand";
import Cookies from "js-cookie";

const useTokenStore = create((set) => ({
  token: Cookies.get("token") || null,
  setToken: (token) => {
    if (token) {
      Cookies.set("token", token, { expires: 7 });
    }
    set({ token });
  },
}));

export default useTokenStore;
