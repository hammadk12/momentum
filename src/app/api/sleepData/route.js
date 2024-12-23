import dbConnect from "../../lib/dbConnect"
import SleepData from "../../models/sleepData"

export async function POST(req) {
    await dbConnect(); // Connect to the database
  
    try {
      const { userId, date, hoursSlept } = await req.json(); // Use req.json() to parse the body
  
      // Create a new sleep data entry
      const sleepData = new SleepData({
        userId,
        date,
        hoursSlept,
      });
  
      // Save the sleep data to the database
      const savedSleepData = await sleepData.save();
  
      // Return the saved data as the response
      return new Response(JSON.stringify(savedSleepData), {
        status: 200,
      });
    } catch (error) {
      return new Response(
        JSON.stringify({ message: "Error saving sleep data", error }),
        { status: 500 }
      );
    }
  }