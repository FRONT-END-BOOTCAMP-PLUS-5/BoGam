'use client';

import { useState } from 'react';
import { AddressDropDown } from '@/(anon)/_components/common/addressDropDown';
import GuideResultSummary from './_components/GuideResultSummary';
import GuideResultView from './_components/GuideResultView';
import { styles } from './page.styles';
import { mockData } from './_data/mockData';

export default function MyPage() {
  const [selectedAddressId, setSelectedAddressId] = useState<string>('1');
  const [addresses, setAddresses] = useState(mockData.addresses);

  const selectedAddress = addresses.find(
    (addr) => addr.id === selectedAddressId
  );

  const handleAddressSelect = (id: string) => {
    setSelectedAddressId(id);
  };

  const handleAddressToggleFavorite = (id: string) => {
    setAddresses((prev) =>
      prev.map((addr) =>
        addr.id === id ? { ...addr, isFavorite: !addr.isFavorite } : addr
      )
    );
  };

  const handleAddressDelete = (id: string) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
    // 삭제된 주소가 선택된 주소였다면 첫 번째 주소로 변경
    if (id === selectedAddressId) {
      const remainingAddresses = addresses.filter((addr) => addr.id !== id);
      if (remainingAddresses.length > 0) {
        setSelectedAddressId(remainingAddresses[0].id);
      }
    }
  };

  return (
    <div className={styles.container}>
      {/* 그라데이션 배경 */}
      <div className={styles.gradientBackground}></div>
      
      {/* 프로필 헤더 (임시) */}
      <div className={styles.profileHeader}>
        <div className={styles.profileContent}>
          <div className={styles.avatar}>
            {mockData.profile.avatar}
          </div>
          <div className={styles.profileInfo}>
            <span className={styles.profileName}>{mockData.profile.name}</span>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        {/* 주소 */}
        <AddressDropDown
          addresses={addresses}
          selectedAddress={selectedAddress}
          onDelete={handleAddressDelete}
          onToggleFavorite={handleAddressToggleFavorite}
          onSelect={handleAddressSelect}
        />

        {/* 문서 카드 */}
        <div className={styles.card}>
          <div className={styles.cardTitle}>문서</div>
          <div className={styles.documentButtons}>
            <span className={styles.documentButton}>등기부등본</span>
            <span className={styles.documentButton}>납세증명서</span>
          </div>
        </div>

        {/* 가이드 결과 요약 */}
        <GuideResultSummary
          match={mockData.guideSummary.match}
          mismatch={mockData.guideSummary.mismatch}
          unchecked={mockData.guideSummary.unchecked}
        />

        {/* 가이드 결과 보기 */}
        <GuideResultView
          guideSteps={mockData.guideSteps}
        />

        {/* 회원탈퇴 버튼 */}
        <div className={styles.withdrawButton}>
          <button className={styles.withdrawBtn}>
            회원탈퇴
          </button>
        </div>
      </div>
    </div>
  );
}
