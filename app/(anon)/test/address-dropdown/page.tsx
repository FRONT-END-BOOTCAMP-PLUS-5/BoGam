'use client';

import { AddressDropDown } from '@/(anon)/_components/common/addressDropDown/AddressDropDown';
import { UserAddress } from '@/(anon)/main/_components/types/mainPage.types';
import React, { useState } from 'react';

export default function AddressDropdownTestPage() {
  const [addresses, setAddresses] = useState<UserAddress[]>([
    {
      id: 1,
      nickname: '왕시티 아파트',
      x: 126.978,
      y: 37.5665,
      isPrimary: true,
      legalDistrictCode: '41285',
      lotAddress: '경기도 고양시 왕산동구 왕사동 123-45',
      roadAddress: '경기도 고양시 왕산동구 왕시티 0로 000',
      completeAddress:
        '경기도 고양시 왕산동구 왕시티 0로 000, B동 000호 (왕사동, 전세보감아파트)',
    },
    {
      id: 2,
      nickname: '왕시티 아파트 2',
      x: 126.979,
      y: 37.5666,
      isPrimary: false,
      legalDistrictCode: '41285',
      lotAddress: '경기도 고양시 왕산동구 왕사동 123-46',
      roadAddress: '경기도 고양시 왕산동구 왕시티 0로 001',
      completeAddress:
        '경기도 고양시 왕산동구 왕시티 0로 001, B동 001호 (왕사동, 전세보감아파트)',
    },
    {
      id: 3,
      nickname: '감남 아파트',
      x: 127.028,
      y: 37.498,
      isPrimary: false,
      legalDistrictCode: '11680',
      lotAddress: '서울특별시 강남구 역삼동 123-45',
      roadAddress: '서울특별시 강남구 테헤란로 123',
      completeAddress:
        '서울특별시 강남구 테헤란로 123, 100동 101호 (역삼동, 전세보감아파트)',
    },
    {
      id: 4,
      nickname: '감남 아파트 2',
      x: 127.029,
      y: 37.499,
      isPrimary: false,
      legalDistrictCode: '11680',
      lotAddress: '서울특별시 강남구 역삼동 123-46',
      roadAddress: '서울특별시 강남구 테헤란로 124',
      completeAddress:
        '서울특별시 강남구 테헤란로 124, 100동 102호 (역삼동, 전세보감아파트)',
    },
    {
      id: 5,
      nickname: '감남 아파트 3',
      x: 127.03,
      y: 37.5,
      isPrimary: false,
      legalDistrictCode: '11680',
      lotAddress: '서울특별시 강남구 역삼동 123-47',
      roadAddress: '서울특별시 강남구 테헤란로 125',
      completeAddress:
        '서울특별시 강남구 테헤란로 125, 100동 103호 (역삼동, 전세보감아파트)',
    },
  ]);

  const [selectedAddressId, setSelectedAddressId] = useState<number>(1);

  const selectedAddress = addresses.find(
    (addr) => addr.id === selectedAddressId
  );

  const handleDelete = (id: number) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
    // 삭제된 주소가 선택된 주소였다면 첫 번째 주소로 변경
    if (id === selectedAddressId) {
      const remainingAddresses = addresses.filter((addr) => addr.id !== id);
      if (remainingAddresses.length > 0) {
        setSelectedAddressId(remainingAddresses[0].id);
      }
    }
  };

  const handleToggleFavorite = (id: number) => {
    setAddresses((prev) =>
      prev.map((addr) =>
        addr.id === id ? { ...addr, isPrimary: !addr.isPrimary } : addr
      )
    );
  };

  const handleSelect = (id: number) => {
    setSelectedAddressId(id);
  };

  return (
    <div className='min-h-screen bg-gray-100 p-8'>
      <div className='max-w-md mx-auto'>
        <h1 className='text-2xl font-bold mb-6 text-gray-800'>
          현재 열람 드롭다운 테스트
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
            현재 선택된 주소: {selectedAddress?.completeAddress || '없음'}
          </p>
          <p className='text-sm text-gray-600'>
            전체 주소 개수: {addresses.length}개
          </p>
        </div>
      </div>
    </div>
  );
}
