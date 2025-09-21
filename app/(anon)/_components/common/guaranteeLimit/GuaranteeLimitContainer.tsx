'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  GetGuaranteeLimitRequestDto,
  GetGuaranteeLimitResponseDto,
  // GuaranteeLimitApiResponse,
} from '@libs/api_front/guaranteeLimit.api';
import { useGetGuaranteeLimit } from '@/hooks/useGuaranteeLimit';
import { FIELD_ERROR_MESSAGES } from '@utils/constants/guaranteeLimit';
import { TabNavigation } from '@/(anon)/_components/common/broker/tabNavigation/TabNavigation';
import GuaranteeLimitInput from './GuaranteeLimitInput';
import GuaranteeLimitOutput from './GuaranteeLimitOutput';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import { useModalStore } from '@libs/stores/modalStore';
import styles from './GuaranteeLimitContainer.styles';


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

type TabType = 'input' | 'output';


export default function GuaranteeLimitContainer() {
  // 상태 관리
  const [formData, setFormData] =
    useState<GetGuaranteeLimitRequestDto>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<
    Record<keyof GetGuaranteeLimitRequestDto, string | undefined>
  >({} as Record<keyof GetGuaranteeLimitRequestDto, string | undefined>);
  const [activeTab, setActiveTab] = useState<TabType>('input');

  const { selectedAddress } = useUserAddressStore();
  const { openModal } = useModalStore();

  // API 훅
  const {
    mutate: getGuaranteeLimit,
    isPending,
    data,
  } = useGetGuaranteeLimit();

  // 보증 금액 데이터 로컬 상태
  const [guaranteeData, setGuaranteeData] = useState<{
    grntLmtAmt?: string;
    loanLmtAmt?: string;
    grntDvcd?: string;
    rcmdProrRnk?: number;
  }>({});

  // selectedAddress 변경 시 formData에 userAddressNickname 추가
  useEffect(() => {
    if (selectedAddress?.nickname) {
      setFormData((prev) => ({
        ...prev,
        userAddressNickname: selectedAddress.nickname,
      }));
    }
  }, [selectedAddress]);

  // 데이터 응답 시 자동으로 결과 탭으로 이동 및 로컬 상태 업데이트
  useEffect(() => {
    if (data?.data?.items && data.data.items.length > 0) {
      setActiveTab('output');

      const firstItem = data.data.items[0];

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

  // data.success가 false일 때 에러 모달 표시
  useEffect(() => {
    if (data && data.success === false) {
      openModal({
        title: '오류',
        content: data.message || '전세자금보증상품 조회 중 오류가 발생했습니다.',
        icon: 'error',
        confirmText: '확인',
        onConfirm: async () => {
          // 확인 버튼 클릭 시 아무것도 하지 않음 (모달만 닫힘)
        },
      });
    }
  }, [data, openModal]);

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
        getGuaranteeLimit(submitData);
      }
    },
    [formData, getGuaranteeLimit, validateForm]
  );

  // 탭 변경 핸들러
  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab);
  }, []);

  return (
    <div className={styles.container}>
      {/* 탭 네비게이션 */}
      <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />

      {/* 탭 컨텐츠 */}
      <div className={styles.tabContent}>
        {activeTab === 'input' ? (
          <GuaranteeLimitInput
            formData={formData}
            errors={errors}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
          />
        ) : (
          <GuaranteeLimitOutput
            data={
              data?.data ||
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
                  } as GetGuaranteeLimitResponseDto)
                : undefined)
            }
            isPending={isPending}
          />
        )}
      </div>
    </div>
  );
}
