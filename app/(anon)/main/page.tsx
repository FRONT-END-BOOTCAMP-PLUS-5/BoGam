'use client';

import { useUserStore } from '@libs/stores/userStore';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import { AddressDropDown } from '@/(anon)/_components/common/addressDropDown/AddressDropDown';
import DocumentCard from '../mypage/_components/DocumentCard';
import WithdrawButton from '../mypage/_components/WithdrawButton';
import { styles } from '../mypage/page.styles';
import { styles as mainStyles } from './main.styles';
import Profile from '@/(anon)/_components/common/profile/Profile';
import { AddressConfirmationTab } from './_components/tabContainer/AddressConfirmationTab';
import { Pin, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMainPageModule } from '@/hooks/main/useMainPageModule';
import Button from '@/(anon)/_components/common/button/Button';
import { DaumPostcodeModal } from './_components/daumPostcodeModal/DaumPostcodeModal';
import { ConfirmModal } from '../_components/common/modal/ConfirmModal';
import { useModalStore } from '@libs/stores/modalStore';
import { GuideResultsContainer } from './_components/guideResults/GuideResultsContainer';
import FloatingButton from './_components/floatingButton/FloatingButton';

export default function MainPage() {
  const router = useRouter();
  const nickname = useUserStore((state) => state.nickname);
  const {
    userAddresses,
    selectedAddress,
    selectAddress,
    deleteAddress,
    toggleFavorite,
    clearAll,
    deleteVolatileAddress,
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

  // 페이지 이동 시 확인 모달 상태
  const [showNavigationConfirm, setShowNavigationConfirm] = useState(false);

  // 새로 추가된 주소가 저장되지 않은 상태인지 확인
  const hasUnsavedNewAddress =
    isNewAddressSearch && selectedAddress?.isVolatile;

  // 페이지 이동 시 확인 로직
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasUnsavedNewAddress) {
        event.preventDefault();
        event.returnValue = ''; // Chrome에서는 빈 문자열이어야 함
        return '새롭게 추가된 주소가 저장되지 않았습니다. 계속 하시겠습니까?';
      }
    };

    // 브라우저 새로고침/닫기 시 확인
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedNewAddress]);

  // Next.js 라우터 이벤트 처리 (프로그래밍 방식 네비게이션)
  useEffect(() => {
    const handleRouteChange = () => {
      // 허용 플래그가 있으면 네비게이션 허용
      const allowNavigation = sessionStorage.getItem('allow-navigation');
      if (allowNavigation === 'true') {
        sessionStorage.removeItem('allow-navigation');
        return true;
      }

      if (hasUnsavedNewAddress) {
        setShowNavigationConfirm(true);
        return false; // 네비게이션 중단
      }
      return true;
    };

    // 페이지 이동 시 확인 모달 표시
    const originalPush = router.push;
    const originalReplace = router.replace;
    const originalBack = router.back;
    const originalForward = router.forward;

    router.push = (...args) => {
      if (handleRouteChange()) {
        return originalPush.apply(router, args);
      }
      return Promise.resolve(false);
    };

    router.replace = (...args) => {
      if (handleRouteChange()) {
        return originalReplace.apply(router, args);
      }
      return Promise.resolve(false);
    };

    router.back = () => {
      if (handleRouteChange()) {
        return originalBack.apply(router);
      }
      return Promise.resolve(false);
    };

    router.forward = () => {
      if (handleRouteChange()) {
        return originalForward.apply(router);
      }
      return Promise.resolve(false);
    };

    return () => {
      router.push = originalPush;
      router.replace = originalReplace;
      router.back = originalBack;
      router.forward = originalForward;
    };
  }, [hasUnsavedNewAddress, router]);

  // 확인 모달에서 계속하기 선택 시
  const handleConfirmNavigation = () => {
    setShowNavigationConfirm(false);

    // 새로 추가된 휘발성 주소만 삭제
    if (selectedAddress?.isVolatile) {
      deleteVolatileAddress(selectedAddress.id);
    }

    // 기존 DB에서 선택된 주소가 있으면 해당 주소로 복원
    const dbAddresses = userAddresses.filter((addr) => !addr.isVolatile);
    if (dbAddresses.length > 0) {
      const targetAddress =
        dbAddresses.find((addr) => addr.isSelected) ||
        dbAddresses.find((addr) => addr.isPrimary) ||
        dbAddresses[0];
      if (targetAddress) {
        selectAddress(targetAddress);
      }
    }

    // 페이지 이동 허용 플래그 설정 (임시)
    sessionStorage.setItem('allow-navigation', 'true');
  };

  // 확인 모달에서 취소 선택 시
  const handleCancelNavigation = () => {
    setShowNavigationConfirm(false);
    // 현재 페이지에 머물러 있음
  };

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
        <div className={mainStyles.addressMapContainer}>
          <div className={mainStyles.addressInfoHeader}>
            <div className={mainStyles.addressInfoTitleContainer}>
              <h3 className={mainStyles.addressInfoTitle}>선택된 주소 정보</h3>
              <Button
                onClick={onSearch}
                variant='primary'
                className={mainStyles.addressAddButton}
              >
                주소 검색
              </Button>
            </div>
            {/* 위치 상태 표시 */}
            <div className={mainStyles.locationStatusContainer}>
              {gpsLoading ? (
                <span className={mainStyles.locationStatusLoading}>
                  <Pin className={mainStyles.locationStatusIcon} />
                  위치 확인 중...
                </span>
              ) : (
                gpsError && (
                  <span className={mainStyles.locationStatusError}>
                    <X className={mainStyles.locationStatusIcon} />
                    위치 오류
                  </span>
                )
              )}
            </div>
          </div>

          {/* 주소 확인 탭 컴포넌트 */}
          <AddressConfirmationTab />
        </div>

        {/* 가이드 결과 컨테이너 */}
        {!isNewAddressSearch && (
          <>
            {/* 문서 카드 */}
            <DocumentCard />
            <GuideResultsContainer
              selectedAddress={selectedAddress}
              isNewAddressSearch={isNewAddressSearch}
            />
          </>
        )}

        {/* 회원탈퇴 버튼 */}
        <WithdrawButton />
      </div>

      {/* 플로팅 버튼 - 전세 가이드 시작하기 */}
      <FloatingButton />
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

      {/* 페이지 이동 확인 모달 */}
      <ConfirmModal
        isOpen={showNavigationConfirm}
        title='주소 저장 확인'
        onConfirm={handleConfirmNavigation}
        onCancel={handleCancelNavigation}
        confirmText='계속하기'
        cancelText='취소'
        icon='warning'
      >
        새롭게 추가된 주소가 저장되지 않아 추가된 주소가 초기화됩니다.
        <br />
        계속 하시겠습니까?
      </ConfirmModal>
    </div>
  );
}
