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
import { useModalStore } from '@libs/stores/modalStore';
import { UserAddress } from '@/(anon)/main/_components/types/mainPage.types';
import { LoadingState } from './_components/LoadingState';
import { AuthRequiredState } from './_components/AuthRequiredState';

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
    addresses: propAddresses,
    selectedAddress: propSelectedAddress,
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

  // React Query 제거 - Zustand store만 사용
  // const { isLoading, isAuthenticated } = useUserAddresses();

  // Store에서 데이터 가져오기
  const {
    userAddresses,
    selectedAddress: storeSelectedAddress,
    selectAddress,
    deleteAddress,
    toggleFavorite,
    getPersistentAddresses,
    getPersistentSelectedAddress,
  } = useUserAddressStore();

  // 클라이언트 마운트 확인
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 외부 클릭으로 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
  const handleSelect = (id: number) => {
    const address = addresses.find((addr: UserAddress) => addr.id === id);
    if (address) {
      // Store의 selectAddress 호출
      selectAddress(address);

      // props로 전달된 onSelect가 있으면 호출 (useMainPageModule의 handleAddressChangeWithTransaction)
      if (onSelect) {
        onSelect(id);
      }
    } else {
      console.error('📍 AddressDropDown - 주소를 찾을 수 없음:', {
        id,
        addresses,
      });
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
          openModal({
            title: '오류',
            content: '주소 삭제 중 오류가 발생했습니다.',
            icon: 'error',
          });
        }
      },
    });
  };

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // 빈 상태 체크
  const isEmpty = !addresses || addresses.length === 0;

  // 로딩 상태 표시 - React Query 제거로 인해 항상 false
  const isLoading = false;
  const isAuthenticated = true; // 인증 상태는 상위 컴포넌트에서 관리

  // 로딩 상태 표시
  if (isLoading) {
    return <LoadingState title={title} className={className} />;
  }

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
          disabled={isEmpty}
        >
          <ExpandIcon expanded={isExpanded} />
        </button>
      </div>

      {/* 드롭다운 목록 */}
      <AddressDropDownList
        addresses={addresses}
        selectedAddress={selectedAddress}
        onDelete={handleDeleteWithConfirmation}
        onToggleFavorite={onToggleFavorite || toggleFavorite}
        onSelect={(id) => {
          // 상위 컴포넌트의 onSelect가 있으면 호출
          if (onSelect) {
            onSelect(id);
          } else {
            // 없으면 기본 handleSelect 호출
            handleSelect(id);
          }
          // 항상 드롭다운 닫기
          setIsExpanded(false);
        }}
        showFavoriteToggle={showFavoriteToggle}
        showDeleteButton={showDeleteButton}
        isExpanded={isExpanded}
        maxHeight={maxHeight}
        isClient={isClient}
      />
    </div>
  );
}
