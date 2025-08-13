'use client';

import React, { useState } from 'react';
import {
  AddressDropDown,
  AddressItem,
} from '@/(anon)/_components/common/addressDropDown';

export default function AddressDropdownTestPage() {
  const [addresses, setAddresses] = useState<AddressItem[]>([
    {
      id: '1',
      address:
        '경기도 고양시 왕산동구 왕시티 0로 000, B동 000호 (왕사동, 전세보감아파트)',
      isFavorite: true,
      isExpanded: true,
      isActive: false,
    },
    {
      id: '2',
      address:
        '경기도 고양시 왕산동구 왕시티 0로 000, B동 000호 (왕사동, 전세보감아파트)',
      isFavorite: true,
      isActive: true,
    },
    {
      id: '3',
      address:
        '서울특별시 감남구 감시티 0로 000, 100동 101호 (감남동, 전세보감아파트)',
      isFavorite: true,
      isActive: false,
    },
    {
      id: '4',
      address:
        '서울특별시 감남구 감시티 0로 000, 100동 101호 (감남동, 전세보감아파트)',
      isFavorite: false,
      isActive: false,
    },
    {
      id: '5',
      address:
        '서울특별시 감남구 감시티 0로 000, 100동 101호 (감남동, 전세보감아파트)',
      isFavorite: false,
      isActive: false,
    },
  ]);

  const [selectedAddressId, setSelectedAddressId] = useState<string>('1');

  const selectedAddress = addresses.find(
    (addr) => addr.id === selectedAddressId
  );

  const handleDelete = (id: string) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
    // 삭제된 주소가 선택된 주소였다면 첫 번째 주소로 변경
    if (id === selectedAddressId) {
      const remainingAddresses = addresses.filter((addr) => addr.id !== id);
      if (remainingAddresses.length > 0) {
        setSelectedAddressId(remainingAddresses[0].id);
      }
    }
  };

  const handleToggleFavorite = (id: string) => {
    setAddresses((prev) =>
      prev.map((addr) =>
        addr.id === id ? { ...addr, isFavorite: !addr.isFavorite } : addr
      )
    );
  };

  const handleSelect = (id: string) => {
    setSelectedAddressId(id);
  };

  return (
    <div className='min-h-screen bg-gray-100 p-8'>
      <div className='max-w-md mx-auto'>
        <h1 className='text-2xl font-bold mb-6 text-gray-800'>
          최근 열람 드롭다운 테스트
        </h1>

        <AddressDropDown
          addresses={addresses}
          selectedAddress={selectedAddress}
          onDelete={handleDelete}
          onToggleFavorite={handleToggleFavorite}
          onSelect={handleSelect}
        />

        <div className='mt-8 p-4 bg-white rounded-lg shadow'>
          <h2 className='text-lg font-semibold mb-2'>테스트 정보</h2>
          <p className='text-sm text-gray-600 mb-2'>
            현재 선택된 주소: {selectedAddress?.address || '없음'}
          </p>
          <p className='text-sm text-gray-600'>
            전체 주소 개수: {addresses.length}개
          </p>
        </div>
      </div>
    </div>
  );
}
