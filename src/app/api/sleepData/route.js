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
    // GET handler for fetching sleep data
    export async function GET() {
      try {
        // Ensure DB is connected before querying
        await dbConnect();
    
        // Fetch sleep data from MongoDB
        const sleepData = await SleepData.find();  // No limit for now
    
        if (!sleepData || sleepData.length === 0) {
          // If no data found
          console.log("No sleep data found");
          return new Response(JSON.stringify({ message: "No sleep data found" }), { status: 404 });
        }
    
        // Return the fetched sleep data
        return new Response(JSON.stringify(sleepData), { status: 200 });
      } catch (error) {
        console.error("Error fetching sleep data:", error); // Enhanced error logging
        return new Response(
          JSON.stringify({ message: "Error fetching sleep data", error: error.message }),
          { status: 500 }
        );
      }
    }