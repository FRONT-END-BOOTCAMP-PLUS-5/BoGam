import { useMemo } from 'react';
import {
  TaxCertOutputProps,
  TaxCertApiResponse,
} from '@/(anon)/@detail/steps/[step-number]/[detail]/_components/contents/taxCert/types';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import { useGetTaxCertCopy } from '@/hooks/useTaxCert';
import { useTaxCertRiskAssessment } from '@/hooks/useTaxCertRiskAssessment';

export const useTaxCertOutput = ({
  response,
  loading,
  existsData,
}: TaxCertOutputProps) => {
  const { selectedAddress } = useUserAddressStore();

  // DB에서 데이터 조회 (response prop이 없을 때만)
  const { data: dbResponse, isLoading: dbLoading, refetch: refetchTaxCertCopy } = useGetTaxCertCopy(
    response ? null : selectedAddress?.nickname || null
  );

  console.log('dbResponse', dbResponse);

  // response prop이 있으면 그것을 사용, 없으면 dbResponse 사용
  const displayResponse = useMemo(() => {
    if (response) {
      return response;
    }

    if (dbResponse) {
      const response = dbResponse as unknown as { success: boolean; data?: { taxCertJson: string }; message?: string };
      if (response.success && response.data) {
        return {
          success: true,
          message: '성공',
          userAddressNickname: selectedAddress?.nickname || '',
          data: {
            data: response.data.taxCertJson,
          },
        } as TaxCertApiResponse;
      } else {
        // success: false인 경우도 처리
        return {
          success: false,
          message: response.message || '데이터를 찾을 수 없습니다.',
          userAddressNickname: selectedAddress?.nickname || '',
          data: undefined,
        } as TaxCertApiResponse;
      }
    }

    return null;
  }, [response, dbResponse, selectedAddress?.nickname]);

  // 위험도 측정 - 새로운 데이터 구조 우선 사용
  const taxCertData = displayResponse?.data?.taxCertJson;
  const riskAssessment = useTaxCertRiskAssessment(
    taxCertData || null,
    selectedAddress?.nickname
  );

  const totalLoading = loading || dbLoading;

  // 표준 hasData 로직
  const hasData = useMemo(() => {
    return (
      displayResponse &&
      !(
        (existsData as { success: boolean; exists: boolean } | null | undefined)
          ?.success &&
        !(
          existsData as { success: boolean; exists: boolean } | null | undefined
        )?.exists
      )
    );
  }, [displayResponse, existsData]);

  return {
    displayResponse,
    riskAssessment,
    loading: totalLoading,
    hasData,
    refetchTaxCertCopy,
  };
};
