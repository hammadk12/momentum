"use client"
import React from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { Button } from '@radix-ui/themes';

const SigninButton = () => {
  const { data: session } = useSession();

  if (session && session.user) {
    return (
      <div>
        <p>{session.user.name}</p> 
        <Button onClick={() => signOut()} size="5">Sign Out</Button>
      </div>
    );
  }

  return (
    <Button onClick={() => signIn()} size="5">
      Sign In
    </Button>
  );
}

export default SigninButton;
