'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Star, ChevronDown } from 'lucide-react';
import {
  styles,
  getExpandIconStyle,
  getExpandButtonStyle,
} from './AddressDropDown.styles';
import { AddressDropDownProps } from './types';
import { AddressDropDownList } from './AddressDropDownList';
import { formatAddress } from '@utils/addressUtils';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import LoadingOverlay from '@/(anon)/_components/common/loading/LoadingOverlay';
import { useModalStore } from '@libs/stores/modalStore';
import { UserAddress } from '@/(anon)/main/_components/types/mainPage.types';
import { AuthRequiredState } from './_components/AuthRequiredState';
import { useToastStore } from '@libs/stores/toastStore';
import { useSession } from 'next-auth/react';
import { useSelectedAddressMutation } from '@/hooks/useSelectedAddressMutation';
import { useUserAddresses } from '@/hooks/useUserAddresses';

const DEFAULT_PROPS = {
  title: '현재 열람',
  showFavoriteToggle: true,
  showDeleteButton: true,
  maxHeight: '300px',
  placeholder: '선택된 주소가 없습니다.',
};

// 별 아이콘 컴포넌트
export const StarIcon = ({ filled }: { filled: boolean }) => (
  <Star
    size={18}
    fill={filled ? 'var(--brand-gold)' : 'none'}
    stroke={filled ? 'var(--brand-gold)' : 'var(--brand-dark-gray)'}
    strokeWidth={1.5}
    className={styles.starIcon}
  />
);

// 확장 아이콘 컴포넌트
const ExpandIcon = ({ expanded }: { expanded: boolean }) => (
  <ChevronDown size={20} className={getExpandIconStyle(expanded)} />
);

// AddressDropDown 컴포넌트
export function AddressDropDown(props: AddressDropDownProps) {
  const {
    title = DEFAULT_PROPS.title,
    onDelete,
    onToggleFavorite,
    onSelect,
    showFavoriteToggle = DEFAULT_PROPS.showFavoriteToggle,
    showDeleteButton = DEFAULT_PROPS.showDeleteButton,
    maxHeight = DEFAULT_PROPS.maxHeight,
    placeholder = DEFAULT_PROPS.placeholder,
    className = '',
  } = props;

  const [isExpanded, setIsExpanded] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 모달 스토어
  const { openModal } = useModalStore();
  const { showError, showSuccess } = useToastStore();

  // 세션에서 사용자 정보 가져오기
  const { data: session } = useSession();

  // 주소 데이터 로딩을 위한 훅 사용
  const { isLoading, isAuthenticated } = useUserAddresses();

  // Store에서 데이터 가져오기
  const {
    deleteAddress,
    toggleFavorite,
    getPersistentAddresses,
    getPersistentSelectedAddress,
  } = useUserAddressStore();

  // 낙관적 업데이트를 위한 mutation
  const selectedAddressMutation = useSelectedAddressMutation();

  // 클라이언트 마운트 확인
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 외부 클릭으로 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  // 스토어의 데이터만 사용 (휘발성 주소 제외)
  const addresses = isClient ? getPersistentAddresses() : [];
  const selectedAddress = isClient ? getPersistentSelectedAddress() : null;

  // Store 액션을 위한 래퍼 함수들
  const handleSelect = async (id: number) => {
    const address = addresses.find((addr: UserAddress) => addr.id === id);
    if (!address) {
      console.error('📍 AddressDropDown - 주소를 찾을 수 없음:', {
        id,
        addresses,
      });
      return;
    }

    // 현재 사용자의 닉네임이 없으면 에러
    if (!session?.user?.nickname) {
      showError('사용자 정보를 찾을 수 없습니다.');
      return;
    }

    try {
      // 낙관적 업데이트를 사용하여 즉시 UI 업데이트
      await selectedAddressMutation.mutateAsync(id);

      // 성공 시 메인 페이지 모듈에 알림
      if (onSelect) {
        onSelect(id);
      }
      showSuccess('주소가 선택되었습니다.');
    } catch (error) {
      console.error('📍 AddressDropDown - 주소 선택 API 오류:', error);
      showError('주소 선택 중 오류가 발생했습니다.');
    }
  };

  // 삭제 확인 모달을 띄우는 함수
  const handleDeleteWithConfirmation = (id: number) => {
    const address = addresses.find((addr: UserAddress) => addr.id === id);
    if (!address) return;

    openModal({
      title: '주소 삭제',
      content: `"${address.nickname}" 주소를 정말로 삭제하시겠습니까?`,
      icon: 'warning',
      confirmText: '삭제',
      cancelText: '취소',
      onConfirm: async () => {
        try {
          if (onDelete) {
            await onDelete(id);
          } else {
            await deleteAddress(id);
          }
          // 삭제 성공 시 모달이 자동으로 닫힘 (useModalStore의 기본 동작)
        } catch (error) {
          console.error('주소 삭제 실패:', error);
          showError('주소 삭제 중 오류가 발생했습니다.');
        }
      },
    });
  };

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // 빈 상태 체크
  const isEmpty = !addresses || addresses.length === 0;


  const isDataLoading = !isClient || isLoading;

  // 인증되지 않은 상태 표시
  if (!isAuthenticated) {
    return <AuthRequiredState title={title} className={className} />;
  }

  return (
    <div ref={dropdownRef} className={`${styles.container} ${className}`}>
      {/* 헤더 */}
      <div className={styles.header} onClick={handleToggleExpand}>
        <div className={styles.headerContent}>
          <span className={styles.headerTitle}>{title}</span>
          {selectedAddress ? (
            <div className={styles.selectedAddress}>
              {showFavoriteToggle && isClient && (
                <div
                  onClick={(e) => {
                    e.stopPropagation(); // 드롭다운 토글 방지
                    if (selectedAddress) {
                      toggleFavorite(selectedAddress.id);
                    }
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <StarIcon filled={selectedAddress.isPrimary || false} />
                </div>
              )}
              <div className={styles.selectedAddressText}>
                {(() => {
                  const { firstPart, secondPart } = formatAddress(
                    selectedAddress.completeAddress
                  );
                  return (
                    <>
                      <div className={styles.addressFirstLine}>{firstPart}</div>
                      {secondPart && (
                        <div className={styles.addressSecondLine}>
                          {secondPart}
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          ) : (
            <div className={styles.placeholderText}>{placeholder}</div>
          )}
        </div>
        <button
          className={getExpandButtonStyle(isEmpty)}
          aria-label={isExpanded ? '목록 닫기' : '목록 열기'}
          disabled={isEmpty || selectedAddressMutation.isPending}
        >
          <ExpandIcon expanded={isExpanded} />
        </button>
      </div>

      {/* 로딩 오버레이 */}
      {isDataLoading && (
        <div className={styles.loadingOverlay}>
          <LoadingOverlay
            isVisible={true}
            currentStep={1}
            totalSteps={1}
            variant='inline'
            spinnerSize='small'
          />
        </div>
      )}

      {/* 드롭다운 목록 */}
      <AddressDropDownList
        addresses={addresses}
        selectedAddress={selectedAddress}
        onDelete={handleDeleteWithConfirmation}
        onToggleFavorite={onToggleFavorite || toggleFavorite}
        onSelect={async (id) => {
          // 기본 handleSelect 호출 (API 호출 포함)
          await handleSelect(id);
          // 항상 드롭다운 닫기
          setIsExpanded(false);
        }}
        showFavoriteToggle={showFavoriteToggle}
        showDeleteButton={showDeleteButton}
        isExpanded={isExpanded}
        isUpdating={selectedAddressMutation.isPending}
        maxHeight={maxHeight}
        isClient={isClient}
      />
    </div>
  );
}
