'use client';

import React, { useState } from 'react';
import {
  styles,
  getListItemStyle,
  getAddressTextStyle,
} from './AddressDropDownItem.styles';
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
  const [isLoading, setIsLoading] = useState(false);

  // 안전한 핸들러들
  const handleDelete = () => {
    onDelete?.(address.id);
  };

  const handleToggleFavorite = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      // Store의 toggleFavorite 함수 호출 (API 호출과 UI 업데이트를 모두 처리)
      await onToggleFavorite?.(address.id);
    } catch (error) {
      console.error('즐겨찾기 토글 오류:', error);
      alert('즐겨찾기 토글 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
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
            disabled={isLoading}
            aria-label={address.isPrimary ? '즐겨찾기 해제' : '즐겨찾기 추가'}
          >
            {isLoading ? (
              <div className='animate-spin w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full' />
            ) : (
              <StarIcon filled={address.isPrimary || false} />
            )}
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
