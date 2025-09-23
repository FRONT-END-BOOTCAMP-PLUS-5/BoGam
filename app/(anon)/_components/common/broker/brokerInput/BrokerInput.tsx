'use client';

import { useState } from 'react';
import { useSearchBrokers, useCreateBrokerCopy } from '@/hooks/useBroker';
import { BrokerListContent } from '@/(anon)/_components/common/broker/brokerListContent/BrokerListContent';
import { FormContainer } from '@/(anon)/_components/common/forms/FormContainer';
import Field from '@/(anon)/_components/common/forms/Field';
import TextInput from '@/(anon)/_components/common/forms/TextInput';
import { styles } from '@/(anon)/_components/common/broker/brokerInput/BrokerInput.styles';
import { useModalStore } from '@libs/stores/modalStore';

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
  const [, setBrokerList] = useState<BrokerData[]>([]);
  const [, setHasEmptyResult] = useState(false);

  const searchBrokersMutation = useSearchBrokers();
  const createBrokerCopyMutation = useCreateBrokerCopy();
  const { openModal, closeModal } = useModalStore();

  // 중개사 외부 API 데이터 조회 (API에서)
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
        let brokers: BrokerData[] = [];
        
        if (data.success && data.data) {
          // 중개업자 데이터 추출
          try {
            const brokerData =
              typeof data.data === 'string' ? JSON.parse(data.data) : data.data;
            brokers = Array.isArray(brokerData) ? brokerData : [brokerData];
          } catch (error) {
            console.error('중개업자 데이터 파싱 오류:', error);
            brokers = [];
          }
        }
        
        setBrokerList(brokers);
        setHasEmptyResult(brokers.length === 0);
        
        // modalStore를 사용하여 모달 열기
        openModal({
          title: brokers.length === 0 ? '조회 결과' : '중개업자 선택',
          content: (
            <BrokerListContent
              brokerData={brokers}
              onSelectBroker={handleSelectBroker}
            />
          ),
          onConfirm: brokers.length === 0 ? handleEmptyStateConfirm : undefined,
          onCancel: brokers.length === 0 ? undefined : () => closeModal(),
          confirmText: brokers.length === 0 ? '확인' : undefined,
          cancelText: brokers.length === 0 ? undefined : '닫기',
          icon: 'info',
        });
      },
    });
  };

  // 빈 상태 확인 버튼 처리
  const handleEmptyStateConfirm = () => {
    setHasEmptyResult(false);
  };

  // 중개업자 선택 처리
  const handleSelectBroker = (broker: BrokerData) => {
    const params = {
      userAddressNickname: userAddressNickname,
      brokerJson: JSON.stringify(broker),
    };

    createBrokerCopyMutation.mutate(params, {
      onSuccess: (data) => {
        if (data.success) {
          closeModal(); // 모달 닫기
          onBrokerSelected(broker);
          onSuccess(); // 출력 탭으로 이동
        }
      },
    });
  };

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
        <Field id='broker-name' label='중개업자명' required>
          <TextInput
            type='text'
            value={brkrNm}
            onChange={(e) => setBrkrNm(e.target.value)}
            placeholder='중개업자명을 입력하세요'
          />
        </Field>

        <Field id='business-name' label='사업자상호'>
          <TextInput
            type='text'
            value={bsnmCmpnm}
            onChange={(e) => setBsnmCmpnm(e.target.value)}
            placeholder='사업자상호를 입력하세요 (선택사항)'
          />
        </Field>

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

    </>
  );
};
