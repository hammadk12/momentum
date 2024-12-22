"use client"
import { Button, Container, Box, Grid, Section, Flex, Heading, Theme, Text, Card } from "@radix-ui/themes";
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
      <div className="flex flex-col justify-center m-20">
        <p className="text-left text-2xl font-bold text-wrap">Welcome to your dashboard, {session.user.name}!</p>
        <Theme>
        <div>
          <Card>
            Sleep
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