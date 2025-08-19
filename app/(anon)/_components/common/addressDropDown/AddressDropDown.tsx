'use client';

import React, { useState } from 'react';
import { Star, ChevronDown } from 'lucide-react';
import {
  styles,
  getExpandIconStyle,
  getExpandButtonStyle,
} from './AddressDropDown.styles';
import { AddressDropDownProps } from './types';
import { AddressDropDownList } from './AddressDropDownList';
import { formatAddress } from '@utils/addressUtils';
import { useUserAddresses } from '@libs/stores/userAddresses/useUserAddresses';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import { UserAddress } from '@/(anon)/main/_components/types/mainPage.types';
import { LoadingState } from './_components/LoadingState';
import { AuthRequiredState } from './_components/AuthRequiredState';

const DEFAULT_PROPS = {
  title: '최근 열람',
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

  // React Query로 초기 데이터 로드
  const { isLoading, isAuthenticated } = useUserAddresses();

  // Store에서 데이터 가져오기
  const {
    userAddresses,
    selectedAddress: storeSelectedAddress,
    selectAddress,
    deleteAddress,
    toggleFavorite,
  } = useUserAddressStore();

  // props로 전달된 주소가 있으면 그것을 우선 사용, 없으면 Store 데이터 사용
  const addresses =
    propAddresses && propAddresses.length > 0 ? propAddresses : userAddresses;
  const selectedAddress = propSelectedAddress || storeSelectedAddress;

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

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // 빈 상태 체크
  const isEmpty = !addresses || addresses.length === 0;

  // 로딩 상태 표시
  if (isLoading) {
    return <LoadingState title={title} className={className} />;
  }

  // 인증되지 않은 상태 표시
  if (!isAuthenticated) {
    return <AuthRequiredState title={title} className={className} />;
  }

  return (
    <div className={`${styles.container} ${className}`}>
      {/* 헤더 */}
      <div className={styles.header} onClick={handleToggleExpand}>
        <div className={styles.headerContent}>
          <span className={styles.headerTitle}>{title}</span>
          {selectedAddress ? (
            <div className={styles.selectedAddress}>
              {showFavoriteToggle && (
                <StarIcon filled={selectedAddress.isPrimary || false} />
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
        onDelete={onDelete || deleteAddress}
        onToggleFavorite={onToggleFavorite || toggleFavorite}
        onSelect={onSelect || handleSelect}
        showFavoriteToggle={showFavoriteToggle}
        showDeleteButton={showDeleteButton}
        isExpanded={isExpanded}
        maxHeight={maxHeight}
      />
    </div>
  );
}
