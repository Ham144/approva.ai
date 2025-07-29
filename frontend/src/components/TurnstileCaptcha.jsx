import { siteKeyCloudflare } from "@/api/constant";
import { useEffect, useRef, useState } from "react";

const TurnstileCaptcha = ({ siteKey, onVerify }) => {
  const captchaRef = useRef(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // Load hanya sekali
    if (!document.getElementById("cf-turnstile-script")) {
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      script.defer = true;
      script.id = "cf-turnstile-script";
      script.onload = () => setScriptLoaded(true);
      document.body.appendChild(script);
    } else {
      setScriptLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (
      scriptLoaded &&
      window.turnstile &&
      captchaRef.current &&
      captchaRef.current.childNodes.length === 0
    ) {
      window.turnstile.render(captchaRef.current, {
        sitekey: siteKeyCloudflare,
        theme: "light",
        size: "normal",
        callback: (token) => {
          onVerify(token); // kirim token ke parent
        },
      });
    }
  }, [scriptLoaded, siteKey, onVerify]);

  return <div ref={captchaRef} />;
};

export default TurnstileCaptcha;
