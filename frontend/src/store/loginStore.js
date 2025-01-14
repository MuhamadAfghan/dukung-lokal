import axios from "axios";
import Cookies from "js-cookie";
import useTokenStore from "@/hook/useTokenStore";

const login = async (payload) => {
  const { email, password } = payload;
  const { setToken } = useTokenStore.getState();

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/login`,
      {
        email,
        password,
      }
    );
    if (Cookies.get("token")) {
      Cookies.remove("token");
    }
    const token = response.data.data.token;
    setToken(token);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error.status || error.response?.data.message);
  }
};

const register = async (payload) => {
  const { name, email, password, password_confirmation } = payload;
  const { setToken } = useTokenStore.getState();

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/register`,
      {
        name,
        email,
        password,
        password_confirmation,
      }
    );
    if (Cookies.get("token")) {
      Cookies.remove("token");
    }
    const token = response.data.data.token;
    setToken(token);
    return response.data;
  } catch (error) {
    if (error.status === 401) {
      openLoginModal();
    }
    throw new Error(error.status || error.response?.data.message);
  }
};

export { login, register };
