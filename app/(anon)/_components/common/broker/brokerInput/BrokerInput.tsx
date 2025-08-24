'use client';

import { useState } from 'react';
import { useSearchBrokers, useCreateBrokerCopy } from '@/hooks/useBroker';
import { ConfirmModal } from '@/(anon)/_components/common/modal/ConfirmModal';
import { BrokerListContent } from '@/(anon)/_components/common/broker/brokerListContent/BrokerListContent';
import { FormContainer } from '@/(anon)/_components/common/forms/FormContainer';
import { FormField } from '@/(anon)/_components/common/forms/FormField';
import { FormInput } from '@/(anon)/_components/common/forms/FormInput';
import { styles } from '@/(anon)/_components/common/broker/brokerInput/BrokerInput.styles';

interface BrokerData {
  brkrNm: string;
  bsnmCmpnm?: string;
  brkrAddr?: string;
  telNo?: string;
  [key: string]: unknown;
}

interface BrokerInputProps {
  userAddressNickname: string;
  selectedAddress: { id: number; nickname: string; roadAddress: string } | null;
  onSuccess: () => void;
  onBrokerSelected: (broker: BrokerData) => void;
}

export const BrokerInput = ({
  userAddressNickname,
  selectedAddress,
  onSuccess,
  onBrokerSelected,
}: BrokerInputProps) => {
  const [brkrNm, setBrkrNm] = useState<string>('');
  const [bsnmCmpnm, setBsnmCmpnm] = useState<string>('');
  const [brokerData, setBrokerData] = useState<string>('');
  const [showBrokerList, setShowBrokerList] = useState(false);
  const [brokerList, setBrokerList] = useState<BrokerData[]>([]);

  const searchBrokersMutation = useSearchBrokers();
  const createBrokerCopyMutation = useCreateBrokerCopy();

  // 중개사 복사본 조회 (API에서)
  const handleGetBrokerCopy = (e: React.FormEvent) => {
    e.preventDefault();

    if (!userAddressNickname || !brkrNm.trim()) {
      return;
    }

    const params = {
      userAddressNickname,
      brkrNm: brkrNm.trim(),
      bsnmCmpnm: bsnmCmpnm.trim() || undefined,
    };

    searchBrokersMutation.mutate(params, {
      onSuccess: (data) => {
        if (data.success && data.data) {
          // 중개업자 데이터 추출
          try {
            const brokerData =
              typeof data.data === 'string' ? JSON.parse(data.data) : data.data;

            const brokers = Array.isArray(brokerData)
              ? brokerData
              : [brokerData];
            setBrokerList(brokers);
            setShowBrokerList(true);
          } catch (error) {
            console.error('중개업자 데이터 파싱 오류:', error);
          }
        }
      },
    });
  };

  // 중개사 복사본 생성/수정
  const handleCreateBrokerCopy = async () => {
    if (!userAddressNickname || !brokerData) {
      return;
    }

    try {
      const params = {
        userAddressId: selectedAddress?.id || 0,
        brokerJson: JSON.parse(brokerData),
      };

      createBrokerCopyMutation.mutate(params, {
        onSuccess: (data) => {
          if (data.success) {
            onSuccess();
          }
        },
      });
    } catch (error) {
      console.error('JSON 파싱 오류:', error);
    }
  };

  // 중개업자 선택 처리
  const handleSelectBroker = (broker: BrokerData) => {
    onBrokerSelected(broker);
    setShowBrokerList(false);
    onSuccess(); // 출력 탭으로 이동
  };

  const isLoading =
    searchBrokersMutation.isPending || createBrokerCopyMutation.isPending;

  // 주소가 선택되지 않은 경우
  if (!selectedAddress || !userAddressNickname) {
    return (
      <div className={styles.emptyState}>
        <p>중개사 정보를 조회하려면 먼저 주소를 선택해주세요.</p>
      </div>
    );
  }

  return (
    <>
      <FormContainer
        title='중개사 정보 입력'
        onSubmit={handleGetBrokerCopy}
        submitText={
          searchBrokersMutation.isPending ? '조회 중...' : '중개사 정보 조회'
        }
        disabled={!brkrNm.trim()}
      >
        {/* 선택된 주소 정보 표시 */}
        <FormField label='선택된 주소'>
          <p className={styles.addressText}>{selectedAddress.roadAddress}</p>
        </FormField>

        <FormField label='중개업자명' required>
          <FormInput
            type='text'
            value={brkrNm}
            onChange={(e) => setBrkrNm(e.target.value)}
            placeholder='중개업자명을 입력하세요'
          />
        </FormField>

        <FormField label='사업자상호'>
          <FormInput
            type='text'
            value={bsnmCmpnm}
            onChange={(e) => setBsnmCmpnm(e.target.value)}
            placeholder='사업자상호를 입력하세요 (선택사항)'
          />
        </FormField>

        {/* 에러 메시지 표시 */}
        {(searchBrokersMutation.error || createBrokerCopyMutation.error) && (
          <div className={`${styles.response} ${styles.error}`}>
            <p className={styles.responseText}>
              <strong>오류:</strong>{' '}
              {searchBrokersMutation.error?.message ||
                createBrokerCopyMutation.error?.message ||
                '알 수 없는 오류가 발생했습니다.'}
            </p>
          </div>
        )}
      </FormContainer>

      {/* 중개업자 목록 선택 모달 */}
      <ConfirmModal
        isOpen={showBrokerList}
        title='중개업자 선택'
        onCancel={() => setShowBrokerList(false)}
        cancelText='닫기'
        icon='info'
        onConfirm={undefined}
      >
        <BrokerListContent
          brokerData={brokerList}
          onSelectBroker={handleSelectBroker}
        />
      </ConfirmModal>
    </>
  );
};
