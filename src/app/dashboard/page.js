"use client"
import { Button, Theme, Card, Dialog, Flex, TextField, Text, DropdownMenu } from "@radix-ui/themes";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import WorkoutCard from "../components/WorkoutCard";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [sleepData, setSleepData] = useState([])

  useEffect(() => {
    if (session) {
      const fetchSleepData = async () => {
        const res = await fetch("/api/sleepData")
        const data = await res.json()

        if (res.ok) {
          setSleepData(data)
        } else {
          console.error("Error fetching sleep data:", data.message)
        }
      }

      fetchSleepData();
    }
  }, [session])

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (!session) {
    return <div>You need to sign in to view your dashboard.</div>;  // Show a message if no session is found
  }


  return (
    <div className="m-20">
      <p className="text-left text-2xl font-bold text-wrap">Welcome to your dashboard, {session.user.name}!</p>
      <Theme>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">

          <Card className="p-6 flex flex-col items-center text-center">
            <h2 className="text-xl font-bold mb-4">Sleep</h2>
            <p className="text-gray-500 mb-4">
              Track your sleep hours and view your progress.
            </p>
            <Button className="mt-auto">Add Sleep Data</Button>
          </Card>

          {/* Food Card */}
          <Card className="p-6 flex flex-col items-center text-center">
            <h2 className="text-xl font-bold mb-4">Food</h2>
            <p className="text-gray-500 mb-4">
              Monitor your calorie intake and meals.
            </p>
            <Button className="mt-auto">Add Food Data</Button>
          </Card>

          {/* Workout Card */}
          <WorkoutCard />
          
          </div>
          </Theme>



          <Button
            onClick={() => signOut({ callbackUrl: '/' })}
            style={{ cursor: 'pointer', marginTop: '300px', width: '150px' }}>
            Sign Out
          </Button>

    </div>
  );
}