'use client';

import { useState } from 'react';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import { useCheckBrokerCopyExists } from '@/hooks/useBroker';
import { DataContainer } from '@/(anon)/_components/common/container/DataContainer';
import { BrokerInput } from '@/(anon)/_components/common/broker/brokerInput/BrokerInput';
import { BrokerOutput } from '@/(anon)/_components/common/broker/brokerOutput/BrokerOutput';

interface BrokerData {
  brkrNm: string;
  bsnmCmpnm?: string;
  brkrAddr?: string;
  telNo?: string;
  [key: string]: unknown;
}

export const BrokerContainer = () => {
  const { selectedAddress } = useUserAddressStore();
  const [selectedBroker, setSelectedBroker] = useState<BrokerData | undefined>(
    undefined
  );

  // React Query 훅 - 선택된 주소의 닉네임을 자동으로 사용
  const existsQuery = useCheckBrokerCopyExists(
    selectedAddress?.nickname || null
  );

  // 존재 여부 쿼리 객체 생성
  const checkExistsQuery = {
    data: existsQuery.data?.success
      ? {
          success: true,
          data: {
            exists:
              (existsQuery.data.data as { exists?: boolean })?.exists || false,
          },
        }
      : undefined,
    isLoading: existsQuery.isLoading,
    refetch: existsQuery.refetch,
  };

  // 중개업자 선택 처리
  const handleBrokerSelected = (broker: BrokerData) => {
    setSelectedBroker(broker);
  };

  // 입력 컴포넌트
  const inputComponent = ({ onSuccess }: { onSuccess: () => void }) => (
    <BrokerInput
      userAddressNickname={selectedAddress?.nickname || ''}
      selectedAddress={selectedAddress}
      onSuccess={onSuccess}
      onBrokerSelected={handleBrokerSelected}
    />
  );

  // 결과 컴포넌트
  const outputComponent = (
    <BrokerOutput
      userAddressNickname={selectedAddress?.nickname || ''}
      selectedBroker={selectedBroker}
    />
  );

  return (
    <DataContainer
      title='중개사 확인하기'
      inputComponent={inputComponent}
      outputComponent={outputComponent}
      checkExistsQuery={checkExistsQuery}
    />
  );
};
