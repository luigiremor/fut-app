import api from '@/services/api';
import { NextAuthOptions, Session } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

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

      return token;
    },
    async session({ token, session }) {
      if (token) {
        session = {
          ...session,
          accessToken: token.accessToken,
          user: token.user
        } as Session;
      }

      return session;
    }
  }
};
