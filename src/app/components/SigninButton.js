"use client"
import React from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { Button } from '@radix-ui/themes';

const SigninButton = () => {
  const { data: session } = useSession();

  return (
    <Button onClick={() => signIn()} size="5">
      Sign In
    </Button>
  );
}

export default SigninButton;
