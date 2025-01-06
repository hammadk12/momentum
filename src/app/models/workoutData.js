import mongoose from 'mongoose';

// Parent schema that defines common fields
const workoutSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  workoutName: { type: String, required: true },
  workoutDate: { type: Date, required: true },
  workoutType: { type: String, required: true },  // 'Cardio' or 'Strength'
  
  // Conditional field based on workout type
  exercises: {
    type: [{ 
      name: String,
      sets: Array
    }],
    required: function() { return this.workoutType === 'Strength'; },  // Only required for Strength workouts
    default: undefined  // Default to undefined for Cardio workouts
  }
});

// Parent model
const WorkoutData = mongoose.models.WorkoutData || mongoose.model('WorkoutData', workoutSchema);

export default WorkoutData;