'use client';

import { useUserStore } from '@libs/stores/userStore';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import { AddressDropDown } from '@/(anon)/_components/common/addressDropDown/AddressDropDown';
import GuideResultSummary from './_components/GuideResultSummary';
import GuideResultView from './_components/GuideResultView';
import WithdrawButton from './_components/WithdrawButton';
import { styles } from './page.styles';
import { useStepResults } from '@/hooks/useStepResults';
import Profile from '@/(anon)/_components/common/profile/Profile';
import LoadingOverlay from '@/(anon)/_components/common/loading/LoadingOverlay';

export default function MyPage() {
  const nickname = useUserStore((state) => state.nickname);
  const { userAddresses, selectedAddress, selectAddress, deleteAddress, toggleFavorite } = useUserAddressStore();
  const { guideSummary, guideSteps, isLoading, error } = useStepResults(selectedAddress?.nickname);

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.gradientBackground}></div>
        <LoadingOverlay 
          isVisible={true}
          title="데이터를 불러오는 중..."
          currentStep={1}
          totalSteps={1}
        />
      </div>
    );
  }

  // 에러 상태 처리
  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.gradientBackground}></div>
        <div className={styles.errorContainer}>
          <div className={styles.errorContent}>
            <div className={styles.errorIcon}>⚠️</div>
            <h2 className={styles.errorTitle}>데이터 로드 실패</h2>
            <p className={styles.errorMessage}>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className={styles.errorButton}
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

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
          match={guideSummary.match}
          mismatch={guideSummary.mismatch}
          unchecked={guideSummary.unchecked}
        />

        {/* 가이드 결과 보기 */}
        <GuideResultView
          guideSteps={guideSteps}
        />

        {/* 회원탈퇴 버튼 */}
        <WithdrawButton />
      </div>
    </div>
  );
}
