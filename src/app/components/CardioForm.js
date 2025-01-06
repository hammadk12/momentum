import { Button, Dialog, Flex, Text, TextField } from "@radix-ui/themes";
import { useState, useEffect } from "react";

const CardioForm = ({ onSave, workoutDate, cardioType, setCardioType, duration, setDuration, distance, setDistance }) => {
  const [date, setDate] = useState(workoutDate);

  // Effect to update date state if workoutDate prop changes
  useEffect(() => {
    if (workoutDate) {
      setDate(workoutDate);
    }
  }, [workoutDate]);

  const handleSave = async () => {
    const cardioData = {
      workoutType: "Cardio",
      cardioType,
      duration,
      distance,
      workoutDate: date,
    };
    console.log('Cardio data being sent:', cardioData);
    onSave("cardio", cardioData);
  };
  

  const handleCancel = () => {
    setCardioType('');
    setDuration('');
    setDistance('');
    setDate(workoutDate); // Reset to initial workoutDate
  };

    return (
      <Dialog.Root>
        <Dialog.Trigger>
            <Button className="p-4 hover:bg-blue-700 transition-colors">+ Cardio</Button>
        </Dialog.Trigger>

        <Dialog.Content maxWidth="450px">
                    <Dialog.Title>Add Cardio</Dialog.Title>
                    <Flex direction="column" gap="3">

                        <label>
                            <Text as="div" size="2" mb="1" weight="bold">
                                Workout Date
                            </Text>
                            <TextField.Root
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)} // Update state when user changes the date
                                required
                            />
                        </label>

                        {/* Current Exercise */}
                        <Flex direction="column" gap="3">
                            <label>
                                <Text as="div" size="2" mb="1" weight="bold">
                                    Exercise Type
                                </Text>
                                <TextField.Root
                                    value={cardioType}
                                    onChange={(e) => setCardioType(e.target.value)}
                                    placeholder="ex: Walk, Run, Cycle"
                                    required
                                />
                            </label>

                            <label>
                                <Text as="div" size="2" mb="1" weight="bold">
                                    Duration (Minutes)
                                </Text>
                                <TextField.Root
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                    placeholder="Duration (Minutes)"
                                    required
                                />
                            </label>

                            <label>
                                <Text as="div" size="2" mb="1" weight="bold">
                                    Distance (Miles)
                                </Text>
                                <TextField.Root
                                    value={distance}
                                    onChange={(e) => setDistance(e.target.value)}
                                    placeholder="Distance (Miles)"
                                    required
                                />
                            </label>

                           
                        </Flex>


                        {/* Save or Cancel Buttons */}
                        <Flex gap="3" mt="4" justify="end">
                            <Dialog.Close onClick={handleCancel}>
                                <Button variant="soft">
                                    Cancel
                                </Button>
                            </Dialog.Close>
                            <Dialog.Close>
                                <Button onClick={handleSave}>
                                    Save
                                </Button>

                            </Dialog.Close>
                        </Flex>
                    </Flex>
                </Dialog.Content>
            </Dialog.Root>
    );
  };
  
  export default CardioForm;
