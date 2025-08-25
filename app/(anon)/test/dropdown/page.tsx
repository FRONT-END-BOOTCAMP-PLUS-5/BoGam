'use client';

import React, { useState } from 'react';
import { DropDown } from '@/(anon)/_components/common/dropdown/DropDown';

// 기본 옵션들
const basicOptions = [
  { value: 'option1', label: '옵션 1' },
  { value: 'option2', label: '옵션 2' },
  { value: 'option3', label: '옵션 3' },
  { value: 'option4', label: '옵션 4' },
  { value: 'option5', label: '옵션 5' },
];

// 색상 옵션들
const colorOptions = [
  { value: 'red', label: '빨간색' },
  { value: 'blue', label: '파란색' },
  { value: 'green', label: '초록색' },
  { value: 'yellow', label: '노란색' },
  { value: 'purple', label: '보라색' },
];

// 과일 옵션들
const fruitOptions = [
  { value: 'apple', label: '사과' },
  { value: 'banana', label: '바나나' },
  { value: 'orange', label: '오렌지' },
  { value: 'grape', label: '포도' },
  { value: 'strawberry', label: '딸기' },
];

export default function DropDownTestPage() {
  const [basicValue, setBasicValue] = useState<string>();
  const [colorValue, setColorValue] = useState<string>();
  const [fruitValue, setFruitValue] = useState<string>();

  return (
    <div className="min-h-screen bg-brand-light-gray py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-brand-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-brand-black mb-8 text-center">DropDown 컴포넌트 테스트</h1>
          
          <div className="space-y-12">
            {/* 기본 드롭다운 */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-brand-black border-b pb-2 border-brand-light-gray">기본 드롭다운</h2>
              <DropDown
                id="basic-dropdown"
                options={basicOptions}
                value={basicValue}
                onChange={setBasicValue}
                placeholder="옵션을 선택하세요"
                label="기본 선택"
                required={true}
                hint="필수 입력 항목입니다"
              />
              <div className="bg-brand-light-gray p-3 rounded-md">
                <p className="text-sm text-brand-dark-gray">
                  <strong>선택된 값:</strong> {basicValue || '없음'}
                </p>
              </div>
            </div>

            {/* 색상 선택 드롭다운 */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-brand-black border-b pb-2 border-brand-light-gray">색상 선택</h2>
              <DropDown
                id="color-dropdown"
                options={colorOptions}
                value={colorValue}
                onChange={setColorValue}
                placeholder="색상을 선택하세요"
                label="색상"
                hint="원하는 색상을 선택해주세요"
              />
              <div className="bg-brand-light-gray p-3 rounded-md">
                <p className="text-sm text-brand-dark-gray">
                  <strong>선택된 값:</strong> {colorValue || '없음'}
                </p>
              </div>
            </div>

            {/* 과일 선택 드롭다운 */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-brand-black border-b pb-2 border-brand-light-gray">과일 선택</h2>
              <DropDown
                id="fruit-dropdown"
                options={fruitOptions}
                value={fruitValue}
                onChange={setFruitValue}
                placeholder="과일을 선택하세요"
                label="과일"
                error="과일을 선택해주세요"
              />
              <div className="bg-brand-light-gray p-3 rounded-md">
                <p className="text-sm text-brand-dark-gray">
                  <strong>선택된 값:</strong> {fruitValue || '없음'}
                </p>
              </div>
            </div>

            {/* 비활성화 상태 */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-brand-black border-b pb-2 border-brand-light-gray">비활성화 상태</h2>
              <DropDown
                id="disabled-dropdown"
                options={basicOptions}
                placeholder="비활성화된 드롭다운"
                label="비활성화"
                disabled={true}
                hint="현재 사용할 수 없습니다"
              />
            </div>

            {/* 라벨이 없는 드롭다운 */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-brand-black border-b pb-2 border-brand-light-gray">라벨이 없는 드롭다운</h2>
              <DropDown
                id="no-label-dropdown"
                options={basicOptions}
                placeholder="라벨 없음"
              />
            </div>

            {/* 커스텀 클래스명 */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-brand-black border-b pb-2 border-brand-light-gray">커스텀 클래스명</h2>
              <DropDown
                id="custom-dropdown"
                options={basicOptions}
                placeholder="커스텀 스타일"
                className="max-w-md"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
