import { useState } from 'react';
import React from 'react';
import { Button, Theme, Card, Dialog, Flex, TextField, Text } from '@radix-ui/themes';

const WorkoutCard = ({ userId }) => {
    const [exercises, setExercises] = useState([]);
    const [currentExercise, setCurrentExercise] = useState({
        name: "",
        sets: 0,
        setsData: [],
    });

    const [workoutName, setWorkoutName] = useState(""); // Separate state for workout name

    const handleSaveWorkout = async () => {
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
                date: new Date().toISOString(),
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
            alert("Workout saved successfully!");
          } catch (error) {
            console.error("Error saving workout:", error);
            alert("Error saving workout. Please try again.");
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
    };

    return (
        <Card className="p-6 flex flex-col items-center text-center">
            <h2 className="text-xl font-bold mb-4">Workouts</h2>
            <p className="text-gray-500 mb-4">Log your workouts and track performance.</p>

            <Dialog.Root
                onOpenChange={(isOpen) => {
                    if (!isOpen) {
                        setExercises([]);
                    }
                }}
            >
                <Dialog.Trigger>
                    <Button className="mt-auto">Add Workout Data</Button>
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
                                <Button variant="soft" color="gray">
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
        </Card>
    );
};

export default WorkoutCard;
