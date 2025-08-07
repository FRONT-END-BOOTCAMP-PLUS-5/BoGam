"use client";

import React, { useState, Fragment } from 'react';
import axios from 'axios';
import ApiResultDisplay from '@/(anon)/_components/common/ApiResultDisplay';
import ExistenceWarning from '@/(anon)/_components/common/ExistenceWarning';
import styles from './page.module.css';

interface TaxCert {
  id: number;
  userAddressId: number;
  taxCertJson: Record<string, unknown>;
  updatedAt?: string;
}

interface ExistenceCheck {
  exists: boolean;
  updatedAt?: string;
}

export default function TaxCertCopyTestPage() {
  const [userAddressId, setUserAddressId] = useState<string>('1');
  const [taxCert, setTaxCert] = useState<TaxCert | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showExistenceWarning, setShowExistenceWarning] = useState(false);
  const [existenceData, setExistenceData] = useState<ExistenceCheck | null>(null);

  // 존재 여부 확인
  const checkExistence = async (nickname: string) => {
    try {
      const response = await axios.get(`/api/tax-cert/exists?nickname=${nickname}`);
      const data = response.data as { exists: boolean; updatedAt?: string };
      setExistenceData(data);
      
      if (data.exists) {
        setShowExistenceWarning(true);
        return true; // 존재함
      }
      return false; // 존재하지 않음
    } catch (error) {
      console.error('존재 여부 확인 실패:', error);
      return false;
    }
  };

  // 납세증명서 조회
  const handleGetTaxCert = async () => {
    if (!userAddressId) {
      setError('사용자 주소 ID를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 먼저 존재 여부 확인
      const exists = await checkExistence(userAddressId);
      
      if (exists) {
        // 존재하면 경고창이 표시되므로 여기서는 조회하지 않음
        setIsLoading(false);
        return;
      }

      // 존재하지 않으면 조회 진행
      const response = await axios.get(`/api/tax-cert-copy?userAddressId=${userAddressId}`);
      
      const data = response.data as { success: boolean; data?: TaxCert; message?: string };
      if (data.success && data.data) {
        setTaxCert(data.data);
        setError(null);
      } else {
        setTaxCert(null);
        setError(data.message || '조회에 실패했습니다.');
      }
    } catch (err) {
      if (err && typeof err === 'object' && 'response' in err && (err as any).response?.status === 404) {
        setTaxCert(null);
        setError('해당 사용자 주소의 납세증명서를 찾을 수 없습니다.');
      } else {
        setError(err instanceof Error ? err.message : '조회 중 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 경고창 닫기 후 조회 진행
  const handleContinueAfterWarning = async () => {
    setShowExistenceWarning(false);
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/tax-cert-copy?userAddressId=${userAddressId}`);
      
      const data = response.data as { success: boolean; data?: TaxCert; message?: string };
      if (data.success && data.data) {
        setTaxCert(data.data);
        setError(null);
      } else {
        setTaxCert(null);
        setError(data.message || '조회에 실패했습니다.');
      }
    } catch (err) {
      if (err && typeof err === 'object' && 'response' in err && (err as any).response?.status === 404) {
        setTaxCert(null);
        setError('해당 사용자 주소의 납세증명서를 찾을 수 없습니다.');
      } else {
        setError(err instanceof Error ? err.message : '조회 중 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 납세증명서 정보 추출
  const extractTaxCertInfo = (taxCertJson: Record<string, unknown>) => {
    // CODEF API 응답 구조에 따라 데이터 추출
    const data = taxCertJson.data as Record<string, unknown> || {};
    const result = taxCertJson.result as Record<string, unknown> || {};
    
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
          <label htmlFor="userAddressId">사용자 주소 ID:</label>
          <input
            id="userAddressId"
            type="number"
            value={userAddressId}
            onChange={(e) => setUserAddressId(e.target.value)}
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

      {error && (
        <div className={styles.error}>
          ❌ {error}
        </div>
      )}

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
{(() => {
                  const certInfo = extractTaxCertInfo(taxCert.taxCertJson);
                  return (
                    <Fragment key="certInfo">
                      <div className={styles.infoItem}>
                        <strong>결과 코드:</strong>
                        <span className={certInfo.resultCode === 'CF-00000' ? styles.successCode : styles.errorCode}>
                          {String(certInfo.resultCode || '-')}
                        </span>
                      </div>
                      <div className={styles.infoItem}>
                        <strong>결과 메시지:</strong>
                        <span>{String(certInfo.resultMessage || '-')}</span>
                      </div>
                      <div className={styles.infoItem}>
                        <strong>발급번호:</strong>
                        <span>{String(certInfo.issueNo || '-')}</span>
                      </div>
                      <div className={styles.infoItem}>
                        <strong>성명:</strong>
                        <span>{String(certInfo.userName || '-')}</span>
                      </div>
                      <div className={styles.infoItem}>
                        <strong>주소:</strong>
                        <span>{String(certInfo.userAddr || '-')}</span>
                      </div>
                      <div className={styles.infoItem}>
                        <strong>납세상태:</strong>
                        <span>{String(certInfo.paymentTaxStatus || '-')}</span>
                      </div>
                      <div className={styles.infoItem}>
                        <strong>발급일자:</strong>
                        <span>{String(certInfo.issueDate || '-')}</span>
                      </div>
                    </Fragment>
                  );
                })()}
                {taxCert.updatedAt && (
                  <div className={styles.infoItem}>
                    <strong>마지막 업데이트:</strong>
                    <span>{new Date(taxCert.updatedAt).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.jsonData}>
              <h4>전체 데이터:</h4>
              <ApiResultDisplay response={taxCert.taxCertJson as any} />
            </div>
          </div>
        </div>
      )}

      {!taxCert && !isLoading && !error && (
        <div className={styles.noData}>
          조회된 납세증명서가 없습니다.
        </div>
      )}

      {/* 존재 여부 확인 경고창 */}
      {showExistenceWarning && existenceData && (
        <ExistenceWarning
          exists={existenceData.exists}
          updatedAt={existenceData.updatedAt}
          type="tax-cert"
          onClose={handleContinueAfterWarning}
        />
      )}
    </div>
  );
}