'use client';

import React, { useState } from 'react';
import axios from 'axios';
import styles from './page.module.css';

interface TaxCert {
  id: number;
  userAddressId: number;
  taxCertJson: Record<string, unknown>;
  updatedAt?: string;
}

export default function TaxCertCopyTestPage() {
  const [userAddressNickname, setUserAddressNickname] =
    useState<string>('채원강남집');
  const [taxCert, setTaxCert] = useState<TaxCert | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 납세증명서 조회
  const handleGetTaxCert = async () => {
    if (!userAddressNickname) {
      setError('사용자 주소 닉네임을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 단순히 DB 조회만 수행
      const response = await axios.get(
        `/api/copies/tax-cert?userAddressNickname=${userAddressNickname}`
      );

      const data = response.data as {
        success: boolean;
        data?: TaxCert;
        message?: string;
      };
      if (data.success && data.data) {
        setTaxCert(data.data);
        setError(null);
      } else {
        setTaxCert(null);
        setError(data.message || '조회에 실패했습니다.');
      }
    } catch (err) {
      if (
        err &&
        typeof err === 'object' &&
        'response' in err &&
        (err as { response?: { status?: number } }).response?.status === 404
      ) {
        setTaxCert(null);
        setError('해당 사용자 주소의 납세증명서를 찾을 수 없습니다.');
      } else {
        setError(
          err instanceof Error ? err.message : '조회 중 오류가 발생했습니다.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 납세증명서 정보 추출
  const extractTaxCertInfo = (taxCertJson: Record<string, unknown>) => {
    // CODEF API 응답 구조에 따라 데이터 추출
    const data = (taxCertJson.data as Record<string, unknown>) || {};
    const result = (taxCertJson.result as Record<string, unknown>) || {};

    return {
      resultCode: result.code || 'N/A',
      resultMessage: result.message || 'N/A',
      issueNo: data.resIssueNo || 'N/A',
      userName: data.resUserNm || 'N/A',
      userAddr: data.resUserAddr || 'N/A',
      paymentTaxStatus: data.resPaymentTaxStatus || 'N/A',
      issueDate: data.resIssueDate || 'N/A',
    };
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>납세증명서 조회 테스트</h1>

      <div className={styles.controls}>
        <div className={styles.inputGroup}>
          <label htmlFor='userAddressNickname'>사용자 주소 닉네임:</label>
          <input
            id='userAddressNickname'
            type='text'
            value={userAddressNickname}
            onChange={(e) => setUserAddressNickname(e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.buttonGroup}>
          <button
            onClick={handleGetTaxCert}
            disabled={isLoading}
            className={styles.primaryButton}
          >
            {isLoading ? '조회 중...' : '조회'}
          </button>
        </div>
      </div>

      {error && <div className={styles.error}>❌ {error}</div>}

      {taxCert && (
        <div className={styles.results}>
          <h2>조회 결과</h2>

          <div className={styles.certItem}>
            <div className={styles.certHeader}>
              <h3>납세증명서 ID: {taxCert.id}</h3>
            </div>

            <div className={styles.certInfo}>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <strong>사용자 주소 ID:</strong>
                  <span>{taxCert.userAddressId}</span>
                </div>
                <div className={styles.infoItem}>
                  <strong>업데이트 시간:</strong>
                  <span>
                    {taxCert.updatedAt
                      ? new Date(taxCert.updatedAt).toLocaleString()
                      : 'N/A'}
                  </span>
                </div>
              </div>

              {(() => {
                const certInfo = extractTaxCertInfo(taxCert.taxCertJson);
                return (
                  <React.Fragment key='certInfo'>
                    <div className={styles.infoItem}>
                      <strong>결과 코드:</strong>
                      <span>{String(certInfo.resultCode)}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <strong>결과 메시지:</strong>
                      <span>{String(certInfo.resultMessage)}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <strong>발급번호:</strong>
                      <span>{String(certInfo.issueNo)}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <strong>사용자명:</strong>
                      <span>{String(certInfo.userName)}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <strong>사용자 주소:</strong>
                      <span>{String(certInfo.userAddr)}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <strong>납세상태:</strong>
                      <span>{String(certInfo.paymentTaxStatus)}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <strong>발급일:</strong>
                      <span>{String(certInfo.issueDate)}</span>
                    </div>
                  </React.Fragment>
                );
              })()}
            </div>

            <div className={styles.rawData}>
              <h4>원본 데이터</h4>
              <pre className={styles.jsonData}>
                {JSON.stringify(taxCert.taxCertJson, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
