import mongoose from "mongoose";

const SleepDataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Link to the user
  date: { type: Date, required: true }, // Date of the sleep entry
  hoursSlept: { type: Number, required: true, min: 0 }, // Hours slept
}, { timestamps: true }); // Adds createdAt and updatedAt fields

const SleepData = mongoose.models.SleepData || mongoose.model("SleepData", SleepDataSchema);

export default SleepData;
