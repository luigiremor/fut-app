import api from '@/services/api';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { isAfter } from 'date-fns';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      authorize: async (credentials) => {
        if (!credentials?.username || !credentials?.password) return null;

        const { username, password } = credentials;

        const res = await api.post('/auth/login', { username, password });

        if (!res || res.status === 401) {
          return null;
        }

        const user = {
          id: res.data.id,
          username: res.data.username,
          accessToken: res.data.access_token
        };

        return user;
      }
    })
  ],
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const { id, username, accessToken } = user;

        token = { ...token, user: { id, username }, accessToken };
      }

      console.log(token);

      const isTokenExpired = isAfter(Date.now(), token?.exp * 1000);

      if (isTokenExpired) {
        return { ...token, user: null, accessToken: null };
      }

      return token;
    },
    async session({ token, session }) {
      if (token) {
        session = {
          ...session,
          accessToken: token.accessToken,
          user: token.user
        };
      }
      return session;
    }
  }
};
