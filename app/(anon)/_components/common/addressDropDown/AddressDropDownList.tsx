'use client';

import React from 'react';
import { styles, getDropdownContainerStyle } from './AddressDropDown.styles';
import { AddressItem } from './types';
import { AddressDropDownItem } from './AddressDropDownItem';

interface AddressDropDownListProps {
  addresses: AddressItem[];
  selectedAddress?: AddressItem;
  onDelete?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  onSelect?: (id: string) => void;
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

  return (
    <div
      className={getDropdownContainerStyle(isExpanded)}
      style={{ maxHeight: isExpanded ? maxHeight : '0' }}
    >
      <div className={`${styles.dropdownList} ${styles.scrollbar}`}>
        {isEmpty ? (
          <div className={styles.emptyState}>표시할 주소가 없습니다.</div>
        ) : (
          addresses.map((address, index) => (
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
