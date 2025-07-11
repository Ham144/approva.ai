import httpntlm from "httpntlm";

export async function fetchData(xml, username, password, url, soapaction) {
  return new Promise((resolve, reject) => {
    httpntlm.post(
      {
        url: url,
        username: username,
        password: password,
        body: xml,
        headers: {
          accept: "*/*",
          "accept-language": "en-US,en;q=0.9",
          "content-type": 'text/xml; charset="UTF-8"',
          soapaction:
            soapaction ||
            '"urn:microsoft-dynamics-schemas/page/salestarget:ReadMultiple"',
        },
        ntlmVersion: 2, // Pastikan NTLMv2 jika server memerlukannya
      },
      (err, res) => {
        if (err) {
          return reject(err);
        }
        resolve(res);
      }
    );
  });
}
