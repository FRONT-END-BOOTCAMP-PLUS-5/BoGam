'use client';

import React, { useEffect, useState } from 'react';
import { TaxCertRespiteItem } from '@be/applications/taxCert/dtos/GetTaxCertResponseDto';
import { styles } from '@/(anon)/_components/common/taxCert/TaxCertResultDisplay.styles';
import { PdfViewer } from '@/(anon)/_components/common/pdfViewer/PdfViewer';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import LoadingOverlay from '@/(anon)/_components/common/loading/LoadingOverlay';
import { DataContainer } from '@/(anon)/_components/common/container/DataContainer';
import { TaxCertInput } from '@/(anon)/_components/common/taxCert/TaxCertInput';
import { useCheckTaxCertCopyExists } from '@/hooks/useTaxCert';
import { useGetTaxCertCopy } from '@/hooks/useTaxCertQueries';
import { useTaxCertRiskAssessment } from '@/hooks/useTaxCertRiskAssessment';
import { RiskAssessmentDisplay } from '@/(anon)/_components/common/realEstate/riskAssessmentDisplay/RiskAssessmentDisplay';
import { useRiskAssessmentLoad } from '@/hooks/useRiskAssessmentLoad';
import { convertJsonToRiskAssessment } from '@utils/riskAssessmentUtils';


// 납세증명서 데이터 타입 정의
interface TaxCertData {
  resIssueNo?: string;
  resUserNm?: string;
  resUserAddr?: string;
  resUserIdentiyNo?: string;
  resPaymentTaxStatus?: string;
  resValidPeriod?: string;
  resRespiteList?: TaxCertRespiteItem[];
  resOriGinalData1?: string;
}

export default function TaxCertResultDisplay() {
  const { selectedAddress } = useUserAddressStore();
  const userAddressNickname = selectedAddress?.nickname || '';

  // useGetTaxCertCopy 훅 사용
  const {
    data: result,
    isLoading,
    error: queryError,
  } = useGetTaxCertCopy(userAddressNickname);

  // 데이터 파싱 및 상태 관리
  const [data, setData] = useState<TaxCertData | null>(null);
  const [parsedError, setParsedError] = useState<string | null>(null);
  const [checklistState, setChecklistState] = useState<Record<string, boolean>>(
    {}
  );

  // URL에서 stepNumber와 detail 가져오기
  const pathname = window.location.pathname;
  const stepUrlData = pathname.match(/\/steps\/(\d+)\/(\d+)/);
  const stepNumber = stepUrlData ? parseInt(stepUrlData[1]) : 1;
  const detail = stepUrlData ? parseInt(stepUrlData[2]) : 5;

  // 저장된 위험도 검사 결과 로드
  const {
    data: savedRiskData,
    error: loadError,
    isLoading: loadLoading,
  } = useRiskAssessmentLoad({
    stepNumber,
    detail,
    userAddressNickname,
  });


  // 납세증명서 위험도 검사 hook 사용
  const riskAssessment = useTaxCertRiskAssessment(
    data,
    selectedAddress?.nickname,
    checklistState
  );

  // 체크리스트 항목 변경 핸들러
  const handleChecklistItemChange = (itemId: string, checked: boolean) => {
    console.log('체크리스트 상태 변경:', itemId, checked);
    setChecklistState((prev) => {
      const newState = {
        ...prev,
        [itemId]: checked,
      };
      console.log('새로운 체크리스트 상태:', newState);
      return newState;
    });
  };

  // 납세증명서 존재 여부 확인
  const existsQuery = useCheckTaxCertCopyExists(userAddressNickname || null);

  // 존재 여부 쿼리 객체 생성
  const checkExistsQuery = {
    data: existsQuery.data
      ? {
          success: true,
          data: {
            exists: (existsQuery.data as { exists?: boolean })?.exists || false,
          },
        }
      : undefined,
    isLoading: existsQuery.isLoading,
    refetch: existsQuery.refetch,
  };

  useEffect(() => {
    if (result && result.success && result.data) {
      try {
        // DB에서 조회된 데이터를 파싱
        // taxCertJson 필드에서 납세증명서 데이터 추출
        if (result.data.taxCertJson) {
          try {
            // 이미 복호화된 JSON 객체이므로 파싱 불필요
            setData(result.data.taxCertJson);
            setParsedError(null);
          } catch {
            setParsedError('납세증명서 데이터 형식이 올바르지 않습니다.');

          }
        } else {
          setParsedError('납세증명서 데이터가 올바르지 않습니다.');
        }
      } catch {
        setParsedError('납세증명서 데이터 형식이 올바르지 않습니다.');
      }
    } else if (result && !result.success) {
      setParsedError(
        result.message || '납세증명서 데이터를 조회할 수 없습니다.'
      );
    }
  }, [result]);

  // 입력 컴포넌트
  const inputComponent = ({ onSuccess }: { onSuccess: () => void }) => (
    <TaxCertInput
      userAddressNickname={userAddressNickname}
      onSuccess={onSuccess}
    />
  );

  // 결과 컴포넌트
  const outputComponent = (
    <>
      {isLoading ? (

        <LoadingOverlay
          isVisible={true}
          title='납세증명서 데이터를 불러오는 중이에요!'
          currentStep={1}
          totalSteps={1}
        />
      ) : queryError || parsedError ? (
        <div className={styles.emptyContainer}>
          <p className={styles.emptyText}>
            ❌ {queryError?.message || parsedError}
          </p>
        </div>
      ) : !data ? (
        <div className={styles.emptyContainer}>
          <p className={styles.emptyText}>
            해당 사용자 주소에 대한 납세증명서 데이터가 없어요!
          </p>
        </div>

      ) : (
        <>
          {/* 위험도 측정 결과 표시 */}
          <RiskAssessmentDisplay
            riskAssessment={riskAssessment}
            displayResponse={
              data?.resOriGinalData1
                ? {
                    success: true,
                    message: '성공',
                    userAddressNickname: userAddressNickname,
                    data: {
                      realEstateJson: {
                        data: {
                          resOriGinalData: data.resOriGinalData1,
                        },
                      },
                    },
                  }
                : null
            }
            checklistItems={riskAssessment.checklistItems}
            onChecklistItemChange={handleChecklistItemChange}
            stepNumber={stepNumber}
            detail={detail}
            userAddressNickname={userAddressNickname}
            domain='taxCert'
            initialJsonData={savedRiskData?.jsonData}

          />
        </>
      )}
    </>
  );

  return (
    <DataContainer
      title='납세증명서 관리'
      inputComponent={inputComponent}
      outputComponent={outputComponent}
      checkExistsQuery={checkExistsQuery}
    />
  );
}
