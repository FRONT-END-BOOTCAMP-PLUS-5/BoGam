'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { styles } from './UserInfo.styles';
import Profile from '@/(anon)/_components/common/profile/Profile';

interface UserInfoProps {
  userName: string;
  onUserClick: () => void;
}

export default function UserInfo({ userName, onUserClick }: UserInfoProps) {
  return (
    <div className={styles.container}>
      <div className={styles.profileSection}>
        {/* 프로필 아이콘 */} 
        <Profile size="md" />
        {/* 사용자 정보 */}
        <div className={styles.userText}>
          <span className={styles.greeting}>안녕하세요,</span>
          <div className={styles.nameAndArrow}>
            <span className={styles.userName}>{userName} 님!</span>
            <button 
              onClick={onUserClick}
              className={styles.arrowButton}
              aria-label="사용자 정보 보기"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
