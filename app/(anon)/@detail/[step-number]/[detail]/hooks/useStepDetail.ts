import { useState, useEffect } from 'react';
import { getStepDetail, StepDetailData } from '@libs/constants/stepDetails';

export const useStepDetail = (
  stepNumber: string,
  detail: string,
  isOpen: boolean
) => {
  const [stepData, setStepData] = useState<StepDetailData | null>(null);

  useEffect(() => {
    if (isOpen) {
      const data = getStepDetail(stepNumber, detail);
      if (data) {
        setStepData(data);
      } else {
        // 데이터가 없을 경우 기본 데이터 사용
        setStepData({
          detailTitle: `${stepNumber}-${detail}단계 상세 보기`,
          isSafe: true,
          expandableTitle: '상세 정보 확인하기',
          details: [{ key: '정보', value: '데이터를 찾을 수 없습니다.' }],
        });
      }
    }
  }, [stepNumber, detail, isOpen]);

  return { stepData };
};
