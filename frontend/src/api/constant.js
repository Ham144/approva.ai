const DEV_URL = "http://192.168.169.12:3000";
let PROD_URL = "https://e-form.mycsi.net";

if (import.meta.env.VITE_BACKEND_URL) {
  PROD_URL = import.meta.env.VITE_BACKEND_URL;
}

const isProductionEnvironment =
  window.location.hostname === "e-form.mycsi.net" ||
  window.location.hostname.endsWith(".e-form.mycsi.net");
// Set NODE_ENV berdasarkan kondisi
const NODE_ENV = isProductionEnvironment ? "production" : "development"; // kalau staging perlu beda, bisa ubah sini

// Final BASE_URL
export const BASE_URL = NODE_ENV === "production" ? PROD_URL : DEV_URL;
export let siteKeyCloudflare = "0x4AAAAAABm0ajGlobtbdIIR";

export const APP_NAME = "E-Form mycsi";
export const APP_DESC =
  "Sistem Workflow tracking status dan form approval builder yang flexible";
export const NAMAPERUSAHAAN = "PT. Catur Sukses Internasional";

export const initialTempSourceData = {
  title: "",
  desc: "",
  keys: [],
};

export const inputKeysType = [
  "image",
  "text",
  "date",
  "number",
  "select",
  "pdf",
];
