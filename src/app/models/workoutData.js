import mongoose from "mongoose";

const SetSchema = new mongoose.Schema({
  reps: { type: Number, required: true },
  weight: { type: Number, required: true },
});

const ExerciseSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Exercise name (e.g., "Incline Dumbbell Press")
  sets: [SetSchema], // Array of sets for each exercise
});

const WorkoutSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true }, // Workout name (e.g., "Chest & Back")
  date: { type: Date, required: true }, // Date of the workout
  exercises: [ExerciseSchema], // Array of exercises
},
{ timestamps: true }
);

const WorkoutData = mongoose.models.WorkoutData || mongoose.model("WorkoutData", WorkoutSchema);

export default WorkoutData;
