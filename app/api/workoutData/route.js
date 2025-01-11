import dbConnect from "../../lib/dbConnect";
import StrengthWorkout from "../../models/strengthSchema";
import WorkoutData from "../../models/workoutData";

export async function POST(req) {
    await dbConnect();
    
    try {
        const { userId, name, date, workoutType, exercises } = await req.json(); // Parse the request body
    
        if (!userId || !name || !date || !workoutType || workoutType !== 'Strength') {
          return new Response(
            JSON.stringify({ message: "Invalid or missing fields for Strength workout." }),
            { status: 400 }
          );
        }

        // Validate strength-specific fields
    if (!exercises || exercises.length === 0) {
      return new Response(
        JSON.stringify({ message: "Exercises field is required for Strength workouts." }),
        { status: 400 }
      );
    }
    
         // Create a new strength workout
    const strengthWorkout = new StrengthWorkout({
      userId,
      workoutName: name,
      workoutDate: date,
      workoutType,
      exercises,
    });
    
        // Save the strength workout to the database
    const savedStrengthWorkout = await strengthWorkout.save();

    return new Response(JSON.stringify(savedStrengthWorkout), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Error saving strength workout data", error }),
      { status: 500 }
    );
  }
}
    
    // GET handler for fetching all workout data
export async function GET() {
  await dbConnect(); // Ensure DB is connected

  try {
    // Fetch all workouts from the database
    const allWorkouts = await WorkoutData.find({});

    if (!allWorkouts || allWorkouts.length === 0) {
      return new Response(JSON.stringify({ message: "No workouts found" }), {
        status: 404,
      });
    }

    // Return all the workouts
    return new Response(JSON.stringify(allWorkouts), { status: 200 });
  } catch (error) {
    console.error("Error fetching workout data:", error);
    return new Response(
      JSON.stringify({ message: "Error fetching workout data", error }),
      { status: 500 }
    );
  }
}
