import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    No: String,
    Name: String,
    coordinates: {
      type: "Point",
      coordinates: [Number, Number], //longtitude, lattitude
    },
  },
  { timestamps: true }
);

customerSchema.index({ No: 1 }, { unique: true });

const Customer = mongoose.model("Customer", customerSchema);
export default Customer;
