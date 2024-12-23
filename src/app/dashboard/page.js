"use client"
import { Button, Theme, Card } from "@radix-ui/themes";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";

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
      <div className="flex flex-col justify-center m-20">
        <p className="text-left text-2xl font-bold text-wrap">Welcome to your dashboard, {session.user.name}!</p>
        <Theme>
        <div>
          <Card>
            Sleep
            <ul>
            {sleepData.map((data) => (
            <li key={data._id}>
              Date: {new Date(data.date).toLocaleDateString()} - Hours Slept: {data.hoursSlept}
            </li>
          ))}
            </ul>
          </Card>
          <Card>
            Food
          </Card>
          <Card>
            Time
          </Card>
        </div>
        </Theme>
        
        
        
        <Button 
        onClick={() => signOut({ callbackUrl: '/' })} 
        style={{cursor: 'pointer'}}>
        Sign Out
        </Button>
        
      </div>
    );
  }