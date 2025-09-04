const DEV_URL = "http://192.168.169.12:3000";
let PROD_URL = "https://e-form.mycsi.net";

if (import.meta.env.VITE_BACKEND_URL) {
  PROD_URL = import.meta.env.VITE_BACKEND_URL;
}

// Cek apakah environment ini demo
const isDemo = !!import.meta.env.VITE_DEMO;

// Set NODE_ENV berdasarkan kondisi
const NODE_ENV = isDemo ? "development" : "production"; // kalau staging perlu beda, bisa ubah sini

// Final BASE_URL
export const BASE_URL = NODE_ENV === "production" ? PROD_URL : DEV_URL;
export let siteKeyCloudflare =
  import.meta.env.VITE_TURNSTILE_SITE_KEY ?? "0x4AAAAAABm0ajGlobtbdIIR";

export const APP_NAME = "E-Form mycsi";
export const APP_DESC =
  "Sistem Workflow tracking status dan form approval builder yang flexible";
export const NAMAPERUSAHAAN = "PT. Catur Sukses Internasional";

export const initialTempSourceData = {
  title: "",
  desc: "",
  keys: [],
};
