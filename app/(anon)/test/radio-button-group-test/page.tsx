'use client';

import { useState } from 'react';
import RadioButtonGroup from '@/(anon)/_components/common/radioButtonGroup/RadioButtonGroup';

const RadioButtonGroupTest = () => {
  const [selectedValue1, setSelectedValue1] = useState('');
  const [selectedValue2, setSelectedValue2] = useState('');

  const options1 = [
    { value: 'no', label: '아니오' },
    { value: 'yes', label: '예' }
  ];

  const options2 = [
    { value: 'option1', label: '옵션 1' },
    { value: 'option2', label: '옵션 2' },
    { value: 'option3', label: '옵션 3' },
    { value: 'option4', label: '옵션 4' }
  ];

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-6 text-brand-dark-gray">
        라디오 버튼 그룹 테스트
      </h1>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-brand-dark-gray">
          기본 라디오 버튼 그룹 (예/아니오)
        </h3>
        <RadioButtonGroup
          name="example1"
          options={options1}
          onChange={setSelectedValue1}
        />
        <p className="mt-2 text-sm text-brand-dark-gray">
          선택된 값: {selectedValue1 || '없음'}
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-brand-dark-gray">
          여러 옵션 라디오 버튼 그룹
        </h3>
        <RadioButtonGroup
          name="example2"
          options={options2}
          onChange={setSelectedValue2}
        />
        <p className="mt-2 text-sm text-brand-dark-gray">
          선택된 값: {selectedValue2 || '없음'}
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-brand-dark-gray">
          라벨 없이 표시
        </h3>
        <RadioButtonGroup
          name="example4"
          options={options1}
          showYesNoLabels={false}
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-brand-dark-gray">
          여러 행의 독립적인 라디오 버튼 그룹 (2개씩 같은 그룹)
        </h3>
        <div className="space-y-4">
          {/* 첫 번째 행 - 첫 번째 그룹 */}
          <RadioButtonGroup
            name="group1"
            options={[
              { value: 'yes1', label: '예' },
              { value: 'no1', label: '아니오' }
            ]}
            showYesNoLabels={false}
          />
          
          {/* 두 번째 행 - 두 번째 그룹 */}
          <RadioButtonGroup
            name="group2"
            options={[
              { value: 'yes2', label: '예' },
              { value: 'no2', label: '아니오' }
            ]}
            showYesNoLabels={false}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-brand-dark-gray">
          비활성화된 라디오 버튼 그룹
        </h3>
        <RadioButtonGroup
          name="example3"
          options={options1}
          disabled={true}
          defaultValue="yes"
        />
      </div>
    </div>
  );
};

export default RadioButtonGroupTest;
