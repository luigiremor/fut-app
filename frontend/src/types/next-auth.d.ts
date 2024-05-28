/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    accessToken: string;
    user: {
      id: string;
      username: string;
    } | null;
    expires: string;
  }

  interface User {
    id: string;
    username: string;
    accessToken: string;
  }

  interface JWT {
    sub: string;
    user: {
      id: string;
      username: string;
    };
    accessToken: string;
    iat: number;
    exp: number;
    jti: string;
  }
}
