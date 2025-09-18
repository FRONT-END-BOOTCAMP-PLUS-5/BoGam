import React from 'react';
import { styles } from '../mypage/page.styles';
import Profile from '@/(anon)/_components/common/profile/Profile';
import WithdrawButton from '../mypage/_components/WithdrawButton';
import FloatingButton from './_components/floatingButton/FloatingButton';
import { MainPageClient } from './_components/MainPageComponent';
import { getUserNicknameFromSession } from '@utils/userAddress';

export default async function MainPage() {
  // 서버 컴포넌트에서 세션 정보 가져오기
  const userNickname = await getUserNicknameFromSession();

  return (
    <div className={styles.container}>
      {/* 그라데이션 배경 - 정적 */}
      <div className={styles.gradientBackground}></div>

      {/* 프로필 헤더 - 정적 */}
      <div className={styles.profileHeader}>
        <div className={styles.profileContent}>
          <Profile size='md' />
          <div>
            <span className={styles.profileName}>
              {userNickname || '사용자'}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        {/* 주소 관련 영역 - 동적 */}
        <MainPageClient />

        {/* 회원탈퇴 버튼 - 정적 */}
        <WithdrawButton />
      </div>

      {/* 플로팅 버튼 - 정적 */}
      <FloatingButton />
    </div>
  );
}
