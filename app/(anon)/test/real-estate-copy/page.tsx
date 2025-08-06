"use client";

import React, { useState } from 'react';
import axios from 'axios';
import ApiResultDisplay from '@/(anon)/_components/common/ApiResultDisplay';
import styles from './page.module.css';

interface RealEstateCopy {
  id: number;
  userAddressId: number;
  realEstateJson: Record<string, unknown>;
  updatedAt?: string;
}

export default function RealEstateCopyTestPage() {
  const [userAddressId, setUserAddressId] = useState<string>('1');
  const [realEstateCopy, setRealEstateCopy] = useState<RealEstateCopy | null>(null);
  const [selectedCopy, setSelectedCopy] = useState<RealEstateCopy | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editData, setEditData] = useState<string>('');
  const [showEditModal, setShowEditModal] = useState(false);

  // 등기부등본 조회
  const handleGetRealEstateCopy = async () => {
    if (!userAddressId) {
      setError('사용자 주소 ID를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/real-estate-copy?userAddressId=${userAddressId}`);
      
      const data = response.data as { success: boolean; data?: RealEstateCopy; message?: string };
      if (data.success && data.data) {
        setRealEstateCopy(data.data);
        setError(null);
      } else {
        setRealEstateCopy(null);
        setError(data.message || '조회에 실패했습니다.');
      }
    } catch (err) {
      if (err && typeof err === 'object' && 'response' in err && (err as any).response?.status === 404) {
        setRealEstateCopy(null);
        setError('해당 사용자 주소의 등기부등본을 찾을 수 없습니다.');
      } else {
        setError(err instanceof Error ? err.message : '조회 중 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 등기부등본 수정
  const handleUpdateRealEstateCopy = async () => {
    if (!selectedCopy || !editData) return;

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

      const response = await axios.put('/api/real-estate-copy', {
        userAddressId: selectedCopy.userAddressId,
        realEstateJson: parsedData
      });

      const data = response.data as { success: boolean; message?: string };
      if (data.success) {
        setShowEditModal(false);
        setEditData('');
        setSelectedCopy(null);
        // 데이터 새로고침
        await handleGetRealEstateCopy();
      } else {
        setError(data.message || '수정에 실패했습니다.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '수정 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 등기부등본 삭제
  const handleDeleteRealEstateCopy = async () => {
    if (!userAddressId) return;

    if (!confirm('정말로 등기부등본을 삭제하시겠습니까?')) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.delete(`/api/real-estate-copy?userAddressId=${userAddressId}`);

      const data = response.data as { success: boolean; message?: string };
      if (data.success) {
        setRealEstateCopy(null);
        setSelectedCopy(null);
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
  const openEditModal = (copy: RealEstateCopy) => {
    setSelectedCopy(copy);
    setEditData(JSON.stringify(copy.realEstateJson, null, 2));
    setShowEditModal(true);
  };

  // 등기부등본 정보 추출
  const extractRealEstateInfo = (realEstateJson: Record<string, unknown>) => {
    // CODEF API 응답 구조에 따라 데이터 추출
    const data = realEstateJson.data as Record<string, unknown> || {};
    const result = realEstateJson.result as Record<string, unknown> || {};
    
    // 등기부등본 데이터는 보통 배열 형태로 오므로 첫 번째 항목을 확인
    const registerList = data.resRegisterEntriesList as Array<Record<string, unknown>> || [];
    const firstRegister = registerList[0] || {};
    
    return {
      resultCode: result.code || 'N/A',
      resultMessage: result.message || 'N/A',
      issueYN: data.resIssueYN || 'N/A',
      uniqueNo: firstRegister.commUniqueNo || data.commUniqueNo || 'N/A',
      docTitle: firstRegister.resDocTitle || 'N/A',
      realty: firstRegister.resRealty || 'N/A',
      competentOffice: firstRegister.commCompetentRegistryOffice || 'N/A',
      publishNo: firstRegister.resPublishNo || 'N/A',
      publishDate: firstRegister.resPublishDate || 'N/A',
    };
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>등기부등본 조회 테스트</h1>
      
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
            onClick={handleGetRealEstateCopy}
            disabled={isLoading}
            className={styles.primaryButton}
          >
            {isLoading ? '조회 중...' : '조회'}
          </button>
          
          <button 
            onClick={handleDeleteRealEstateCopy}
            disabled={isLoading || !realEstateCopy}
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

      {realEstateCopy && (
        <div className={styles.results}>
          <h2>조회 결과</h2>
          
          <div className={styles.copyItem}>
            <div className={styles.copyHeader}>
              <h3>등기부등본 ID: {realEstateCopy.id}</h3>
              <div className={styles.copyActions}>
                <button 
                  onClick={() => openEditModal(realEstateCopy)}
                  className={styles.editButton}
                >
                  수정
                </button>
              </div>
            </div>
            
            <div className={styles.copyInfo}>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <strong>사용자 주소 ID:</strong>
                  <span>{realEstateCopy.userAddressId}</span>
                </div>
                {(() => {
                  const estateInfo = extractRealEstateInfo(realEstateCopy.realEstateJson);
                  return (
                    <React.Fragment key="estateInfo">
                      <div className={styles.infoItem}>
                        <strong>결과 코드:</strong>
                        <span className={estateInfo.resultCode === 'CF-00000' ? styles.successCode : styles.errorCode}>
                          {String(estateInfo.resultCode || '-')}
                        </span>
                      </div>
                      <div className={styles.infoItem}>
                        <strong>결과 메시지:</strong>
                        <span>{String(estateInfo.resultMessage || '-')}</span>
                      </div>
                      <div className={styles.infoItem}>
                        <strong>발행여부:</strong>
                        <span className={estateInfo.issueYN === '1' ? styles.successCode : styles.errorCode}>
                          {estateInfo.issueYN === '1' ? '발행성공' : estateInfo.issueYN === '0' ? '발행실패' : String(estateInfo.issueYN || '-')}
                        </span>
                      </div>
                      <div className={styles.infoItem}>
                        <strong>부동산 고유번호:</strong>
                        <span>{String(estateInfo.uniqueNo || '-')}</span>
                      </div>
                      <div className={styles.infoItem}>
                        <strong>문서제목:</strong>
                        <span>{String(estateInfo.docTitle || '-')}</span>
                      </div>
                      <div className={styles.infoItem}>
                        <strong>부동산명:</strong>
                        <span>{String(estateInfo.realty || '-')}</span>
                      </div>
                      <div className={styles.infoItem}>
                        <strong>관할등기소:</strong>
                        <span>{String(estateInfo.competentOffice || '-')}</span>
                      </div>
                      <div className={styles.infoItem}>
                        <strong>발행번호:</strong>
                        <span>{String(estateInfo.publishNo || '-')}</span>
                      </div>
                      <div className={styles.infoItem}>
                        <strong>발행일자:</strong>
                        <span>{String(estateInfo.publishDate || '-')}</span>
                      </div>
                    </React.Fragment>
                  );
                })()}
                {realEstateCopy.updatedAt && (
                  <div className={styles.infoItem}>
                    <strong>마지막 업데이트:</strong>
                    <span>{new Date(realEstateCopy.updatedAt).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.jsonData}>
              <h4>등기부등본 데이터:</h4>
              <ApiResultDisplay response={realEstateCopy.realEstateJson as any} />
            </div>
          </div>
        </div>
      )}

      {!realEstateCopy && !isLoading && !error && (
        <div className={styles.noData}>
          조회된 등기부등본이 없습니다.
        </div>
      )}

      {/* 수정 모달 */}
      {showEditModal && selectedCopy && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>등기부등본 수정</h3>
              <button 
                onClick={() => {
                  setShowEditModal(false);
                  setEditData('');
                  setSelectedCopy(null);
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
                onClick={handleUpdateRealEstateCopy}
                disabled={isLoading}
                className={styles.primaryButton}
              >
                {isLoading ? '수정 중...' : '수정'}
              </button>
              <button 
                onClick={() => {
                  setShowEditModal(false);
                  setEditData('');
                  setSelectedCopy(null);
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