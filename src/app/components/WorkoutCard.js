import { useState } from 'react'
import React from 'react'
import { Button, Theme, Card, Dialog, Flex, TextField, Text, DropdownMenu } from '@radix-ui/themes'

const WorkoutCard = () => {
    const [exercises, setExercises] = useState([]);
    const [currentExercise, setCurrentExercise] = useState({
      name: "",
      sets: 0,
      setsData: [],
    });
  
    // Handle input changes for current exercise
    const handleCurrentExerciseChange = (field, value) => {
      setCurrentExercise({
        ...currentExercise,
        [field]: value,
      });
  
      // Initialize setsData if sets number changes
      if (field === "sets") {
        const setsCount = parseInt(value, 10);
        setCurrentExercise({
          ...currentExercise,
          sets: setsCount,
          setsData: new Array(setsCount).fill({ reps: "", weight: "" }),
        });
      }
    };
  
    const handleSetChange = (index, field, value) => {
      const updatedSets = [...currentExercise.setsData];
      updatedSets[index] = { ...updatedSets[index], [field]: value };
      setCurrentExercise({ ...currentExercise, setsData: updatedSets });
    };
  
    const handleAddExercise = () => {
      if (currentExercise.name && currentExercise.sets > 0) {
        setExercises([...exercises, currentExercise]);
        setCurrentExercise({ name: "", sets: 0, setsData: [] });
      }
    };
  
    return (
      <Card className="p-6 flex flex-col items-center text-center">
        <h2 className="text-xl font-bold mb-4">Workouts</h2>
        <p className="text-gray-500 mb-4">Log your workouts and track performance.</p>
  
        <Dialog.Root>
          <Dialog.Trigger>
            <Button className="mt-auto">Add Workout Data</Button>
          </Dialog.Trigger>
  
          <Dialog.Content maxWidth="450px">
            <Dialog.Title>Add Workout</Dialog.Title>
            <Flex direction="column" gap="3">
              {/* Workout Name */}
              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  Workout Name
                </Text>
                <TextField.Root placeholder="Enter workout name" />
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
                  />
                </label>
  
                <label>
                  <Text as="div" size="2" mb="1" weight="bold">
                    Number of Sets
                  </Text>
                  <select
                    value={currentExercise.sets}
                    onChange={(e) => handleCurrentExerciseChange("sets", e.target.value)}
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
                <Dialog.Close>
                  <Button variant="soft" color="gray">
                    Cancel
                  </Button>
                </Dialog.Close>
                <Dialog.Close>
                  <Button
                  onClick={() => {
                    setExercises([]);
                  }}
                  >Save</Button>
                </Dialog.Close>
              </Flex>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      </Card>
    );
  };
  
  export default WorkoutCard;