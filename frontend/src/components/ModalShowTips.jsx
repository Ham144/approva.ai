import React from "react";
import {
  FileText,
  Image,
  PenTool,
  CheckCircle,
  Calendar,
  Signature,
  Hash,
  List,
  CheckSquare,
  FileUp,
  RectangleEllipsis,
  Ruler,
} from "lucide-react"; // Assuming you have lucide-react for icons

export default function ModalShowTips() {
  const dataTypes = [
    {
      name: "Text",
      icon: <FileText className="w-6 h-6 text-indigo-500" />,
      description:
        "Gunakan tipe ini untuk masukan teks bebas, seperti nama, alamat, atau deskripsi singkat. Ideal untuk data non-terstruktur yang tidak memerlukan format spesifik.",
      example: "Contoh: Nama Lengkap, Alamat Pengiriman, Catatan Tambahan.",
    },
    {
      name: "Number",
      icon: <Hash className="w-6 h-6 text-green-500" />,
      description:
        "Untuk masukan angka saja. Pastikan data yang dimasukkan berupa nilai numerik, seperti jumlah, kuantitas, atau harga. Input ini dapat divalidasi agar hanya menerima angka.",
      example: "Contoh: Jumlah Barang, Usia, Skor Penilaian.",
    },
    {
      name: "Date",
      icon: <Calendar className="w-6 h-6 text-orange-500" />,
      description:
        "Digunakan untuk memilih tanggal dari kalender. Memastikan format tanggal konsisten dan memudahkan pengguna memilih tanggal tanpa kesalahan pengetikan.",
      example: "Contoh: Tanggal Lahir, Tanggal Transaksi, Batas Waktu.",
    },
    {
      name: "Select",
      icon: <List className="w-6 h-6 text-cyan-500" />,
      description:
        "Pilihan tunggal dari daftar opsi yang sudah ditentukan. Cocok untuk data dengan beberapa pilihan terbatas yang perlu dipilih satu saja.",
      example: "Contoh: Jenis Kelamin, Status Pernikahan, Kategori Produk.",
    },
    {
      name: "Multiple Checkbox",
      icon: <CheckSquare className="w-6 h-6 text-teal-500" />,
      description:
        "Pilihan ganda dari daftar opsi yang sudah ditentukan. Memungkinkan pengguna untuk memilih satu atau lebih pilihan dari daftar yang tersedia.",
      example: "Contoh: Minat Hobi, Opsi Pembayaran, Fitur yang Dipilih.",
    },
    {
      name: "PDF",
      icon: <FileUp className="w-6 h-6 text-red-500" />,
      description:
        "Untuk mengunggah file dalam format PDF. Berguna saat memerlukan dokumen resmi, laporan, atau formulir yang sudah diisi dalam bentuk PDF.",
      example: "Contoh: Lampiran KTP, Salinan Ijazah, Surat Perjanjian.",
    },
    {
      name: "Image",
      icon: <Image className="w-6 h-6 text-yellow-600" />,
      description:
        "Untuk mengunggah file gambar (JPG, PNG, GIF, dll.). Ideal untuk bukti visual atau foto yang relevan dengan data formulir.",
      example: "Contoh: Foto Produk, Bukti Resi, Tanda Tangan Digital.",
    },
    {
      name: "Signature",
      icon: <Signature className="w-6 h-6 text-pink-500" />,
      description:
        "Memungkinkan pengguna untuk menggambar tanda tangan digital secara langsung di form. Sering digunakan untuk persetujuan atau verifikasi.",
      example:
        "Contoh: Persetujuan Dokumen, Konfirmasi Penerimaan, Kontrak Elektronik.",
    },
    {
      name: "Confirm",
      icon: <CheckCircle className="w-6 h-6 text-emerald-500" />,
      description:
        "Digunakan untuk keputusan akhir yang dapat dikenali sistem, saat belum mengisi status atau status belum selesai diisi, defaultnya adalah pending lalu untuk jika menekan approved maka proses akan berlanjut ke status selanjutnya, namun jika menekan rejected maka status tidak akan berlanjut dan berakhir rejected, mungkin beserta alasan menolak atau hanya penolakan, input berada dibawah dan hanya muncul untuk responden terautorisasi bukan untuk requester.",
      example:
        "Contoh: 'Saya setuju dengan syarat & ketentuan', 'Verifikasi data benar'.",
    },
    {
      name: "Table", // Your existing type
      icon: <PenTool className="w-6 h-6 text-blue-500" />, // Using PenTool as a generic 'structured data' icon
      description:
        "Gunakan tipe table ketika satu pertanyaan membutuhkan banyak data yang berulang dalam bentuk baris. Tiap baris mewakili satu entitas dan kolom mencakup properti yang relevan.",
      example:
        "Contoh: Mendata barang rusak (nama barang, harga, kerusakan, waktu rusak). Lebih praktis dan rapi dengan satu field bertipe table daripada field 'text' berulang kali.",
    },
    {
      name: "textArea", // Your existing type
      icon: <RectangleEllipsis className="w-6 h-6 text-blue-500" />, // Using PenTool as a generic 'structured data' icon
      description:
        "Gunakan tipe textArea jika tipe text tidak cukup lebar untuk menampilkan tulisan yang berparagraf",
      example: "Contoh:essay, puisi cinta",
    },
    {
      name: "helper", // Your existing type
      icon: <Ruler className="w-6 h-6 text-blue-500" />, // Using PenTool as a generic 'structured data' icon
      description:
        "Gunakan tipe helper hanya untuk memberitahukan sesuatu ditengah pengisian, ini gunanya untuk helper pengisian atau anotasi pengingat bagi si pengisi",
      example: "Contoh: anotasi, pengingat, informasi tambahan",
    },
  ];

  return (
    <dialog id="modalShowTips" className="modal modal-middle sm:modal-middle">
      <div className="modal-box w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto p-6 bg-gradient-to-br from-base-100 to-base-200 shadow-2xl rounded-2xl">
        <h1 className="text-3xl font-extrabold text-center text-primary mb-8 border-b-2 border-primary pb-3">
          Panduan Tipe Data Form
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dataTypes.map((type, index) => (
            <div
              key={type.name}
              className="card bg-base-100 shadow-lg border border-base-300 transform transition-all duration-300 hover:scale-105 hover:shadow-xl group"
            >
              <div className="card-body p-5">
                <div className="flex items-center gap-4 mb-3">
                  <div className="p-3 rounded-full bg-base-200 group-hover:bg-blue-100 transition-colors">
                    {type.icon}
                  </div>
                  <h2 className="card-title text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {type.name}
                  </h2>
                </div>
                <p className="text-gray-700 text-sm mb-3 leading-relaxed">
                  {type.description}
                </p>
                <p className="text-gray-600 text-xs italic opacity-80 group-hover:opacity-100 transition-opacity">
                  {type.example}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="modal-action mt-8 flex justify-center">
          <form method="dialog">
            <button className="btn btn-primary btn-lg rounded-full px-8 shadow-md hover:shadow-lg transition-all duration-300">
              Tutup
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
