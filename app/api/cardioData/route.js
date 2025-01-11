import dbConnect from "../../lib/dbConnect";
import CardioWorkout from "../../models/cardioSchema";

export async function POST(req) {
  await dbConnect();

  try {
    const { userId, workoutType, name, date, cardio } = await req.json();

    if (!userId || !name || !date || !workoutType || workoutType !== 'Cardio') {
      return new Response(
        JSON.stringify({ message: "Invalid or missing fields for Cardio workout." }),
        { status: 400 }
      );
    }

    // Validate cardio-specific fields
    if (!cardio || !cardio.distance || !cardio.duration || !cardio.cardioType) {
      return new Response(
        JSON.stringify({ message: "Cardio fields are required." }),
        { status: 400 }
      );
    }

    // Create a new cardio workout
    const cardioWorkout = new CardioWorkout({
      userId,
      workoutName: name,
      workoutDate: date,
      workoutType,
      cardio,
    });

    // Save the cardio workout to the database
    const savedCardioWorkout = await cardioWorkout.save();

    return new Response(JSON.stringify(savedCardioWorkout), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Error saving cardio workout data", error }),
      { status: 500 }
    );
  }
}