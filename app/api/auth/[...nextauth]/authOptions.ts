import bcrypt from 'bcrypt';
import { prisma } from '@utils/prisma';
import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import KakaoProvider from 'next-auth/providers/kakao';

export const authOptions: AuthOptions = {
  providers: [
    // ✅ 일반 로그인
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
          id: user.id,
          name: user.name,
          email: user.username, // username을 이메일처럼 사용
          username: user.username,
          nickname: user.nickname,
        };
      },
    }),

    // ✅ 카카오 로그인
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET || '',
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 60 * 180, // 3시간
  },
  jwt: {
    maxAge: 60 * 180,
  },

  callbacks: {
    async jwt({ token, user, account, profile }) {
      // ✅ 일반 로그인
      if (user && account?.provider !== 'kakao') {
        token.id = user.id;
        token.username = user.username;
        token.nickname = user.nickname;
        token.isIncomplete = false;
      }

      // ✅ 카카오 로그인
      if (account?.provider === 'kakao' && profile) {
        const kakaoId = account.providerAccountId;
        const username = `kakao_${kakaoId}`; // 👈 이메일 대신 고유 ID 사용

        const nickname =
          (profile as { properties?: { nickname?: string } }).properties
            ?.nickname || '카카오 사용자';

        const dbUser = await prisma.user.upsert({
          where: { username },
          update: {}, // 닉네임은 사용자 입력 후 저장
          create: {
            username,
            name: nickname, // 카카오 닉네임은 name으로만 저장
            nickname: '',
            password: '',
            phoneNumber: '',
            pinNumber: '',
          },
        });

        token.id = dbUser.id;
        token.username = dbUser.username;
        token.nickname = dbUser.nickname;

        token.isIncomplete =
          !dbUser.nickname || !dbUser.phoneNumber || !dbUser.pinNumber;
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.nickname = token.nickname;
        session.user.isIncomplete = token.isIncomplete;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      // 추가 정보 입력 페이지로 가는 경우 등
      if (url.startsWith('/signup')) {
        return `${baseUrl}/signup`;
      }
      return baseUrl;
    },
  },

  pages: {
    signIn: '/signin',
  },
};
