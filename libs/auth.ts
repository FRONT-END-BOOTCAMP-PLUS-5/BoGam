import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@utils/prisma';
import { verifyPassword } from '@utils/verifyPassword/password';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          // 사용자 찾기
          const user = await prisma.user.findFirst({
            where: { username: credentials.username },
          });

          if (!user) {
            return null;
          }

          // 비밀번호 검증
          if (user.password) {
            const isValidPassword = await verifyPassword(
              credentials.password,
              user.password
            );

            if (!isValidPassword) {
              return null;
            }
          }

          // NextAuth 세션에 포함할 사용자 정보
          return {
            id: user.id,
            name: user.name,
            email: user.username,
            nickname: user.nickname,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.email || undefined;
        token.nickname = user.nickname || undefined;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.nickname = token.nickname as string;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-key',
};
