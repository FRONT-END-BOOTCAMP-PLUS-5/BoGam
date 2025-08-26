'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  GetJeonseGuaranteeRequestDto,
  GetJeonseGuaranteeResponseDto,
} from '@libs/api_front/jeonseGuarantee.api';
import { useGetJeonseGuarantee } from '@/hooks/useJeonseGuarantee';
import { FIELD_ERROR_MESSAGES } from '@utils/constants/jeonseGuarantee';
import { TabNavigation } from '@/(anon)/_components/common/broker/tabNavigation/TabNavigation';
import JeonseGuaranteeInput from './JeonseGuaranteeInput';
import JeonseGuaranteeOutput from './JeonseGuaranteeOutput';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';

// 5-3 단계 전체 JSON 상태 타입
interface Step5Detail3JsonData {
  jeonseGuarantee?: {
    items: unknown[];
    totalCount: number;
    header: unknown;
    timestamp: string;
    userAddressNickname: string;
  };
  // 보증 금액 데이터 (API 응답의 변수명을 그대로 사용)
  grntLmtAmt?: string; // 보증한도금액
  loanLmtAmt?: string; // 대출한도금액
  grntDvcd?: string; // 보증구분코드
  rcmdProrRnk?: number; // 추천순위
  [key: string]: unknown;
}

interface JeonseGuaranteeFormProps {
  stepJsonData: Step5Detail3JsonData;
  updateStepJsonData: (key: string, data: unknown) => void;
  isSavingStepResult: boolean;
}

// 초기 상태 상수
const INITIAL_FORM_DATA: GetJeonseGuaranteeRequestDto = {
  rentGrntAmt: 0,
  trgtLwdgCd: '',
  age: 0,
  weddStcd: '',
  myIncmAmt: 0,
  myTotDebtAmt: 0,
  ownHsCnt: 0,
  mmrtAmt: 0,
  numOfRows: 10,
  pageNo: 1,
};

type TabType = 'input' | 'output';

const INITIAL_INPUT_MODES = {
  myIncmAmt: 'none' as 'none' | 'direct',
  myTotDebtAmt: 'none' as 'none' | 'direct',
  mmrtAmt: 'none' as 'none' | 'direct',
};

export default function JeonseGuaranteeContainer({
  stepJsonData,
  updateStepJsonData,
  isSavingStepResult,
}: JeonseGuaranteeFormProps) {
  // 상태 관리
  const [formData, setFormData] =
    useState<GetJeonseGuaranteeRequestDto>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<
    Record<keyof GetJeonseGuaranteeRequestDto, string | undefined>
  >({} as Record<keyof GetJeonseGuaranteeRequestDto, string | undefined>);
  const [inputModes, setInputModes] = useState(INITIAL_INPUT_MODES);
  const [activeTab, setActiveTab] = useState<TabType>('input');

  const { selectedAddress } = useUserAddressStore();

  // API 훅
  const {
    mutate: getJeonseGuarantee,
    isPending,
    data,
    error,
  } = useGetJeonseGuarantee();

  // 보증 금액 데이터 로컬 상태
  const [guaranteeData, setGuaranteeData] = useState<{
    grntLmtAmt?: string;
    loanLmtAmt?: string;
    grntDvcd?: string;
    rcmdProrRnk?: number;
  }>({});

  // 데이터 응답 시 자동으로 결과 탭으로 이동 및 로컬 상태 업데이트
  useEffect(() => {
    if (data?.items && data.items.length > 0) {
      setActiveTab('output');

      const firstItem = data.items[0];

      // 보증 금액 데이터를 로컬 상태에 저장
      if (firstItem) {
        setGuaranteeData({
          grntLmtAmt: firstItem.grntLmtAmt,
          loanLmtAmt: firstItem.loanLmtAmt,
          grntDvcd: firstItem.grntDvcd,
          rcmdProrRnk: firstItem.rcmdProrRnk,
        });
      }
    }
  }, [data]);

  // 폼 검증 함수
  const validateForm = useCallback((): boolean => {
    const newErrors: Record<
      keyof GetJeonseGuaranteeRequestDto,
      string | undefined
    > = {} as Record<keyof GetJeonseGuaranteeRequestDto, string | undefined>;

    // 필수 필드 검증
    if (!formData.rentGrntAmt || formData.rentGrntAmt <= 0) {
      newErrors.rentGrntAmt = FIELD_ERROR_MESSAGES.rentGrntAmt;
    }

    if (!formData.trgtLwdgCd) {
      newErrors.trgtLwdgCd = FIELD_ERROR_MESSAGES.trgtLwdgCd;
    }

    if (!formData.age || formData.age <= 0) {
      newErrors.age = FIELD_ERROR_MESSAGES.age;
    }

    if (!formData.weddStcd) {
      newErrors.weddStcd = FIELD_ERROR_MESSAGES.weddStcd;
    }

    if (formData.ownHsCnt === undefined || formData.ownHsCnt < 0) {
      newErrors.ownHsCnt = FIELD_ERROR_MESSAGES.ownHsCnt;
    }

    // 조건부 필수 필드 검증 (직접 입력 모드일 때만)
    const conditionalFields = [
      { field: 'myIncmAmt', mode: inputModes.myIncmAmt },
      { field: 'myTotDebtAmt', mode: inputModes.myTotDebtAmt },
      { field: 'mmrtAmt', mode: inputModes.mmrtAmt },
    ] as const;

    conditionalFields.forEach(({ field, mode }) => {
      if (mode === 'direct' && (!formData[field] || formData[field] <= 0)) {
        newErrors[field] = FIELD_ERROR_MESSAGES[field];
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, inputModes]);

  // 입력 변경 핸들러
  const handleInputChange = useCallback(
    (field: keyof GetJeonseGuaranteeRequestDto, value: string | number) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      // 에러 초기화
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: undefined,
        }));
      }
    },
    [errors]
  );

  // 입력 모드 변경 핸들러
  const handleInputModeChange = useCallback(
    (field: keyof typeof inputModes, mode: 'none' | 'direct') => {
      setInputModes((prev) => ({
        ...prev,
        [field]: mode,
      }));

      // 모드가 'none'이면 해당 필드를 0으로 설정
      if (mode === 'none') {
        setFormData((prev) => ({
          ...prev,
          [field]: 0,
        }));
      }

      // 에러 초기화
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: undefined,
        }));
      }
    },
    [errors]
  );

  // 폼 제출 핸들러
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (validateForm()) {
        getJeonseGuarantee(formData);
      }
    },
    [formData, getJeonseGuarantee, validateForm]
  );

  // 탭 변경 핸들러
  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab);
  }, []);

  return (
    <div className='bg-white rounded-lg shadow-sm'>
      {/* 탭 네비게이션 */}
      <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />

      {/* 탭 컨텐츠 */}
      <div className='border-t'>
        {activeTab === 'input' ? (
          <JeonseGuaranteeInput
            formData={formData}
            errors={errors}
            inputModes={inputModes}
            isPending={isPending}
            error={error?.message || null}
            onInputChange={handleInputChange}
            onInputModeChange={handleInputModeChange}
            onSubmit={handleSubmit}
          />
        ) : (
          <JeonseGuaranteeOutput
            data={
              data ||
              (guaranteeData.grntLmtAmt
                ? ({
                    items: [
                      {
                        grntLmtAmt: guaranteeData.grntLmtAmt,
                        loanLmtAmt: guaranteeData.loanLmtAmt || '',
                        grntDvcd: guaranteeData.grntDvcd || '',
                        rcmdProrRnk: guaranteeData.rcmdProrRnk || 0,
                      },
                    ],
                    totalCount: 1,
                    numOfRows: 10,
                    pageNo: 1,
                    header: { resultCode: '00', resultMsg: '저장된 데이터' },
                  } as GetJeonseGuaranteeResponseDto)
                : undefined)
            }
            isPending={isPending || isSavingStepResult}
          />
        )}
      </div>
    </div>
  );
}
