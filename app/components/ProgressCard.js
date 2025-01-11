"use client"
import { Card } from "@radix-ui/themes"; // Assuming you're using Radix UI for the Card component

const ProgressCard = ({ streak, totalWorkouts }) => {
    return (
      <Card className="m-6">
        {/* Header with centered text */}
        
  
        {/* Grid layout with two columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Column 1: Streak */}
          <div className="flex flex-col items-center">
            <h3 className="text-2xl font-bold text-white">Streak:</h3>
            <p className="text-6xl text-white">{streak} 🔥
            </p>
          </div>
  
          {/* Column 2: Total Workouts */}
          <div className="flex flex-col items-center">
            <h3 className="text-2xl font-bold text-white">Total Workouts:</h3>
            <p className="text-6xl text-white">{totalWorkouts} 🏋🏼</p>
          </div>
        </div>
      </Card>
    );
  };
  
  export default ProgressCard;
  