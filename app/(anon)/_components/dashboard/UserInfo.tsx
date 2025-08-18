'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { styles } from './UserInfo.styles';

interface UserInfoProps {
  userName: string;
  onUserClick: () => void;
}

export default function UserInfo({ userName, onUserClick }: UserInfoProps) {
  return (
    <div className={styles.container}>
      <div className={styles.profileSection}>
        {/* 프로필 아이콘 */} 
        <div className={styles.profileIcon}>
          <span className={styles.profileText}>나</span>
        </div>
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
