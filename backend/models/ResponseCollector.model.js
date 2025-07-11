import mongoose from "mongoose";

// ini setara Input.model.js
//Ini tidak perlu, ini sudah digantikan oleh FlowInstance.requestData dan FlowInstance.stasuses, jika pakai ini akan sangat rumit query nya

// const responseCollectorSchema = new mongoose.Schema(
//   {
//     by: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "UserRefrensi",
//     },
//     inputId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Input",
//     },
//     value: [
//       {
//         tipe: String, //ambil dari input enum
//         //maksudnya pengen nyimpan berbagai bentuk data yang
//         file: {
//           //untuk pdf | image | signature
//           fileName: String,
//           filePath: String,
//         },
//         text: String, //untuk text | select
//         number: Number, //untuk number
//         date: Date, //untuk date
//         table: {
//           keys: [String],
//           values: [String],
//         }, //untuk table
//         confirm: Boolean, //untuk confirm
//         multipleCheckbox: [
//           {
//             key: String,
//             value: Boolean,
//           },
//         ], //untuk multipleCheckbox
//       },
//     ],
//   },
//   { timestamps: true }
// );

// const ResponseCollector = mongoose.model(
//   "ResponseCollector",
//   responseCollectorSchema
// );
export default ResponseCollector;
