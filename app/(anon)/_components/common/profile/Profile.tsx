'use client';

import { useUserStore } from '@libs/store/userStore';
import { getProfileClassName } from '@/(anon)/_components/common/profile/Profile.style';

interface ProfileProps {
  size: 'sm' | 'md';
}

export default function Profile({ size }: ProfileProps) {
  const nickname = useUserStore((state) => state.nickname);
  const initial = nickname?.charAt(0);

  return <div className={getProfileClassName(size)}>{initial}</div>;
}
