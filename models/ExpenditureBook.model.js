import mongoose from "mongoose";

const expenditureBookSchema = new mongoose.Schema(
  {
    date: { type: Date },
    expenditure: { type: Number, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("ExpenditureBook", expenditureBookSchema);
