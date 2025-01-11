import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the home page or a specific fallback route
    router.push('/');
  }, [router]);

  return (
    <div>
      <h1>Something went wrong, redirecting to home...</h1>
    </div>
  );
}
