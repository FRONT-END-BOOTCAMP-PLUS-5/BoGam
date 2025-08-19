'use client';

import React from 'react';
import { ChevronRight, Star } from 'lucide-react';
import { styles } from './UserInfo.styles';
import Profile from '@/(anon)/_components/common/profile/Profile';
import { useUserStore } from '@libs/stores/userStore';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';

interface UserInfoProps {
  onUserClick: () => void;
}

export default function UserInfo({ onUserClick }: UserInfoProps) {
  const { nickname } = useUserStore();
  const { selectedAddress } = useUserAddressStore();
  
  // store의 nickname이 있으면 사용, 없으면 기본값 사용
  const displayName = nickname || '사용자';
  const displayAddress = selectedAddress?.completeAddress || '주소 선택 안됨';
  const displayIsPrimary = selectedAddress?.isPrimary;

  return (
    <div className={styles.container}>
      <div className={styles.profileSection}>
        {/* 프로필 아이콘 */} 
        <Profile size="md" />
        {/* 사용자 정보 */}
        <div className={styles.userText}>
          <span className={styles.greeting}>안녕하세요,</span>
          <div className={styles.nameAndArrow}>
            <span className={styles.userName}>{displayName}</span>
            <span className={styles.honorific}>님!</span>
            <button 
              onClick={onUserClick}
              className={styles.arrowButton}
              aria-label="사용자 정보 보기"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          {/* 현재 열람 주소 */}
          <div className={styles.addressSection}>
            <h3 className={styles.addressTitle}>현재 열람</h3>
            <div className={styles.addressContent}>
              {displayIsPrimary && (
                <Star
                  size={18}
                  fill="var(--brand-gold)"
                  stroke="var(--brand-gold)"
                  strokeWidth={1.5}
                  className="inline mr-1"
                />
              )}
              <span className={styles.addressText}>{displayAddress}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
