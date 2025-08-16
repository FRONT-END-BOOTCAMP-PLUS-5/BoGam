import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@utils/prisma';
import bcrypt from 'bcrypt';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials.password) return null;

        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.username,
        };
      },
    }),
  ],
  pages: {
    signIn: '/signin', //우리의 로그인 페이지 -> 로그인 실패시 여기로!
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
