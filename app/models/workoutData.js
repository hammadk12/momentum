// models/WorkoutData.js
import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // Assuming you have a User model to link to
    },
    workoutName: {
      type: String,
      required: true,
    },
    workoutDate: {
      type: Date,
      required: true,
    },
    workoutType: {
      type: String,
      enum: ["Cardio", "Strength"],
      required: true,
    },
    cardio: {
      cardioType: {
        type: String,
        required: function () {
          return this.workoutType === "Cardio"; // Only for cardio workouts
        },
      },
      duration: {
        type: Number,
        required: function () {
          return this.workoutType === "Cardio"; // Only for cardio workouts
        },
      },
      distance: {
        type: Number,
        required: function () {
          return this.workoutType === "Cardio"; // Only for cardio workouts
        },
      },
    },
    exercises: [
      {
        name: String,
        sets: [
          {
            reps: String,
            weight: String,
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Check if the models are already defined to avoid OverwriteModelError
let WorkoutData = mongoose.models.WorkoutData || mongoose.model("WorkoutData", workoutSchema);

// Discriminators for workout types
let CardioWorkout = mongoose.models.CardioWorkout || WorkoutData.discriminator("CardioWorkout", new mongoose.Schema({}));
let StrengthWorkout = mongoose.models.StrengthWorkout || WorkoutData.discriminator("StrengthWorkout", new mongoose.Schema({}));

export default { WorkoutData, CardioWorkout, StrengthWorkout };