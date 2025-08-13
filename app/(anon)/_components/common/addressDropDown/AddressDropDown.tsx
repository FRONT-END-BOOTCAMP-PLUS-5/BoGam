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

const DEFAULT_PROPS = {
  title: '최근 열람',
  showFavoriteToggle: true,
  showDeleteButton: true,
  maxHeight: '300px',
  placeholder: '선택된 주소가 없습니다.',
};

// 별 아이콘 컴포넌트
const StarIcon = ({ filled }: { filled: boolean }) => (
  <Star
    size={18}
    fill={filled ? '#FFC107' : 'none'}
    stroke={filled ? '#FFC107' : '#9CA3AF'}
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
    addresses,
    selectedAddress,
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

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // 빈 상태 체크
  const isEmpty = !addresses || addresses.length === 0;

  return (
    <div className={`${styles.container} ${className}`}>
      {/* 헤더 */}
      <div className={styles.header} onClick={handleToggleExpand}>
        <div className={styles.headerContent}>
          <span className={styles.headerTitle}>{title}</span>
          {selectedAddress ? (
            <div className={styles.selectedAddress}>
              {showFavoriteToggle && (
                <StarIcon filled={selectedAddress.isFavorite} />
              )}
              <div className={styles.selectedAddressText}>
                {(() => {
                  const { firstPart, secondPart } = formatAddress(
                    selectedAddress.address
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
        onDelete={onDelete}
        onToggleFavorite={onToggleFavorite}
        onSelect={onSelect}
        showFavoriteToggle={showFavoriteToggle}
        showDeleteButton={showDeleteButton}
        isExpanded={isExpanded}
        maxHeight={maxHeight}
      />
    </div>
  );
}
