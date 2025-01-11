"use client"
import React from 'react'
import { signIn } from 'next-auth/react'
import { Button } from '@radix-ui/themes';

const SigninButton = () => {

  return (
    <Button onClick={() => signIn()} className='p-6 rounded'>
      Sign In
    </Button>
  );
}

export default SigninButton;
