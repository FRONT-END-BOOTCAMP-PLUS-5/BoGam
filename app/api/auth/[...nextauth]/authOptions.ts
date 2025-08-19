import bcrypt from 'bcrypt';
import { prisma } from '@utils/prisma';
import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null;

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
          nickname: user.nickname,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 60 * 1, // 3시간 로그인 상태 유지
  },
  jwt: {
    maxAge: 60 * 1, //jwt 토큰 3시간 유지
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.nickname = user.nickname;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.nickname = token.nickname as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/signin',
  },
};
