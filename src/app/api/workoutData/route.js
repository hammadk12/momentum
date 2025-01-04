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
    
    // GET handler for fetching workout data for the week
export async function GET(req) {
    await dbConnect(); // Ensure DB is connected
  
    try {
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay()); // Set to start of the week (Sunday)
      startOfWeek.setHours(0, 0, 0, 0); // Start at midnight
  
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 7); // Set to the end of the week (next Sunday)
      endOfWeek.setHours(23, 59, 59, 999); // End at 11:59:59 PM
  
      // Fetch workouts for the week from the database
      const workoutsForWeek = await WorkoutData.find({
        date: { $gte: startOfWeek, $lt: endOfWeek }, // Filter by the date range
      });
  
      if (!workoutsForWeek || workoutsForWeek.length === 0) {
        return new Response(JSON.stringify({ message: "No workouts logged this week" }), {
          status: 404,
        });
      }
  
      // Return the workouts for the week
      return new Response(JSON.stringify(workoutsForWeek), { status: 200 });
    } catch (error) {
      console.error("Error fetching workout data:", error);
      return new Response(
        JSON.stringify({ message: "Error fetching workout data", error }),
        { status: 500 }
      );
    }
  }