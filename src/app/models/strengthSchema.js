import mongoose from "mongoose";
import WorkoutData from "./workoutData";

const strengthSchema = new mongoose.Schema({
    // You can define additional fields for strength workouts if necessary
    // In this case, just leaving it as-is to handle exercises
  });
  
  // Create a Strength model using the discriminator
  const StrengthWorkout = mongoose.models.StrengthWorkout || mongoose.model('StrengthWorkout', strengthSchema);  
  
  export default StrengthWorkout;