"use client";

import React, { useState } from 'react';
import axios from 'axios';
import ApiResultDisplay from '@/(anon)/_components/common/ApiResultDisplay';
import styles from './page.module.css';

interface RealEstateCopy {
  id: number;
  userAddressId: number;
  realEstateJson: Record<string, unknown>;
  createdAt?: string;
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
              <p><strong>사용자 주소 ID:</strong> {realEstateCopy.userAddressId}</p>
              {realEstateCopy.createdAt && (
                <p><strong>생성일:</strong> {new Date(realEstateCopy.createdAt).toLocaleString()}</p>
              )}
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