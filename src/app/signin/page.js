// src/app/signin/page.js
"use client";
import { signIn, useSession } from "next-auth/react";
import SigninButton from "../components/SigninButton"; // Adjust path if needed

export default function SignIn() {
  const { status } = useSession();

  const handleSignIn = () => {
    signIn('google'); // This triggers the Google sign-in process
  };

  return (
    <div>
      <h1>Sign In to Momentum</h1>
      {status === "loading" ? (
        <p>Loading...</p>
      ) : (
        <SigninButton />
      )}
    </div>
  );
}
