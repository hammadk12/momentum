

import dbConnect from "../../lib/dbConnect";
import WorkoutData from "../../models/workoutData"

export async function POST(req) {
  await dbConnect();
  
  try {
    const { userId, workoutType, workoutName, workoutDate, cardio, exercises } = await req.json();

    // Validate required fields
    if (!userId || !workoutType || !workoutName || !workoutDate) {
      return new Response(
        JSON.stringify({ message: "Missing required fields." }),
        { status: 400 }
      );
    }

    let newWorkoutData = {};

    if (workoutType === "Cardio") {
      if (!cardio || !cardio.cardioType || !cardio.duration || !cardio.distance) {
        return new Response(
          JSON.stringify({ message: "Cardio data is incomplete." }),
          { status: 400 }
        );
      }

      // Cardio-specific data
      newWorkoutData = {
        userId,
        workoutName,
        workoutDate,
        workoutType,
        cardio,
      };
    } else if (workoutType === "Strength") {
      if (!exercises || exercises.length === 0) {
        return new Response(
          JSON.stringify({ message: "Strength exercises are required." }),
          { status: 400 }
        );
      }

      // Strength-specific data
      newWorkoutData = {
        userId,
        workoutName,
        workoutDate,
        workoutType,
        exercises,
      };
    } else {
      return new Response(
        JSON.stringify({ message: "Invalid workout type." }),
        { status: 400 }
      );
    }

    // Create the new workout data
    const newWorkout = new WorkoutData(newWorkoutData);

    // Save to the database
    const savedWorkout = await newWorkout.save();
    const savedWorkoutObj = savedWorkout.toObject();

    return new Response(JSON.stringify(savedWorkoutObj), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Error saving workout data", error }),
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
