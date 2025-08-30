import React, { useEffect, useRef, useState } from "react";
import externalOptionApi from "../api/externalOptionApi"; // adjust path as needed
import { Play } from "lucide-react";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import FlexSourceDataApi from "@/api/flexSourceDataApi";

// Props:
// - open (boolean) optional: control modal externally
// - onClose() optional
// - onSave(config) optional: called when user saves the integration config
// - initialConfig optional: { url, apiKey }

export default function SetupExternalOption() {
  const dialogRef = useRef(null);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [endpoint, setEndpoint] = useState("");
  const [xApiKey, setXApiKey] = useState("");
  const [searchKey, setSearchKey] = useState(""); //value test
  const [penamaanSearchKey, setPenamaanSearchKey] = useState("");
  const [pointer, setPointer] = useState("");
  const [keyMapping, setKeyMapping] = useState("");
  const [valueMapping, setValueMapping] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  const close = () => {
    try {
      dialogRef.current.close();
    } catch (e) {
      // ignore if browser doesn't support dialog.showModal
      toast.error(e.message);
    }
  };

  const validate = () => {
    setError(null);
    if (!Array.isArray(result)) {
      setError("Tampaknya hasil pointer bukan array");
      return false;
    }
    if (!endpoint) {
      setError("Endpoint tak boleh kosong");
      return false;
    }
    if (!title) {
      setError("Title tak boleh kosong");
      return false;
    }
    if (!desc) {
      setError("Desc tak boleh kosong");
      return false;
    }
    if (!xApiKey) {
      setError("API Key tak boleh kosong");
      return false;
    }
    if (keyMapping) {
      if (!keyMapping) {
        setError("Key Mapping tak boleh kosong");
        return false;
      }
    }
    if (!valueMapping) {
      setError("Value Mapping tak boleh kosong");
      return false;
    }

    setError(null);
    return true;
  };

  const handleTest = async () => {
    try {
      const data = await externalOptionApi.requestExternalOption({
        url: endpoint,
        searchKey: searchKey || undefined,
        apiKey: xApiKey || undefined,
        penamaanSearchKey,
        pointer,
      });
      setResult(data);
      setStatus("ok");
    } catch (err) {
      // try to unwrap axios error
      const message = err?.message || "Request failed";
      const responseData = err?.response?.data;
      const responseStatus = err?.response?.status;
      setError(message + (responseStatus ? ` (status ${responseStatus})` : ""));
      setResult(responseData ?? null);
      setStatus(responseStatus ?? "error");
    } finally {
      setLoading(false);
    }
  };

  const { mutateAsync: handleSave, isPending: isPendingCreating } = useMutation(
    {
      mutationKey: ["externalOption", "create"],
      mutationFn: async () => {
        const isValid = validate();
        if (!isValid) throw Error("Validation Failed");
        return await FlexSourceDataApi.createSourceDataExternal({
          title,
          desc,
          endpoint,
          xApiKey,
          penamaanSearchKey,
          pointer,
          keyMapping,
          valueMapping,
        });
      },
      onSuccess: (res) => {
        toast.success(res?.response?.data?.message || "berhasil create");
        close();
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message);
      },
    }
  );

  const copyCurl = async () => {
    const curl = `curl -G "${endpoint}" \
  -H "x-api-key: ${xApiKey}" ${
      searchKey
        ? `\\\n  --data-urlencode "searchKey=${encodeURIComponent(searchKey)}"`
        : ""
    }`;
    try {
      await navigator.clipboard.writeText(curl);
      alert("cURL copied to clipboard");
    } catch (e) {
      alert("Failed to copy cURL");
    }
  };

  return (
    <dialog id="modal-setup-external-option" ref={dialogRef} className="modal">
      <form
        method="dialog"
        className="modal-box w-11/12 max-w-4xl bg-base-100 shadow-xl"
      >
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-base-300">
          <h3 className="font-bold text-2xl text-base-content">
            Setup External Option
            <span className="badge badge-accent badge-lg ml-3 text-white">
              beta
            </span>
          </h3>
          <button
            onClick={close}
            className="btn btn-ghost btn-circle btn-sm"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Information Section */}
        <div className="bg-base-200 p-4 rounded-lg mb-6">
          <div className="flex items-start">
            <div className="mr-3 mt-1 text-info">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="text-sm">
              <p className="font-semibold mb-1">
                Metode:{" "}
                <span className="badge badge-sm badge-success">GET</span>
              </p>
              <p className="mb-2">
                Saat ini hanya GET yang didukung. Gunakan dialog ini untuk
                mengonfigurasi endpoint eksternal dan mengujinya langsung.
                Header{" "}
                <code className="bg-base-300 px-1 py-0.5 rounded">
                  x-api-key
                </code>{" "}
                akan digunakan untuk autentikasi.
              </p>
              <p className="mb-2">
                Kunjungi endpoint konsisten:{" "}
                <span className="font-semibold text-info">
                  /developer.integration
                </span>{" "}
                untuk mendapatkan x-api-key untuk berinteraksi dengan backend
                project lain.
              </p>
              <p>
                Sesuaikan penamaan searchKey nya (digunakan untuk pencarian):
                kebanyakan pencarian searchKey pada query nya adalah "searchKey"
                tapi ada kemungkinan ketidak konsistenan.
              </p>
            </div>
          </div>
        </div>

        {/* Configuration Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Title</span>
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              placeholder="Untuk pengenalan dan penggunaan reusable option"
              className="input input-bordered input-primary w-full rounded-lg"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Description</span>
            </label>
            <input
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              type="text"
              placeholder="Description untuk option ini"
              className="input input-bordered input-primary w-full rounded-lg"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold flex items-center">
                Endpoint
                <span className="badge badge-success badge-sm ml-2">GET</span>
              </span>
            </label>
            <input
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              type="text"
              placeholder="http://midcsi.muara.co.id:7047/api/v1/customers"
              className="input input-bordered input-primary w-full rounded-lg"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">x-api-key</span>
            </label>
            <input
              value={xApiKey}
              onChange={(e) => setXApiKey(e.target.value)}
              type="text"
              placeholder="Paste x-api-key here"
              className="input input-bordered input-primary w-full rounded-lg"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">
                Penamaan SearchKey
              </span>
            </label>
            <input
              value={penamaanSearchKey}
              onChange={(e) => setPenamaanSearchKey(e.target.value)}
              type="text"
              placeholder="Apa searchKey untuk pencarian?"
              className="input input-bordered input-primary w-full rounded-lg"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">
                Pointer Mengambil Array (e.g : data.result)
              </span>
            </label>
            <input
              value={pointer}
              onChange={(e) => setPointer(e.target.value)}
              type="text"
              placeholder="Tuliskan kode javascript untuk mengambil array tujuan"
              className="input input-bordered input-primary w-full rounded-lg"
            />
            <label className="label">
              <span className="label-text-alt text-base-content/70">
                Biarkan kosong dulu untuk mengetahui struktur pulangan
              </span>
            </label>
          </div>
        </div>

        {/* Testing Section */}
        <div className="bg-base-200 p-5 rounded-xl mb-6">
          <h4 className="font-semibold text-lg mb-3 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-info"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
              />
            </svg>
            Testing
          </h4>

          <p className="text-sm mb-4">
            Cobalah ketik pencarian Anda dan klik <strong>Test</strong>. Lalu
            sesuaikan pengambilan output dengan "Pointer Mengambil Array" dan
            klik test lagi.
          </p>

          <div className="flex flex-col md:flex-row gap-3 items-start md:items-center mb-4">
            <div className="form-control flex-1">
              <input
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
                type="text"
                placeholder="searchKey (optional)"
                className="input rounded-lg input-bordered w-full"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleTest}
                className={`btn text-white rounded-lg btn-primary ${
                  loading ? "loading" : ""
                }`}
                disabled={loading}
              >
                {!loading && <Play />}
                Test
              </button>

              <button
                type="button"
                className="btn btn-outline rounded-lg btn-primary"
                onClick={copyCurl}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                  />
                </svg>
                Copy cURL
              </button>
            </div>
          </div>

          <div className="alert alert-info mb-4">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 flex-shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>
                Karena keterbatasan skalabilitas arsitektur database yang telah
                ada, hanya ada dua value yang bisa ditampung tanpa banyak
                perubahan struktur.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Key Mapping</span>
                <span className="label-text-alt">
                  (akan disimpan sebagai key)
                </span>
              </label>
              <input
                type="text"
                placeholder="Key mapping field"
                value={keyMapping}
                onChange={(e) => setKeyMapping(e.target.value)}
                className="input input-bordered input-primary w-full"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Value Mapping</span>
                <span className="label-text-alt">
                  (ditampilkan sebagai pilihan dropdown)
                </span>
              </label>
              <input
                type="text"
                placeholder="Value mapping field"
                value={valueMapping}
                onChange={(e) => setValueMapping(e.target.value)}
                className="input input-bordered input-primary w-full"
              />
            </div>
          </div>

          {/* Results Section */}
          <div className="mt-4">
            {loading && (
              <div className="flex items-center justify-center p-4">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <span className="ml-2">Running request…</span>
              </div>
            )}

            {error && (
              <div className="alert alert-error mt-4">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 flex-shrink-0 stroke-current"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <span className="font-semibold">Error: </span>
                    <span>{error}</span>
                  </div>
                </div>
              </div>
            )}

            {result && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <h5 className="font-semibold">Response Preview</h5>
                </div>
                <pre className="bg-base-300 p-4 rounded-lg text-sm overflow-auto max-h-72 border border-base-content/10">
                  {typeof result === "string"
                    ? result
                    : JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="modal-action justify-between">
          <div>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setEndpoint("");
                setXApiKey("");
                setSearchKey("");
                setResult(null);
                setError(null);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Reset
            </button>
          </div>

          <div className="flex gap-2">
            <button type="button" className="btn" onClick={close}>
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Tambahkan
            </button>
          </div>
        </div>
      </form>
    </dialog>
  );
}
