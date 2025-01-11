"use client"
import { useEffect, useState } from "react";
import { Button, Dialog, Flex, TextField, Text, Card, Popover } from "@radix-ui/themes";
import { format } from "date-fns-tz"
import { toZonedTime, fromZonedTime } from 'date-fns-tz'
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import DateRangePicker from "../components/DateRangePicker";
import CardioForm from "../components/CardioForm"


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
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [cardioType, setCardioType] = useState('');
  const [duration, setDuration] = useState('');
  const [distance, setDistance] = useState('');
  const [currentExercise, setCurrentExercise] = useState({
    name: "",
    sets: 0,
    setsData: [],
});

 // Handler for start date change
 const handleStartDateChange = (value) => {
  setStartDate(value);
};

// Handler for end date change
const handleEndDateChange = (value) => {
  setEndDate(value);
};

// Handler for searching workouts within the date range
const handleSearchWorkouts = async () => {
  console.log("Search button clicked")
  if (!startDate || !endDate) {
    alert('Please select both start and end dates.');
    return;
  }

  try {
    // Send the date range to the backend
    const response = await fetch(`/api/dateRange?startDate=${startDate}&endDate=${endDate}`);
    const data = await response.json();

    if (response.ok) {
      const sortedData = data.sort((a, b) => new Date(a.date) - new Date(b.date))
      setWorkoutStats(sortedData);
    } else {
      console.error('Error fetching workouts:', data.message);
      setWorkoutStats([]);
    }
  } catch (error) {
    console.error('Error:', error);
    setWorkoutStats([])
  }
};


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

const handleSaveWorkout = async (type, workoutData) => {
  const userId = session?.user?.id;

  if (!userId) {
    alert("You must be logged in to save a workout.");
    return;
  }


  try {
    let route = "";
    let payload = {};

    console.log('Workout Data Received:', workoutData);

    if (type === "cardio") {
      // Cardio-specific payload
      const { cardioType, duration, distance } = workoutData;
      const workoutDate = workoutData.workoutDate ? new Date(workoutData.workoutDate) : new Date(); // Handle possible null or undefined date
      const formattedDate1 = workoutDate.toISOString().split("T")[0]; // "2025-01-05"
      

      route = "/api/cardioData";
      payload = {
        userId,
        name: "Cardio",
        date: formattedDate1, // Assuming you have a `workoutDate` state
        workoutType: "Cardio",
        cardio: {
          cardioType: cardioType,
          duration: parseInt(duration),  // Ensure duration is a number
          distance: parseFloat(distance),
        },
      };
    } else if (type === 'strength') {
      const { workoutName, exercises } = workoutData;
      const workoutDate = workoutData.workoutDate ? new Date(workoutData.workoutDate) : new Date(); // Handle possible null or undefined date
      const formattedDate1 = workoutDate.toISOString().split("T")[0]; // "2025-01-05"
      // Strength workout-specific payload
      route = "/api/workoutData";
      payload = {
        userId,
        name: workoutData.workoutName,
        date: formattedDate1,
        workoutType: "Strength",
        exercises: exercises.map((exercise) => ({
          name: exercise.name,
          sets: exercise.setsData.map((set) => ({
            reps: set.reps,
            weight: set.weight,
          })),
        })),
      };
    } else {
      throw new Error("Invalid workout type");
    }

    console.log('Payload:', payload);  // Log the payload just before sending it to check for correctness.


    const response = await fetch(route, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Error response:", errorData);
      throw new Error("Failed to save workout. Please try again.");
    }

    const data = await response.json();
    console.log(`${type.charAt(0).toUpperCase() + type.slice(1)} workout saved successfully:`, data);

    // Reset the appropriate form data
    if (type === "cardio") {
      setCardioType("");
      setDuration("");
      setDistance("");
    } else if (type === "strength") {
      setExercises([]);
      setWorkoutName("");
    }
    setWorkoutDate(new Date().toISOString().split("T")[0]);

    window.location.reload();
    alert(`${type.charAt(0).toUpperCase() + type.slice(1)} workout saved successfully!`);
  } catch (error) {
    console.error(`Error saving ${type} workout:`, error);
    alert(`Error saving ${type} workout. Please try again.`);
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

        console.log("Fetched data:", data);

        if (response.ok) {
          const sortedData = data.sort((a, b) => new Date(a.date) - new Date(b.date))
          setWorkoutStats(sortedData);
          console.log("Sorted workouts: ", sortedData);

          // Calculate date range from workout dates
          if (data.length > 0) {
            const dates = data.map((workout) => new Date(workout.date));
            const minDate = new Date(Math.min(...dates));
            const maxDate = new Date(Math.max(...dates))
            setDateRange(`${minDate.toLocaleDateString()} - ${maxDate.toLocaleDateString()}`
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
    <div className="flex flex-col items-center px-4 py-8 text-white min-h-screen">
      <h1 className="text-4xl font-bold mb-6 mt-10">Your Workouts</h1>
      <DateRangePicker 
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={handleStartDateChange}
        onEndDateChange={handleEndDateChange}
        onSearch={() => handleSearchWorkouts()}
      />

      <div className="w-full max-w-3xl space-y-4">
        {workoutStats && workoutStats.length > 0 ? (
          workoutStats.map((workout) => {
          
            const workoutDate = workout.workoutDate;

            if (!workoutDate) {
              console.error("Workout date is missing:", workout); // Log the whole object if the date is missing
              return <p>No valid date available</p>;
            }

            // Proceed with date handling if workoutDate exists
            const parsedDate = new Date(workoutDate);
            if (isNaN(parsedDate)) {
              console.error("Invalid date:", workoutDate);
              return <p>No valid date available</p>; // Optionally return a placeholder message
            }

            const formattedDate = parsedDate.toISOString().split("T")[0]; // Format the date to YYYY-MM-DD
            const utcDate = fromZonedTime(formattedDate, localTimeZone);
            const localDate = toZonedTime(utcDate, localTimeZone); // Adjusting to the local timezone
            const finalFormattedDate = format(localDate, "MMM d, yyyy"); // Format the date in a user-friendly format

            

            return (
            <Card
              key={workout._id}
              className="bg-gray-800 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">
                  Workout on {finalFormattedDate}
                </h2>
              </div>

              <p className="font-semibold">{workout.workoutName}</p>

              {/* Conditional rendering for strength workouts */}
              {workout.exercises ? (
                <p className="font-medium text-gray-300">
                  Exercises:{" "}
                  {workout.exercises.map((exercise) => exercise.name || "Unnamed Exercise").join(", ")}
                </p>
              ) : (
                <p></p>
              )}

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
                  {/* Render exercises only for strength workouts */}
                  {workout.exercises && workout.exercises.length > 0 && (
                    workout.exercises.map((exercise) => (
                      <li key={exercise._id}>
                        <span className="font-medium">{exercise.name || "Unnamed Exercise"}</span>
                        {exercise.sets && exercise.sets.length > 0 ? (
                          <ul className="list-inside leading-loose pl-4 text-gray-300">
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
                    ))
                  )}

                   {/* Display cardio-specific details */}
                  {workout.cardio && (
                    <div className="mt-4 text-gray-300">
                      <ul className="list-inside pl-4 space-y-1">
                        {workout.cardio.cardioType && (
                          <li>Type: {workout.cardio.cardioType}</li>
                        )}
                        {workout.cardio.duration && (
                          <li>Duration: {workout.cardio.duration} minutes</li>
                        )}
                        {workout.cardio.distance && (
                          <li>Distance: {workout.cardio.distance} miles</li>
                        )}
                      </ul>
                    </div>
                  )}
                </ul>
              </div>
            )}
          </Card>
            )
          })
        ) : (
          <p>No workouts logged yet. Add your workouts using the button below</p>
        )}
      </div>
      <Button 
      className="absolute top-3 left-3 p-3 hover:bg-blue-700 transition-colors"
      onClick={navigateHome}>
        Home
      </Button>
      
      <Popover.Root>
        <Popover.Trigger>
          <Button className="fixed bottom-8 right-8">+</Button>
        </Popover.Trigger>
        <Popover.Content width="170px" height='150px'>
        <Flex direction='column' gapY='10px'>
      <CardioForm 
        onSave={handleSaveWorkout}
        workoutDate={workoutDate}
        cardioType={cardioType}
        setCardioType={setCardioType}
        duration={duration}
        setDuration={setDuration}
        distance={distance}
        setDistance={setDistance}
        type='cardio'
      />

      <Dialog.Root
                onOpenChange={(isOpen) => {
                    if (!isOpen) {
                        setExercises([]);
                    }
                }}
            >
                <Dialog.Trigger>
                    <Button className="p-4 hover:bg-blue-700 transition-colors">+ Add Workout</Button>
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
                                    onClick={() => 
                                      handleSaveWorkout("strength", { 
                                          workoutName, 
                                          workoutDate,
                                          exercises 
                                      })}>
                                    Save
                                </Button>

                            </Dialog.Close>
                        </Flex>
                    </Flex>
                </Dialog.Content>
            </Dialog.Root>
            <Popover.Close>
              <Button variant="soft">Close</Button>
            </Popover.Close>
            </Flex>
            </Popover.Content>
            </Popover.Root>
    </div>
  );
}