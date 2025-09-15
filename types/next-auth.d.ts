import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      username?: string;
      nickname?: string;
      isIncomplete?: boolean; //SSO 회원가입 시 추가정보 입력
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    username?: string;
    nickname?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    username?: string;
    nickname?: string;
    isIncomplete?: boolean; //SSO 회원가입 시 추가정보 입력
  }
}
