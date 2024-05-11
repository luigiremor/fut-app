'use client';

import { useSession, signIn, signOut } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();

  console.log(session);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          signIn('credentials', {
            redirect: false,
            username: 'luigi',
            password: 'teste'
          });
        }}
      >
        <input type="text" placeholder="Username" />
        <input type="password" placeholder="Password" />
        <button type="submit">Submit</button>
      </form>
      <button onClick={() => signOut()}>Sign out</button>
      oi
    </main>
  );
}
