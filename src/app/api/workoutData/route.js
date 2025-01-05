import dbConnect from "../../lib/dbConnect";
import WorkoutData from "../../models/workoutData";

export async function POST(req) {
    await dbConnect();
    
    try {
        const { userId, name, date, exercises } = await req.json(); // Parse the request body
    
        // Validate the required fields
        if (!userId || !name || !date || !exercises) {
          return new Response(
            JSON.stringify({ message: "All fields are required." }),
            { status: 400 }
          );
        }
    
        // Create a new workout data entry
        const workoutData = new WorkoutData({
          userId,
          name,
          date,
          exercises,
        });
    
        // Save the workout data to the database
        const savedWorkoutData = await workoutData.save();
    
        // Return the saved data as the response
        return new Response(JSON.stringify(savedWorkoutData), { status: 200 });
      } catch (error) {
        return new Response(
          JSON.stringify({ message: "Error saving workout data", error }),
          { status: 500 }
        );
      }
    }
    
    // GET handler for fetching all workout data
export async function GET(req) {
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
