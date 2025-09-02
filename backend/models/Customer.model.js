import mongoose from "mongoose";

//with coordinates
const customerSchema = new mongoose.Schema({});

const Customer = mongoose.model("Customer", customerSchema);
export default Customer;
