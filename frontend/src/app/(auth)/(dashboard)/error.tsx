'use client'; // Error components must be Client Components

import { Button, buttonVariants } from '@/components/ui/button';
import { getSession } from '@/lib/auth/utils';
import { cn } from '@/lib/utils';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  if (error.message.includes('308')) {
    console.log(error.message);
    signOut();
  }

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();

      if (!session?.accessToken) {
        router.push('/');
      }
    };

    checkSession();
  }, [error, router]);

  return (
    <div className="flex flex-col items-center justify-center gap-2 min-h-[calc(100vh-40px)] text-center">
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl">
          Uh oh! Something went wrong.
        </h1>
        <p className="md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed ">
          We can’t seem to find the page you’re looking for.
        </p>
      </div>
      <div className="flex space-x-4">
        <Button variant="outline" onClick={() => reset()}>
          Try again
        </Button>
        <Link
          className={cn(
            buttonVariants({
              variant: 'default'
            })
          )}
          href="/dashboard"
          prefetch={false}
        >
          Go back
        </Link>
      </div>
    </div>
  );
}
