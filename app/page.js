// Home page
"use client"
import "./globals.css";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SigninButton from "./components/SigninButton"




export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard"); // Redirect to the dashboard if authenticated
    }
  }, [status, router]);

 // If the session status is still loading, show the loading message
 if (status === "loading") {
  return <p>Loading...</p>;
}

return (
  <div>
    <h1>Welcome to Momentum!</h1>
    {!session ? (
      <div>
        <p>Please sign in to continue.</p>
        <SigninButton />
      </div>
    ) : null}
  </div>
);
}