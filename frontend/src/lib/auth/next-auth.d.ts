/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    accessToken: string | null;
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
}

declare module 'next-auth/jwt' {
  interface JWT {
    sub: string;
    user: {
      id: string;
      username: string;
    } | null;
    accessToken: string | null;
    iat: number;
    exp: number;
    jti: string;
  }
}
