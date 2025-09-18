'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import { useMainPageModule } from '@/hooks/main/useMainPageModule';
import { useModalStore } from '@libs/stores/modalStore';

export const useMainPage = () => {
  const router = useRouter();
  const {
    userAddresses,
    selectedAddress,
    selectAddress,
    deleteAddress,
    toggleFavorite,
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

  // 주소 선택 핸들러
  const handleAddressSelect = (id: number) => {
    const address = userAddresses.find((addr) => addr.id === id);
    if (address) selectAddress(address);
  };

  return {
    // 상태
    userAddresses,
    selectedAddress,
    gpsLoading,
    gpsError,
    showPostcode,
    isNewAddressSearch,
    isOpen,
    content,
    showNavigationConfirm,
    postcodeRef,

    // 액션
    onSearch,
    executePostcode,
    setShowPostcode,
    deleteAddress,
    toggleFavorite,
    handleAddressSelect,
    confirmModal,
    cancelModal,
    handleConfirmNavigation,
    handleCancelNavigation,
  };
};
