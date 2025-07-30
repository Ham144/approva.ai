const DEV_URL = "http://192.168.169.12:3000";
// const PROD_URL = "http://192.168.169.22:3000";
const PROD_URL = "https://e-form.mycsi.net";

// export const NODE_ENV = "development";
export const NODE_ENV = "production";

export const BASE_URL = NODE_ENV == "production" ? PROD_URL : DEV_URL;

export const siteKeyCloudflare = "0x4AAAAAABm0ajGlobtbdIIR";

export const APP_NAME = "Flex Flow CSI";
export const APP_DESC =
  "Sistem Workflow tracking status dan form approval yang flexible by CSI";
export const NAMAPERUSAHAAN = "PT. Catur Sukses Internasional";

export const initialTempSourceData = {
  title: "",
  desc: "",
  keys: [],
};
