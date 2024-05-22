'use client';

import api from '@/services/api';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRef } from 'react';

export default function Home() {
  const { data: session } = useSession();

  console.log(session);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  const testAuthorization = async () => {
    console.log('Testing authorization');

    try {
      const response = await api.get('auth/profile');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          signIn('credentials', {
            redirect: false,
            username: usernameRef.current.value,
            password: passwordRef.current.value
          });
        }}
      >
        <input type="text" placeholder="Username" ref={usernameRef} />
        <input type="password" placeholder="Password" ref={passwordRef} />
        <button type="submit">Submit</button>
      </form>
      <button onClick={() => signOut({ redirect: false })}>Sign out</button>
      <button onClick={testAuthorization}>Test authorization</button>
    </main>
  );
}
