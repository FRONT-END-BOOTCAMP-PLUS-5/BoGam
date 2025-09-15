'use client';

import { useUserStore } from '@libs/stores/userStore';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import { AddressDropDown } from '@/(anon)/_components/common/addressDropDown/AddressDropDown';
import DocumentCard from '../mypage/_components/DocumentCard';
import WithdrawButton from '../mypage/_components/WithdrawButton';
import { styles } from '../mypage/page.styles';
import Profile from '@/(anon)/_components/common/profile/Profile';
import { AddressConfirmationTab } from './_components/tabContainer/AddressConfirmationTab';
import { Pin, X } from 'lucide-react';
import { useMainPageModule } from '@/hooks/main/useMainPageModule';
import Button from '@/(anon)/_components/common/button/Button';
import { DaumPostcodeModal } from './_components/daumPostcodeModal/DaumPostcodeModal';
import { ConfirmModal } from '../_components/common/modal/ConfirmModal';
import { useModalStore } from '@libs/stores/modalStore';
import { GuideResultsContainer } from './_components/guideResults/GuideResultsContainer';

export default function MainPage() {
  const nickname = useUserStore((state) => state.nickname);
  const {
    userAddresses,
    selectedAddress,
    selectAddress,
    deleteAddress,
    toggleFavorite,
  } = useUserAddressStore();
  // useMainPageModule에서 GPS 관련 상태 및 검색 기능 가져오기
  const {
    gpsLoading,
    gpsError,
    onSearch,
    executePostcode,
    postcodeRef,
    showPostcode,
    setShowPostcode,
    isNewAddressSearch,
  } = useMainPageModule();

  // 모달 스토어
  const { isOpen, content, confirmModal, cancelModal } = useModalStore();

  console.log('isNewAddressSearch', isNewAddressSearch);

  return (
    <div className={styles.container}>
      {/* 그라데이션 배경 */}
      <div className={styles.gradientBackground}></div>

      {/* 프로필 헤더 */}
      <div className={styles.profileHeader}>
        <div className={styles.profileContent}>
          <Profile size='md' />
          <div>
            <span className={styles.profileName}>{nickname}</span>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        {/* 주소 드롭다운 영역 */}
        <AddressDropDown
          addresses={userAddresses}
          selectedAddress={selectedAddress}
          onDelete={deleteAddress}
          onToggleFavorite={toggleFavorite}
          onSelect={(id: number) => {
            const address = userAddresses.find((addr) => addr.id === id);
            if (address) selectAddress(address);
          }}
        />

        {/* 주소 추가 및 지도 영역 */}
        <div className='bg-brand-white rounded-lg border border-brand-light-gray shadow-md p-6 max-w-md mx-auto w-full'>
          <div className='mb-5'>
            <div className='flex justify-between items-center'>
              <h3 className='text-base font-semibold text-brand-black'>
                선택된 주소 정보
              </h3>
              <Button
                onClick={() => onSearch && onSearch()}
                variant='primary'
                className='!h-8 !w-20 !text-xs !mt-0'
              >
                주소 추가
              </Button>
            </div>
            {/* 위치 상태 표시 */}
            <div className='mt-2'>
              {gpsLoading ? (
                <span className='text-gray-600 text-sm'>
                  <Pin className='inline-block w-4 h-4 mr-1' />
                  위치 확인 중...
                </span>
              ) : (
                gpsError && (
                  <span className='text-red-500 text-sm'>
                    <X className='inline-block w-4 h-4 mr-1' />
                    위치 오류
                  </span>
                )
              )}
            </div>
          </div>

          {/* 주소 확인 탭 컴포넌트 */}
          <AddressConfirmationTab />
        </div>

        {/* 문서 카드 */}
        <DocumentCard />

        {/* 가이드 결과 컨테이너 */}
        {!isNewAddressSearch && (
          <GuideResultsContainer
            selectedAddress={selectedAddress}
            isNewAddressSearch={isNewAddressSearch}
          />
        )}

        {/* 회원탈퇴 버튼 */}
        <WithdrawButton />
      </div>
      {/* Daum 우편번호 검색 모달 */}
      <DaumPostcodeModal
        postcodeRef={postcodeRef}
        showPostcode={showPostcode}
        onClose={() => setShowPostcode(false)}
        onSearch={executePostcode}
      />

      {/* 공통 모달 */}
      <ConfirmModal
        isOpen={isOpen}
        title={content?.title || ''}
        onConfirm={confirmModal}
        onCancel={cancelModal}
        confirmText={content?.confirmText}
        cancelText={content?.cancelText}
        icon={content?.icon || 'info'}
      >
        {content?.content}
      </ConfirmModal>
    </div>
  );
}
