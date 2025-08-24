'use client';

import { useGetBrokerCopy } from '@/hooks/useBroker';
import { useBrokerRiskAssessment } from '@/hooks/useBrokerRiskAssessment';
import { RiskAssessmentDisplay } from '@/(anon)/_components/common/realEstate/riskAssessmentDisplay/RiskAssessmentDisplay';
import { styles } from './BrokerOutput.styles';

interface BrokerData {
  brkrNm: string;
  bsnmCmpnm?: string;
  brkrAddr?: string;
  telNo?: string;
  [key: string]: unknown;
}

interface BrokerOutputProps {
  userAddressNickname: string;
  selectedBroker?: BrokerData;
}

export const BrokerOutput = ({
  userAddressNickname,
  selectedBroker,
}: BrokerOutputProps) => {
  const brokerCopyQuery = useGetBrokerCopy(userAddressNickname || null);

  // 수동으로 DB에서 조회
  const handleGetBrokerCopyFromDB = () => {
    brokerCopyQuery.refetch();
  };

  // 응답 데이터 (쿼리 데이터)
  const displayData = brokerCopyQuery.data;

  // 중개업자 안전도 검사 hook 사용
  const riskAssessment = useBrokerRiskAssessment(selectedBroker || null);

  if (brokerCopyQuery.isLoading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.loadingSpinner}></div>
        <p className={styles.loadingText}>데이터를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <>
      {selectedBroker ? (
        <div>
          {/* 안전도 검사 결과 표시 */}
          <RiskAssessmentDisplay
            riskAssessment={riskAssessment}
            displayResponse={null}
          />
        </div>
      ) : displayData ? (
        <div
          className={`${styles.response} ${
            displayData.success ? styles.success : styles.error
          }`}
        >
          <p className={styles.responseText}>
            <strong>상태:</strong> {displayData.success ? '성공' : '실패'}
          </p>
          {displayData.message && (
            <p className={styles.responseText}>
              <strong>메시지:</strong> {displayData.message}
            </p>
          )}
          {displayData.error && (
            <p className={styles.responseText}>
              <strong>에러:</strong> {displayData.error}
            </p>
          )}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p>안전도를 검사할 중개업자를 선택해주세요.</p>
          <p className='text-sm text-brand-dark-gray mt-2'>
            Input 탭에서 중개업자를 조회하고 선택하시면 안전도 검사 결과를
            확인할 수 있습니다.
          </p>
          <button
            onClick={handleGetBrokerCopyFromDB}
            disabled={brokerCopyQuery.isLoading || !userAddressNickname}
            className={styles.button}
          >
            {brokerCopyQuery.isLoading ? '조회 중...' : 'DB에서 데이터 조회'}
          </button>
        </div>
      )}

      {/* 에러 메시지 표시 */}
      {brokerCopyQuery.error && (
        <div className={`${styles.response} ${styles.error}`}>
          <p className={styles.responseText}>
            <strong>오류:</strong>{' '}
            {brokerCopyQuery.error?.message ||
              '데이터 조회 중 오류가 발생했습니다.'}
          </p>
        </div>
      )}
    </>
  );
};
