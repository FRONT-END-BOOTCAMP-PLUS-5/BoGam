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
  const [userAddressNickname, setUserAddressNickname] = useState<string>('채원강남집');
  const [realEstateCopy, setRealEstateCopy] = useState<RealEstateCopy | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 등기부등본 조회
  const handleGetRealEstateCopy = async () => {
    if (!userAddressNickname) {
      setError('사용자 주소 닉네임을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 단순히 DB 조회만 수행
      const response = await axios.get(`/api/real-estate-copy?userAddressNickname=${userAddressNickname}`);
      
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

  // 등기부등본 정보 추출
  const extractRealEstateInfo = (realEstateJson: Record<string, unknown>) => {
    // 등기부등본 API 응답 구조에 따라 데이터 추출
    const data = realEstateJson.data as Record<string, unknown> || {};
    const result = realEstateJson.result as Record<string, unknown> || {};
    
    return {
      resultCode: result.code || 'N/A',
      resultMessage: result.message || 'N/A',
      issueNo: data.resIssueNo || 'N/A',
      propertyType: data.resPropertyType || 'N/A',
      propertyAddress: data.resPropertyAddress || 'N/A',
      ownerName: data.resOwnerName || 'N/A',
      issueDate: data.resIssueDate || 'N/A',
    };
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>등기부등본 조회 테스트</h1>
      
      <div className={styles.controls}>
        <div className={styles.inputGroup}>
          <label htmlFor="userAddressNickname">사용자 주소 닉네임:</label>
          <input
            id="userAddressNickname"
            type="text"
            value={userAddressNickname}
            onChange={(e) => setUserAddressNickname(e.target.value)}
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
            </div>
            
            <div className={styles.copyInfo}>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <strong>사용자 주소 ID:</strong>
                  <span>{realEstateCopy.userAddressId}</span>
                </div>
                <div className={styles.infoItem}>
                  <strong>업데이트 시간:</strong>
                  <span>{realEstateCopy.updatedAt ? new Date(realEstateCopy.updatedAt).toLocaleString() : 'N/A'}</span>
                </div>
              </div>
              
              {(() => {
                const copyInfo = extractRealEstateInfo(realEstateCopy.realEstateJson);
                return (
                  <>
                    <div className={styles.infoItem}>
                      <strong>결과 코드:</strong>
                      <span>{String(copyInfo.resultCode)}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <strong>결과 메시지:</strong>
                      <span>{String(copyInfo.resultMessage)}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <strong>발급번호:</strong>
                      <span>{String(copyInfo.issueNo)}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <strong>부동산 유형:</strong>
                      <span>{String(copyInfo.propertyType)}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <strong>부동산 주소:</strong>
                      <span>{String(copyInfo.propertyAddress)}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <strong>소유자명:</strong>
                      <span>{String(copyInfo.ownerName)}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <strong>발급일:</strong>
                      <span>{String(copyInfo.issueDate)}</span>
                    </div>
                  </>
                );
              })()}
            </div>
            
            <div className={styles.rawData}>
              <h4>원본 데이터</h4>
              <pre className={styles.jsonData}>
                {JSON.stringify(realEstateCopy.realEstateJson, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}