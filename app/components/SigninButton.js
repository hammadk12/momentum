"use client"
import React from 'react'
import { signIn } from 'next-auth/react'
import { Button } from '@radix-ui/themes';

const SigninButton = () => {

  return (
    <Button onClick={() => signIn()} size="5">
      Sign In
    </Button>
  );
}

export default SigninButton;
