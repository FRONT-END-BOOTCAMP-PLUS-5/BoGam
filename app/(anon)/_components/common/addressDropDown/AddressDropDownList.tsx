'use client';

import React from 'react';
import {
  styles,
  getDropdownContainerStyle,
} from './AddressDropDownList.styles';
import { UserAddress } from '@/(anon)/main/_components/types/mainPage.types';
import { AddressDropDownItem } from './AddressDropDownItem';

interface AddressDropDownListProps {
  addresses: UserAddress[];
  selectedAddress?: UserAddress | null;
  onDelete?: (id: number) => void;
  onToggleFavorite?: (id: number) => void;
  onSelect?: (id: number) => void;
  showFavoriteToggle?: boolean;
  showDeleteButton?: boolean;
  isExpanded: boolean;
  maxHeight?: string;
}

export function AddressDropDownList({
  addresses,
  selectedAddress,
  onDelete,
  onToggleFavorite,
  onSelect,
  showFavoriteToggle = true,
  showDeleteButton = true,
  isExpanded,
  maxHeight = '300px',
}: AddressDropDownListProps) {
  // 빈 상태 체크
  const isEmpty = !addresses || addresses.length === 0;

  // 휘발성 주소를 최상단에 정렬
  const sortedAddresses = [
    ...addresses.filter((addr) => addr.isVolatile), // 휘발성 주소 최상단
    ...addresses.filter((addr) => !addr.isVolatile), // 일반 주소
  ];

  return (
    <div
      className={getDropdownContainerStyle(isExpanded)}
      style={{ maxHeight: isExpanded ? maxHeight : '0' }}
    >
      <div className={`${styles.dropdownList} ${styles.scrollbar}`}>
        {isEmpty ? (
          <div className={styles.emptyState}>표시할 주소가 없습니다.</div>
        ) : (
          sortedAddresses.map((address, index) => (
            <AddressDropDownItem
              key={address.id}
              address={address}
              isSelected={address.id === selectedAddress?.id}
              onDelete={onDelete}
              onToggleFavorite={onToggleFavorite}
              onSelect={onSelect}
              showFavoriteToggle={showFavoriteToggle}
              showDeleteButton={showDeleteButton}
              animationDelay={index * 50}
            />
          ))
        )}
      </div>
    </div>
  );
}
