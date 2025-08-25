'use client';

import React from 'react';
import { TransactionSearchComponent } from '@/(anon)/_components/common/transactionSearch/TransactionSearchComponent';

export default function TransactionSearchTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          TransactionSearchComponent 테스트
        </h1>
        
        <TransactionSearchComponent className="mb-8" />
        
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            테스트 설명
          </h2>
          <ul className="space-y-2 text-gray-600">
            <li>• 주소를 선택하면 실거래가 검색이 가능합니다</li>
            <li>• 건물 타입과 년도를 선택할 수 있습니다</li>
            <li>• <strong className="text-orange-600">단지명 검색이 필수입니다</strong> (아파트, 연립/다세대, 오피스텔)</li>
            <li>• 단지명 없이는 검색 버튼이 비활성화됩니다</li>
            <li>• 검색 결과는 카드 형태로 표시됩니다</li>
            <li>• 콘솔에서 데이터 확인이 가능합니다</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
