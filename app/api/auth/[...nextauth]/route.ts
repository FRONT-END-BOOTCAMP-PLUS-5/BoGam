import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@utils/prisma';
import { PasswordService } from '@be/services/PasswordService';

const handler = NextAuth({
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
            const isValidPassword = await PasswordService.verifyPassword(
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
            email: user.username, // NextAuth는 email 필드를 요구하므로 username을 사용
            image: null,
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
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.email || undefined; // null 체크 추가
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
