import axios from "axios";
import { BASE_URL } from "./constant";

const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: `${BASE_URL}`,
});

//interceptor ini untuk menangani error 401 dari authenticate, karena getUserInfo dari  levelWrapper.jsx hanya dipanggil jika fullreload atau berada di /login untuk mengurangi beban server, karena authenticate cukup terpercaya dengan deode token di middleware tanpa hit database. jika tidak ada interceptor ini, maka kita masih bisa navigasi kemana mana walau token sudah tidak berlaku atau terhapus karena levelWrapper hanya mengecek userInfo di store, jika tidak ada barulah ia akan refetch getUSerInfo seperti misalnya fullreload
axiosInstance.interceptors.response.use(
  (response) => response, // Jika respons sukses (2xx), langsung teruskan
  async (error) => {
    const originalRequest = error.config;

    // Tangani jika ada respons error
    if (error.response) {
      // Jika status adalah 401 UNAUTHORIZED
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true; // Tandai request ini sudah dicoba
        console.log("Intercepted 401: Unauthorized. Redirecting to login...");

        try {
          await axios.delete("/api/auth/logout");
        } catch (logoutErr) {
          console.error("Failed to logout on 401:", logoutErr);
        }

        // Redirect ke halaman login
        window.location.href = "/login";

        return Promise.reject(error); // Tolak promise untuk menghentikan request asli
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
