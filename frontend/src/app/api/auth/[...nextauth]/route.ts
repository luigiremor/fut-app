import api from '@/services/api';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      authorize: async (credentials) => {
        console.log(credentials ?? 'no credentials');

        if (!credentials?.username || !credentials?.password) return null;

        const { username, password } = credentials;

        console.log(username, password);

        const res = await api.post('/auth/login', { username, password });

        console.log(res.data);

        if (res.status === 401) {
          return null;
        }

        const user = {
          id: res.data.id,
          username: res.data.username,
          accessToken: res.data.access_token
        };

        console.log('return authorize', user);

        return user;
      }
    })
  ],
  session: { strategy: 'jwt' },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      console.log('jwt', token);

      if (user) {
        const { id, username, accessToken } = user;

        token = { ...token, user: { id, username }, accessToken };
      }

      console.log('return jwt', token);

      return token;
    },
    async session({ token, session }) {
      console.log('session', session);
      console.log('token', token);

      if (token) {
        session = {
          ...session,
          accessToken: token.accessToken,
          user: token.user
        };
      }

      console.log('return session', session);

      return session;
    }
  }
});

export { handler as GET, handler as POST };
