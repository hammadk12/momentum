"use client"
import { useEffect, useState } from "react";
import { Button, Dialog, Flex, TextField, Text, Card } from "@radix-ui/themes";
import { format } from "date-fns-tz"
import { toZonedTime, fromZonedTime } from 'date-fns-tz'
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";


export default function WorkoutStats() {
  const { data: session } = useSession();
  const [workoutStats, setWorkoutStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState("");
  const [expandedCard, setExpandedCard] = useState(null)
  const [workoutName, setWorkoutName] = useState(""); // Separate state for workout name
  const [workoutDate, setWorkoutDate] = useState(new Date().toISOString().split("T")[0])
  const [exercises, setExercises] = useState([]);
  const [currentExercise, setCurrentExercise] = useState({
    name: "",
    sets: 0,
    setsData: [],
});

// Handle input changes for current exercise
const handleCurrentExerciseChange = (field, value) => {
  setCurrentExercise((prev) => {
      const newExercise = {
          ...prev,
          [field]: value,
      };

      // If the "sets" field changes, update the setsData accordingly
      if (field === "sets") {
          const setsCount = parseInt(value, 10);
          // Adjust the setsData to match the new number of sets
          newExercise.setsData = Array.from({ length: setsCount }, () => ({ reps: "", weight: "" }));
      }

      return newExercise;
  });
};

const handleSetChange = (index, field, value) => {
  const updatedSets = [...currentExercise.setsData];
  updatedSets[index] = { ...updatedSets[index], [field]: value };
  setCurrentExercise({ ...currentExercise, setsData: updatedSets });
};

const handleAddExercise = () => {
  const { name, sets, setsData } = currentExercise;

  // Validation checks
  if (!workoutName.trim()) {
      alert("Please enter a workout name.");
      return;
  }

  if (!name.trim()) {
      alert("Please enter an exercise name.");
      return;
  }

  if (sets <= 0) {
      alert("Please select the number of sets.");
      return;
  }

  const isSetsDataComplete = setsData.every(
      (set) => set.reps.trim() && set.weight.trim()
  );

  if (!isSetsDataComplete) {
      alert("Please fill in all reps and weight fields for each set.");
      return;
  }

  // If all fields are valid, proceed to add exercise
  setExercises([...exercises, currentExercise]);

  // Clear only the exercise-specific fields
  setCurrentExercise({ name: "", sets: 0, setsData: [] });

  // Keep the workout name intact
};

const handleCancel = () => {
  // Reset both workout name and exercises when Cancel is clicked
  setWorkoutName("");
  setExercises([]);
  setWorkoutDate(new Date().toISOString().split("T")[0]); 
};

const handleSaveWorkout = async () => {
  const userId = session?.user?.id

  if (!userId) {
    alert("You must be logged in to save a workout.");
    return;
  }

  try {
      // Preparing exercises data for saving
      const workoutData = exercises.map((exercise) => ({
        name: exercise.name,
        sets: exercise.setsData.map((set) => ({
          reps: set.reps,
          weight: set.weight,
        })),
      }));
  
      const response = await fetch("/api/workoutData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId, // Use the passed userId
          name: workoutName,
          date: workoutDate,
          exercises: workoutData, // Send the exercises in the expected format
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.text();
        console.error("Error response:", errorData);
        throw new Error("Failed to save workout. Please try again.");
      }
  
      const data = await response.json();
      console.log("Workout saved successfully:", data);
  
      // Reset the form
      setExercises([]);
      setWorkoutName("");
      setWorkoutDate(new Date().toISOString().split("T")[0])
      alert("Workout saved successfully!");
    } catch (error) {
      console.error("Error saving workout:", error);
      alert("Error saving workout. Please try again.");
    }
  };

  const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

  const router = useRouter()
  const navigateHome = () => {
    router.push("/dashboard")
  }

  useEffect(() => {
    const fetchWorkoutStats = async () => {
      try {
        const response = await fetch("/api/workoutData"); 
        const data = await response.json();

        if (response.ok) {
          setWorkoutStats(data);

          // Calculate date range from workout dates
          if (data.length > 0) {
            const dates = data.map((workout) => new Date(workout.date));
            const minDate = new Date(Math.min(...dates));
            const maxDate = new Date(Math.max(...dates));
            setDateRange(
              `${minDate.toLocaleDateString()} - ${maxDate.toLocaleDateString()}`
            );
          } else {
            setDateRange("No workouts this week");
          }
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
  }, []);

  const toggleCard = (id) => {
    setExpandedCard((prev) => (prev === id ? null : id))
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col items-center px-4 py-8 bg-gray-900 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Your Workouts</h1>
      <div className="w-full max-w-3xl space-y-4">
        {workoutStats && workoutStats.length > 0 ? (
          workoutStats.map((workout) => {

            const parsedDate = new Date(workout.date).toISOString().split("T")[0];
            const utcDate = fromZonedTime(parsedDate, localTimeZone);
            const localDate = toZonedTime(utcDate, localTimeZone);// Adjusting to the local timezone
            const formattedDate = format(localDate, "MMM d, yyyy");

            return (
            <Card
              key={workout._id}
              className="bg-gray-800 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold">
                  Workout on {formattedDate}
                </h2>
              </div>

              <p className="font-medium">
                Exercises:{" "}
                {workout.exercises.map((exercise) => exercise.name || "Unnamed Exercise").join(", ")}
              </p>
              <Button className="mt-2"
                onClick={() => toggleCard(workout._id)}
              >
                 {expandedCard === workout._id ? "Hide Details" : "View Details"}
              </Button>
              {expandedCard === workout._id && (
                <div className="mt-4">
                  <h3 className="font-bold mb-1">
                    Full Workout Details:
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                  {workout.exercises.map((exercise) => (
                  <li key={exercise._id}>
                    <span className="font-medium">
                      {exercise.name || "Unnamed Exercise"}
                    </span>
                    {exercise.sets && exercise.sets.length > 0 ? (
                          <ul className="list-inside pl-4 space-y-1 text-gray-300">
                            {exercise.sets.map((set, index) => (
                              <li key={index}>
                                {set.reps && `Reps: ${set.reps}`} 
                                {set.weight && `, Weight: ${set.weight} lbs`}
                              </li>
                            ))}
                        </ul>
                    ) : (
                      <span>No sets data available</span>
                    )}
                    </li>
                  ))}
                  </ul>
                </div>
              )}
            </Card>
            )
          })
        ) : (
          <p>No workouts logged yet.</p>
        )}
      </div>
      <Button 
      className="fixed bottom-8 right-8 p-4 hover:bg-blue-700 transition-colors"
      onClick={navigateHome}>
        Home
      </Button>
      <Dialog.Root
                onOpenChange={(isOpen) => {
                    if (!isOpen) {
                        setExercises([]);
                    }
                }}
            >
                <Dialog.Trigger>
                    <Button className="fixed bottom-20 right-8 p-4 hover:bg-blue-700 transition-colors">+</Button>
                </Dialog.Trigger>

                <Dialog.Content maxWidth="450px">
                    <Dialog.Title>Add Workout</Dialog.Title>
                    <Flex direction="column" gap="3">
                        {/* Current Workout Name Display */}
                        {workoutName && (
                            <Text as="div" size="2" weight="bold" color="blue" mb="2">
                                Current Workout: {workoutName}
                            </Text>
                        )}

                        {/* Workout Name */}
                        <label>
                            <Text as="div" size="2" mb="1" weight="bold">
                                Workout Name
                            </Text>
                            <TextField.Root
                                placeholder="Enter workout name"
                                value={workoutName} // Bind to workoutName state
                                onChange={(e) => setWorkoutName(e.target.value)} // Update workoutName state
                                required
                            />
                        </label>

                        <label>
                            <Text as="div" size="2" mb="1" weight="bold">
                                Workout Date
                            </Text>
                            <TextField.Root
                                type="date"
                                value={workoutDate}
                                onChange={(e) => setWorkoutDate(e.target.value)}
                                required
                            />
                        </label>

                        {/* Current Exercise */}
                        <Flex direction="column" gap="3">
                            <label>
                                <Text as="div" size="2" mb="1" weight="bold">
                                    Exercise Name
                                </Text>
                                <TextField.Root
                                    placeholder="Enter exercise name"
                                    value={currentExercise.name}
                                    onChange={(e) => handleCurrentExerciseChange("name", e.target.value)}
                                    required
                                />
                            </label>

                            <label>
                                <Text as="div" size="2" mb="1" weight="bold">
                                    Number of Sets
                                </Text>
                                <select
                                    value={currentExercise.sets}
                                    onChange={(e) => handleCurrentExerciseChange("sets", e.target.value)}
                                    required
                                    className="border rounded p-2"
                                >
                                    <option value="0">Select Sets</option>
                                    {[1, 2, 3, 4, 5].map((num) => (
                                        <option key={num} value={num}>
                                            {num}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            {/* Dynamic Inputs for Sets */}
                            {currentExercise.setsData.map((set, index) => (
                                <Flex key={index} direction="row" gap="2" align="center">
                                    <label>
                                        <Text>Reps</Text>
                                        <TextField.Root
                                            type="number"
                                            value={set.reps}
                                            placeholder="Reps"
                                            onChange={(e) =>
                                                handleSetChange(index, "reps", e.target.value)
                                            }
                                            required
                                        />
                                    </label>
                                    <label>
                                        <Text>Weight (lbs)</Text>
                                        <TextField.Root
                                            type="number"
                                            value={set.weight}
                                            placeholder="Weight"
                                            onChange={(e) =>
                                                handleSetChange(index, "weight", e.target.value)
                                            }
                                            required
                                        />
                                    </label>
                                </Flex>
                            ))}

                            {/* Add Exercise Button */}
                            <Button onClick={handleAddExercise} className="mt-3">
                                Add Exercise
                            </Button>
                        </Flex>

                        {/* Display Added Exercises */}
                        {exercises.length > 0 && (
                            <div className="mt-4">
                                <Text as="div" size="2" weight="bold">
                                    Added Exercises:
                                </Text>
                                <ul>
                                    {exercises.map((exercise, index) => (
                                        <li key={index} className="mt-2">
                                            <Text>
                                                <strong>{exercise.name}</strong> - {exercise.sets} sets
                                            </Text>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Save or Cancel Buttons */}
                        <Flex gap="3" mt="4" justify="end">
                            <Dialog.Close onClick={handleCancel}>
                                <Button variant="soft">
                                    Cancel
                                </Button>
                            </Dialog.Close>
                            <Dialog.Close disabled={exercises.length === 0}>
                                <Button
                                    onClick={handleSaveWorkout}
                                >
                                    Save
                                </Button>

                            </Dialog.Close>
                        </Flex>
                    </Flex>
                </Dialog.Content>
            </Dialog.Root>
    </div>
  );
}