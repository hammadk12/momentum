import mongoose from 'mongoose';


// Cardio-specific schema extending the parent
const cardioSchema = new mongoose.Schema({
    cardio: {
      distance: { type: Number, required: true },
      duration: { type: Number, required: true },
      cardioType: { type: String, required: true },
    }
  });
  
  // Create a Cardio model using the discriminator
  const CardioWorkout = mongoose.models.CardioWorkout || mongoose.model('CardioWorkout', cardioSchema);  
  
  export default CardioWorkout;