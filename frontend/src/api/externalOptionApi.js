import axios from "axios";
import toast from "react-hot-toast";

const externalOptionApi = {
  requestExternalOption: async ({
    url,
    searchKey,
    apiKey,
    penamaanSearchKey,
    pointer,
  }) => {
    try {
      const params = searchKey ? { [penamaanSearchKey]: searchKey } : {};
      const response = await axios.get(url, {
        headers: { "x-api-key": apiKey },
        params,
      });

      let extractedData = response.data;
      if (pointer?.length > 0) {
        extractedData = response.data;
        if (pointer?.length > 0) {
          extractedData = getNestedValue(response.data, pointer);
        }
      }

      return extractedData;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        status: error.response?.status || 500,
      };
    }
  },
};

function getNestedValue(obj, pointer) {
  if (!pointer) return obj;
  return pointer.split(".").reduce((acc, key) => {
    return acc && acc[key] !== undefined ? acc[key] : null;
  }, obj);
}

export default externalOptionApi;
