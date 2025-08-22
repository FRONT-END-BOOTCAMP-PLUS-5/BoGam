'use client';

import React from 'react';
import { AddressListItem } from './types';

interface RealEstateTwoWayContentProps {
  resAddrList: AddressListItem[];
  selectedAddress: AddressListItem | null;
  onAddressSelect: (address: AddressListItem) => void;
}

export const RealEstateTwoWayContent: React.FC<
  RealEstateTwoWayContentProps
> = ({ resAddrList, selectedAddress, onAddressSelect }) => {
  return (
    <div className='space-y-4'>
      <p className='text-gray-600 text-sm'>
        아래 부동산 목록에서 조회하고자 하는 부동산을 클릭하세요. 클릭하면 즉시
        2-way 인증 요청이 시작됩니다.
      </p>

      {/* 부동산 목록 */}
      <div className='space-y-3 max-h-60 overflow-y-auto'>
        {resAddrList.map((addr, index) => (
          <div
            key={index}
            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
              selectedAddress?.commUniqueNo === addr.commUniqueNo
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onAddressSelect(addr)}
          >
            <div className='flex-1'>
              <div className='font-medium text-gray-800 mb-1'>
                📍 {addr.commAddrLotNumber}
              </div>
              <div className='text-sm text-gray-600 mb-1'>
                🔑 {addr.commUniqueNo}
              </div>
              {addr.resUserNm && (
                <div className='text-sm text-gray-600'>👤 {addr.resUserNm}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
