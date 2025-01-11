"use client";
import { Button } from "@radix-ui/themes";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import WorkoutCard from "../components/WorkoutCard"
import ProgressCard from "../components/ProgressCard";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [streak, setStreak] = useState(null);
  const [totalWorkouts, setTotalWorkouts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Prevent fetch during session loading

    if (!session) {
      // Redirect if not authenticated
      router.push("/");
      return;
    }

    const fetchWorkoutStats = async () => {
      try {
        // Fetch the workout data for the logged-in user
        const response = await fetch("/api/workoutData"); // Ensure API route exists
        const data = await response.json();

        if (response.ok) {
          // Sort the data by workout date
          const sortedData = data.sort(
            (a, b) => new Date(a.workoutDate) - new Date(b.workoutDate)
          );

          // Calculate total workouts
          setTotalWorkouts(sortedData.length);

          // Calculate streak (consecutive workout days)
          let currentStreak = 0;
          let previousDate = new Date(sortedData[0].workoutDate);
          sortedData.forEach((workout) => {
            const currentDate = new Date(workout.workoutDate);
            const dayDifference = (currentDate - previousDate) / (1000 * 3600 * 24);

            if (dayDifference === 1) {
              currentStreak++;
            } else if (dayDifference > 1) {
              currentStreak = 0; // Reset streak on gap
            }
            previousDate = currentDate;
          });

          setStreak(currentStreak); // Update state with streak
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
  }, [status, session, router]); // Re-run the effect when dependencies change

  if (status === "loading" || loading) return <div>Loading...</div>;

  if (error) return <div>{error}</div>;

  const userId = session?.user?.id;

  return (
    <div className="flex justify-center min-h-screen">
      <div className="max-w-screen-sm w-full">
        {/* Greeting */}
        <p className="font-bold text-xl text-center py-4 w-full">
          Welcome, {session?.user?.name}!
        </p>

        {/* Progress Card */}
        {streak !== null && totalWorkouts !== null ? (
          <ProgressCard streak={streak} totalWorkouts={totalWorkouts} />
        ) : (
          <div className="text-center">Loading your progress...</div>
        )}

        {/* Workout Card */}
        <WorkoutCard router={router} />

        {/* Sign-Out Button */}
        <Button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="mx-[26px]"
          style={{ cursor: "pointer" }}
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
}
