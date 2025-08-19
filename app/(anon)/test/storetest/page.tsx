'use client';

import React from 'react';
import { useUserStore } from '@libs/stores/userStore';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';

export default function StoreTestPage() {
  const nickname = useUserStore((state) => state.nickname);
  const selectedAddress = useUserAddressStore((state) => state.selectedAddress);
  const userAddresses = useUserAddressStore((state) => state.userAddresses);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Store 테스트 페이지</h1>
        
        {/* 유저 정보 섹션 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">유저 정보</h2>
          <div className="space-y-3">
            <div className="flex items-center">
              <span className="font-medium text-gray-700 w-24">닉네임:</span>
              <span className="text-gray-900">{nickname || '설정되지 않음'}</span>
            </div>
          </div>
        </div>

        {/* 선택된 주소 섹션 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">선택된 주소</h2>
          {selectedAddress ? (
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="font-medium text-gray-700 w-24">주소:</span>
                <span className="text-gray-900">{selectedAddress.completeAddress}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium text-gray-700 w-24">지번 주소:</span>
                <span className="text-gray-900">{selectedAddress.lotAddress}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium text-gray-700 w-24">도로명 주소:</span>
                <span className="text-gray-900">{selectedAddress.roadAddress}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium text-gray-700 w-24">주소 별칭:</span>
                <span className="text-gray-900">{selectedAddress.nickname}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium text-gray-700 w-24">대표 주소:</span>
                <span className="text-gray-900">{selectedAddress.isPrimary ? '예' : '아니오'}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium text-gray-700 w-24">동:</span>
                <span className="text-gray-900">{selectedAddress.dong || '없음'}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium text-gray-700 w-24">호:</span>
                <span className="text-gray-900">{selectedAddress.ho || '없음'}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium text-gray-700 w-24">좌표:</span>
                <span className="text-gray-900">X: {selectedAddress.x}, Y: {selectedAddress.y}</span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">선택된 주소가 없습니다.</p>
          )}
        </div>

        {/* 전체 주소 목록 섹션 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">전체 주소 목록</h2>
          {userAddresses && userAddresses.length > 0 ? (
            <div className="space-y-4">
              {userAddresses.map((address: any, index: number) => (
                <div key={address.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-800">
                      {address.nickname} {address.isPrimary && <span className="text-blue-600 text-sm">(대표)</span>}
                    </span>
                    <span className="text-sm text-gray-500">#{index + 1}</span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>완전 주소: {address.completeAddress}</div>
                    <div>지번 주소: {address.lotAddress}</div>
                    <div>도로명 주소: {address.roadAddress}</div>
                    <div>동: {address.dong || '없음'}</div>
                    <div>호: {address.ho || '없음'}</div>
                    <div>좌표: X: {address.x}, Y: {address.y}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">등록된 주소가 없습니다.</p>
          )}
        </div>

        {/* Store 상태 디버그 정보 */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Store 상태 디버그</h3>
          <pre className="text-sm text-gray-600 overflow-auto">
            {JSON.stringify(
              {
                userStore: { nickname },
                userAddressStore: { 
                  selectedAddress: selectedAddress ? {
                    id: selectedAddress.id,
                    nickname: selectedAddress.nickname,
                    completeAddress: selectedAddress.completeAddress,
                    isPrimary: selectedAddress.isPrimary,
                    x: selectedAddress.x,
                    y: selectedAddress.y
                  } : null,
                  addressesCount: userAddresses?.length || 0
                }
              },
              null,
              2
            )}
          </pre>
        </div>
      </div>
    </div>
  );
}
