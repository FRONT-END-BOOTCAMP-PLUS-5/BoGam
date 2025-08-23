import { useEffect, useState } from 'react';
import { ApiResponse } from '@/(anon)/_components/common/realEstate/types';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import { useGetRealEstateFromDB } from '@/hooks/useRealEstate';
import { useRiskAssessment } from '@/hooks/useRiskAssessment';
import { RealEstateEntity } from '@be/domain/entities/RealEstate';

interface UseRealEstateOutputProps {
  response: ApiResponse | null;
  loading: boolean;
  existsData: any;
}

export const useRealEstateOutput = ({
  response,
  loading,
  existsData,
}: UseRealEstateOutputProps) => {
  const { selectedAddress } = useUserAddressStore();
  const [currentStep, setCurrentStep] = useState<number>(1);

  // DB에서 데이터 조회 (response prop이 없을 때만)
  const { data: dbResponse, isLoading: dbLoading } = useGetRealEstateFromDB(
    response ? undefined : selectedAddress?.nickname
  );

  // response prop이 있으면 그것을 사용, 없으면 dbResponse 사용
  const displayResponse: ApiResponse | null = response || dbResponse || null;

  // 현재 라우팅에서 step number 추출
  useEffect(() => {
    const match = window.location.pathname.match(/\/steps\/(\d+)/);
    if (match) {
      setCurrentStep(parseInt(match[1]));
    }
  }, []);

  // 위험도 측정
  const riskAssessment = useRiskAssessment(
    currentStep,
    displayResponse?.data?.realEstateJson?.data as RealEstateEntity,
    null
  );

  return {
    selectedAddress,
    currentStep,
    displayResponse,
    dbLoading,
    riskAssessment,
    loading: loading || dbLoading,
    hasData: displayResponse && !(existsData?.success && !existsData.exists),
  };
};
