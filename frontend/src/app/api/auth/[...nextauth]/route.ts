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

        console.log(user);

        return user;
      }
    })
  ]
});

export { handler as GET, handler as POST };
