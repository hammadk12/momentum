"use client"
import { Button } from "@radix-ui/themes";
import { useSession, signOut } from "next-auth/react";

export default function Dashboard() {
    const { data: session } = useSession();
  
    if (!session) {
      return (
        <div>
          <h1>You need to sign in to view your dashboard.</h1>
        </div>
      );
    }
  
    return (
      <div>
        <h1>Welcome to your dashboard, {session.user.name}!</h1>
        <Button 
        onClick={() => signOut({ callbackUrl: '/' })} 
        style={{
          cursor: 'pointer'
        }}>
          Sign Out
        </Button>
        {/* Additional dashboard content */}
      </div>
    );
  }