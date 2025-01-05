
import dbConnect from '../../lib/dbConnect';
import WorkoutData from "../../models/workoutData"

// GET handler for fetching workouts within a date range
export async function GET(req) {
  await dbConnect(); // Ensure DB is connected

  try {
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!startDate || !endDate) {
      return new Response(
        JSON.stringify({ message: 'Both startDate and endDate are required' }),
        { status: 400 }
      );
    }

    const workouts = await WorkoutData.find({
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    });

    if (!workouts || workouts.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No workouts found for the specified range' }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(workouts), { status: 200 });
  } catch (error) {
    console.error('Error fetching workouts:', error);
    return new Response(
      JSON.stringify({ message: 'Error fetching workouts', error }),
      { status: 500 }
    );
  }
}
