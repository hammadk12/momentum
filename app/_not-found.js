"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; 

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the home page after a short delay to handle page loading
    setTimeout(() => {
      router.push('/');
    }, 2000); // Give some time for the user to see the message

    // Optional: you can also log the error or message for debugging
    console.log("Page not found, redirecting to home...");
  }, [router]);

  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>Redirecting to the homepage...</p>
    </div>
  );
}
