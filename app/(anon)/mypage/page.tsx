'use client';

import { useUserStore } from '@libs/stores/userStore';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import { AddressDropDown } from '@/(anon)/_components/common/addressDropDown/AddressDropDown';
import GuideResultSummary from './_components/GuideResultSummary';
import GuideResultView from './_components/GuideResultView';
import { styles } from './page.styles';
import { mockData } from './_data/mockData';
import Profile from '@/(anon)/_components/common/profile/Profile';

export default function MyPage() {
  const nickname = useUserStore((state) => state.nickname);
  const { userAddresses, selectedAddress, selectAddress, deleteAddress, toggleFavorite } = useUserAddressStore();

  return (
    <div className={styles.container}>
      {/* 그라데이션 배경 */}
      <div className={styles.gradientBackground}></div>
      
      {/* 프로필 헤더 (임시) */}
      <div className={styles.profileHeader}>
        <div className={styles.profileContent}>
          <Profile size="md" />
          <div>
            <span className={styles.profileName}>{nickname}</span>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        {/* 주소 */}
        <AddressDropDown
          addresses={userAddresses}
          selectedAddress={selectedAddress}
          onDelete={deleteAddress}
          onToggleFavorite={toggleFavorite}
          onSelect={(id: number) => {
            const address = userAddresses.find(addr => addr.id === id);
            if (address) selectAddress(address);
          }}
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
