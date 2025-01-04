"use client"
import { Button, Theme, Card, Dialog, Flex, TextField, Text, DropdownMenu } from "@radix-ui/themes";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import WorkoutCard from "../components/WorkoutCard";
import ProgressCard from "../components/ProgressCard";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [streak, setStreak] = useState(null);
  const [totalWorkouts, setTotalWorkouts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter(); // Use useRouter here to manage routing
  
  useEffect(() => {
    if (status === "loading") {
      return; // Prevent fetch if session is still loading
    }

    const fetchWorkoutStats = async () => {
      try {
        // Fetch the workout data for the logged-in user
        const response = await fetch("/api/workoutData"); // Modify this URL as needed
        const data = await response.json();

        if (response.ok) {
          // Sort the data by date
          const sortedData = data.sort((a, b) => new Date(a.date) - new Date(b.date));

          // Calculate total workouts
          setTotalWorkouts(sortedData.length);

          // Calculate streak (consecutive workout days)
          let currentStreak = 1;
          let previousDate = new Date(sortedData[0].date);
          sortedData.forEach((workout, index) => {
            const currentDate = new Date(workout.date);
            const dayDifference = (currentDate - previousDate) / (1000 * 3600 * 24);
            if (dayDifference === 1) {
              currentStreak++;
            } else if (dayDifference > 1) {
              currentStreak = 1; // Reset streak on gap
            }
            previousDate = currentDate;
          });

          // Set the streak state
          setStreak(currentStreak);

        } else {
          setError(data.message || "Something went wrong");
        }
      } catch (error) {
        setError("Error fetching data from server");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkoutStats();
  }, [status]); // Re-run the effect when session status changes

  if (status === "loading" || loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!session) {
    return <div>You need to sign in to view your dashboard.</div>;
  }


  const userId = session.user.id

  return (
    <div className="flex justify-center min-h-screen text-white">
      <div className="max-w-screen-sm w-full"> {/* Wrapper for mobile-first approach */}
      <p className=" text-white text-xl font-bold text-center py-4 w-full">
      Welcome, {session.user.name}!
    </p>
        {/* Progress Card */}
        {streak !== null && totalWorkouts !== null ? (
        <ProgressCard streak={streak} totalWorkouts={totalWorkouts} />
      ) : (
        <div className="text-center">Loading your progress...</div>
      )}

        {/* Workout Card */}
        <WorkoutCard router={router} />
        
        <Button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="m-6" // Center button, mobile-friendly width
          style={{ cursor: 'pointer' }}
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
}