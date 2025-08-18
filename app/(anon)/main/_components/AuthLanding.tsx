'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useUserStore } from '@libs/store/userStore';

export default function AuthLanding() {
  const { data: session } = useSession();
  const setNickname = useUserStore((state) => state.setNickname);

  useEffect(() => {
    if (session?.user.nickname) {
      setNickname(session.user.nickname);
    }
  }, [session, setNickname]);

  return null;
}
