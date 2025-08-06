"use client";

import React, { useState, Fragment } from 'react';
import axios from 'axios';
import ApiResultDisplay from '@/(anon)/_components/common/ApiResultDisplay';
import styles from './page.module.css';

interface TaxCert {
  id: number;
  userAddressId: number;
  taxCertJson: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

export default function TaxCertCopyTestPage() {
  const [userAddressId, setUserAddressId] = useState<string>('1');
  const [taxCert, setTaxCert] = useState<TaxCert | null>(null);
  const [selectedCert, setSelectedCert] = useState<TaxCert | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editData, setEditData] = useState<string>('');
  const [showEditModal, setShowEditModal] = useState(false);

  // 납세증명서 조회
  const handleGetTaxCert = async () => {
    if (!userAddressId) {
      setError('사용자 주소 ID를 입력해주세요.');
      return;
    }

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

  // 납세증명서 수정
  const handleUpdateTaxCert = async () => {
    if (!selectedCert || !editData) return;

    setIsLoading(true);
    setError(null);

    try {
      let parsedData;
      try {
        parsedData = JSON.parse(editData);
      } catch {
        setError('올바른 JSON 형식이 아닙니다.');
        setIsLoading(false);
        return;
      }

      const response = await axios.put('/api/tax-cert-copy', {
        userAddressId: selectedCert.userAddressId,
        taxCertJson: parsedData
      });

      const data = response.data as { success: boolean; message?: string };
      if (data.success) {
        setShowEditModal(false);
        setEditData('');
        setSelectedCert(null);
        // 데이터 새로고침
        await handleGetTaxCert();
      } else {
        setError(data.message || '수정에 실패했습니다.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '수정 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 납세증명서 삭제
  const handleDeleteTaxCert = async () => {
    if (!userAddressId) return;

    if (!confirm('정말로 모든 납세증명서를 삭제하시겠습니까?')) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.delete(`/api/tax-cert-copy?userAddressId=${userAddressId}`);

      const data = response.data as { success: boolean; message?: string };
      if (data.success) {
        setTaxCert(null);
        setSelectedCert(null);
      } else {
        setError(data.message || '삭제에 실패했습니다.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '삭제 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 수정 모달 열기
  const openEditModal = (cert: TaxCert) => {
    setSelectedCert(cert);
    setEditData(JSON.stringify(cert.taxCertJson, null, 2));
    setShowEditModal(true);
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
          
          <button 
            onClick={handleDeleteTaxCert}
            disabled={isLoading || !taxCert}
            className={styles.dangerButton}
          >
            삭제
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
              <div className={styles.certActions}>
                <button 
                  onClick={() => openEditModal(taxCert)}
                  className={styles.editButton}
                >
                  수정
                </button>
              </div>
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
                {taxCert.createdAt && (
                  <div className={styles.infoItem}>
                    <strong>생성일:</strong>
                    <span>{new Date(taxCert.createdAt).toLocaleString()}</span>
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

      {/* 수정 모달 */}
      {showEditModal && selectedCert && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>납세증명서 수정</h3>
              <button 
                onClick={() => {
                  setShowEditModal(false);
                  setEditData('');
                  setSelectedCert(null);
                }}
                className={styles.closeButton}
              >
                ✕
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <label htmlFor="editData">JSON 데이터:</label>
              <textarea
                id="editData"
                value={editData}
                onChange={(e) => setEditData(e.target.value)}
                className={styles.textarea}
                rows={20}
              />
            </div>
            
            <div className={styles.modalFooter}>
              <button 
                onClick={handleUpdateTaxCert}
                disabled={isLoading}
                className={styles.primaryButton}
              >
                {isLoading ? '수정 중...' : '수정'}
              </button>
              <button 
                onClick={() => {
                  setShowEditModal(false);
                  setEditData('');
                  setSelectedCert(null);
                }}
                className={styles.secondaryButton}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}