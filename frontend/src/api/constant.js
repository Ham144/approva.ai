const DEV_URL = "";
let PROD_URL = "https://approva-ai.hexadim.com";

if (import.meta.env.VITE_BACKEND_URL) {
  PROD_URL = import.meta.env.VITE_BACKEND_URL;
}

const isProductionEnvironment =
  window.location.hostname === "approva-ai.hexadim.com" ||
  window.location.hostname.endsWith(".approva-ai.hexadim.com");
// Set NODE_ENV berdasarkan kondisi
const NODE_ENV = isProductionEnvironment ? "production" : "development"; // kalau staging perlu beda, bisa ubah sini

// Final BASE_URL
export const BASE_URL = NODE_ENV === "production" ? PROD_URL : DEV_URL;
export const APP_NAME = "Approva.AI";
export const APP_DESC = "AI powered approval builder";
export const NAMA_PERUSAHAAN = "Hexadim LLC"; 

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
