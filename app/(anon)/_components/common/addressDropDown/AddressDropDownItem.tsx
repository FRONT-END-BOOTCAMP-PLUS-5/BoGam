'use client';

import React from 'react';
import {
  styles,
  getListItemStyle,
  getAddressTextStyle,
} from './AddressDropDown.styles';
import { UserAddress } from '@/(anon)/main/_components/types/mainPage.types';
import { formatAddress } from '@utils/addressUtils';
import { StarIcon } from './AddressDropDown';

interface AddressDropDownItemProps {
  address: UserAddress;
  isSelected?: boolean;
  onDelete?: (id: number) => void;
  onToggleFavorite?: (id: number) => void;
  onSelect?: (id: number) => void;
  showFavoriteToggle?: boolean;
  showDeleteButton?: boolean;
  animationDelay?: number;
}

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

  const { firstPart, secondPart } = formatAddress(address.completeAddress);

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
            aria-label={address.isPrimary ? '즐겨찾기 해제' : '즐겨찾기 추가'}
          >
            <StarIcon filled={address.isPrimary || false} />
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
          aria-label={`${address.completeAddress} 삭제`}
        >
          삭제하기
        </button>
      )}
    </div>
  );
}
