'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  GetGuaranteeLimitRequestDto,
} from '@libs/api_front/guaranteeLimit.api';
import { useGetGuaranteeLimit, useCheckGuaranteeLimitCopyExists } from '@/hooks/useGuaranteeLimit';
import { FIELD_ERROR_MESSAGES } from '@libs/constants/guaranteeLimit';
import GuaranteeLimitInput from './GuaranteeLimitInput';
import GuaranteeLimitOutput from './GuaranteeLimitOutput';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import { useModalStore } from '@libs/stores/modalStore';
import { DataContainer } from '@/(anon)/@detail/steps/[step-number]/[detail]/_components/contents/container/DataContainer';


// 초기 상태 상수
const INITIAL_FORM_DATA: GetGuaranteeLimitRequestDto = {
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

export default function GuaranteeLimitContainer() {
  // 상태 관리
  const [formData, setFormData] =
    useState<GetGuaranteeLimitRequestDto>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<
    Record<keyof GetGuaranteeLimitRequestDto, string | undefined>
  >({} as Record<keyof GetGuaranteeLimitRequestDto, string | undefined>);

  const { selectedAddress } = useUserAddressStore();
  const { openModal } = useModalStore();

  // API 훅
  const {
    mutate: getGuaranteeLimit,
  } = useGetGuaranteeLimit();

  // 존재 여부 확인 쿼리
  const {
    data: existsQuery,
    isLoading,
    refetch,
  } = useCheckGuaranteeLimitCopyExists(selectedAddress?.nickname || null);

  // 존재 여부 쿼리 객체 생성
  const checkExistsQuery = {
    data: existsQuery?.success
      ? {
          success: true,
          exists: (existsQuery.exists as  boolean) || false,
        }
      : undefined,
    isLoading: isLoading,
    refetch: refetch,
  };

  // selectedAddress 변경 시 formData에 userAddressNickname 추가
  useEffect(() => {
    if (selectedAddress?.nickname) {
      setFormData((prev) => ({
        ...prev,
        userAddressNickname: selectedAddress.nickname,
      }));
    }
  }, [selectedAddress]);

  // API 호출 성공 시 콜백 (DataContainer에서 처리)
  const handleApiSuccess = useCallback(() => {
    // 성공 시 아무것도 하지 않음 (DataContainer에서 자동으로 결과 탭으로 이동)
  }, []);

  // API 호출 실패 시 에러 모달 표시
  const handleApiError = useCallback((message: string) => {
    openModal({
      title: '오류',
      content: message,
      icon: 'error',
      confirmText: '확인',
      onConfirm: async () => {
        // 확인 버튼 클릭 시 아무것도 하지 않음 (모달만 닫힘)
      },
    });
  }, [openModal]);

  // 폼 검증 함수
  const validateForm = useCallback((): boolean => {
    const newErrors: Record<
      keyof GetGuaranteeLimitRequestDto,
      string | undefined
    > = {} as Record<keyof GetGuaranteeLimitRequestDto, string | undefined>;

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

    // 소득금액은 필수 필드로 검증
    if (!formData.myIncmAmt || formData.myIncmAmt <= 0) {
      newErrors.myIncmAmt = FIELD_ERROR_MESSAGES.myIncmAmt;
    }

    // 총부채금액과 월세금액은 0원도 가능하므로 검증하지 않음

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // 입력 변경 핸들러
  const handleInputChange = useCallback(
    (field: keyof GetGuaranteeLimitRequestDto, value: string | number) => {
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


  // 폼 제출 핸들러
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (validateForm()) {
        // 총부채금액과 월세금액이 빈 값이면 0으로 처리
        const submitData = {
          ...formData,
          myTotDebtAmt: formData.myTotDebtAmt || 0,
          mmrtAmt: formData.mmrtAmt || 0,
        };
        
        getGuaranteeLimit(submitData, {
          onSuccess: (data) => {
            if (data.success) {
              handleApiSuccess();
            } else {
              handleApiError(data.message || '전세자금보증상품 조회 중 오류가 발생했습니다.');
            }
          },
          onError: () => {
            handleApiError('API 호출 중 오류가 발생했습니다.');
          }
        });
      }
    },
    [formData, getGuaranteeLimit, validateForm, handleApiSuccess, handleApiError]
  );

  // 입력 컴포넌트
  const inputComponent = (
    <GuaranteeLimitInput
      formData={formData}
      errors={errors}
      onInputChange={handleInputChange}
      onSubmit={handleSubmit}
    />
  );

  // 결과 컴포넌트
  const outputComponent = <GuaranteeLimitOutput />;

  return (
    <DataContainer
      title='전세자금보증한도 조회'
      inputComponent={inputComponent}
      outputComponent={outputComponent}
      // onSuccess={handleApiSuccess}
      checkExistsQuery={checkExistsQuery}
    />
  );
}
