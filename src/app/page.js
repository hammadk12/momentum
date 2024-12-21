// Home page
"use client"
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SigninButton from "./components/SigninButton";



export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard"); // Redirect to the dashboard if authenticated
    }
  }, [status, router]);

  return (
    <div>
      <h1>Welcome to Momentum!</h1>
      {status === "loading" ? (
        <p>Loading...</p>
      ) : !session ? (
        <div>
          <p>Please sign in to continue.</p>
          <SigninButton />
        </div>
      ) : null}
    </div>
  );
}