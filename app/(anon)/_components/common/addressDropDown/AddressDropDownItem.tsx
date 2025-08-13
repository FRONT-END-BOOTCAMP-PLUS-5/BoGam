'use client';

import React from 'react';
import { Star } from 'lucide-react';
import {
  styles,
  getListItemStyle,
  getAddressTextStyle,
} from './AddressDropDown.styles';
import { AddressItem } from './types';
import { formatAddress } from '@utils/addressUtils';

interface AddressDropDownItemProps {
  address: AddressItem;
  isSelected?: boolean;
  onDelete?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  onSelect?: (id: string) => void;
  showFavoriteToggle?: boolean;
  showDeleteButton?: boolean;
  animationDelay?: number;
}

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

export function AddressDropDownItem({
  address,
  isSelected = false,
  onDelete,
  onToggleFavorite,
  onSelect,
  showFavoriteToggle = true,
  showDeleteButton = true,
  animationDelay = 0,
}: AddressDropDownItemProps) {
  // 안전한 핸들러들
  const handleDelete = () => {
    onDelete?.(address.id);
  };

  const handleToggleFavorite = () => {
    onToggleFavorite?.(address.id);
  };

  const handleSelect = () => {
    onSelect?.(address.id);
  };

  const { firstPart, secondPart } = formatAddress(address.address);

  return (
    <div
      className={getListItemStyle(isSelected, false)}
      style={{
        animationDelay: `${animationDelay}ms`,
      }}
    >
      <div
        className={styles.addressContent}
        onClick={handleSelect}
        role='button'
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleSelect();
          }
        }}
      >
        {showFavoriteToggle && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleFavorite();
            }}
            className={styles.starButton}
            aria-label={address.isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
          >
            <StarIcon filled={address.isFavorite} />
          </button>
        )}
        <div className={styles.addressTextContainer}>
          <div
            className={`${styles.addressFirstLine} ${getAddressTextStyle(
              isSelected
            )}`}
          >
            {firstPart}
          </div>
          {secondPart && (
            <div
              className={`${styles.addressSecondLine} ${getAddressTextStyle(
                isSelected
              )}`}
            >
              {secondPart}
            </div>
          )}
        </div>
      </div>
      {showDeleteButton && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
          className={styles.deleteButton}
          aria-label={`${address.address} 삭제`}
        >
          삭제하기
        </button>
      )}
    </div>
  );
}
