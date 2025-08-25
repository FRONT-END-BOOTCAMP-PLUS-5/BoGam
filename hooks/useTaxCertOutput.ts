import { useMemo } from 'react';
import {
  TaxCertOutputProps,
  TaxCertApiResponse,
} from '@/(anon)/_components/common/taxCert/types';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import { useGetTaxCertCopy } from '@/hooks/useTaxCertQueries';
import { useTaxCertRiskAssessment } from '@/hooks/useTaxCertRiskAssessment';

export const useTaxCertOutput = ({
  response,
  loading,
  existsData,
}: TaxCertOutputProps) => {
  const { selectedAddress } = useUserAddressStore();

  // DB에서 데이터 조회 (response prop이 없을 때만)
  const { data: dbResponse, isLoading: dbLoading } = useGetTaxCertCopy(
    response ? null : selectedAddress?.nickname || null
  );

  // response prop이 있으면 그것을 사용, 없으면 dbResponse 사용
  const displayResponse = useMemo(() => {
    if (response) {
      return response;
    }

    if (
      (dbResponse as unknown as { success: boolean })?.success &&
      (dbResponse as unknown as { data: { taxCertJson: string } })?.data
    ) {
      return {
        success: true,
        message: '성공',
        userAddressNickname: selectedAddress?.nickname || '',
        data: {
          taxCertJson: (
            dbResponse as unknown as { data: { taxCertJson: string } }
          ).data.taxCertJson,
        },
      } as TaxCertApiResponse;
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

  // 등기부등본과 동일한 hasData 로직
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
  };
};
