'use client';

import { useState } from 'react';
import axios from 'axios';
import styles from './page.module.css';

interface RealEstateFormData {
  organization: string;
  phoneNo: string;
  password: string;
  sigunguCd: string;
  bjdongCd: string;
  platGbCd: string;
  bun: string;
  ji: string;
  dong: string;
  ho: string;
  issueType: string;
}

export default function RealEstateSearchTestPage() {
  const [formData, setFormData] = useState<RealEstateFormData>({
    organization: '0002',
    phoneNo: '01000000000',
    password: '1234',
    sigunguCd: '41135',
    bjdongCd: '25300',
    platGbCd: '0',
    bun: '0012',
    ji: '0004',
    dong: '',
    ho: '',
    issueType: '1'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingExisting, setIsCheckingExisting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  // 기존 데이터 확인
  const checkExistingData = async (userAddressId: number): Promise<boolean> => {
    try {
      setIsCheckingExisting(true);
      const response = await axios.post('/api/check-existing-data', {
        userAddressId,
        type: 'real-estate'
      });

      const data = response.data as { success: boolean; hasExistingData?: boolean; existingData?: any };
      if (data.success && data.hasExistingData) {
                  const existingData = data.existingData;
          const updatedAt = existingData.updatedAt ? new Date(existingData.updatedAt).toLocaleString() : '알 수 없음';
          
          return confirm(
            `이미 저장된 등기부등본이 있습니다.\n` +
            `마지막 업데이트: ${updatedAt}\n\n` +
            `기존 데이터를 새로운 데이터로 업데이트하시겠습니까?`
          );
      }
      
      return true; // 기존 데이터가 없으면 진행
    } catch (error) {
      console.error('기존 데이터 확인 실패:', error);
      // 에러가 발생해도 진행 (최악의 경우 백엔드에서 upsert 처리)
      return true;
    } finally {
      setIsCheckingExisting(false);
    }
  };

  const prepareFormData = (data: RealEstateFormData) => {
    return {
      ...data,
      userAddressId: 1 // 임시 테스트 값
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const requestData = prepareFormData(formData);
      
      // 기존 데이터 확인 및 사용자 확인
      const shouldProceed = await checkExistingData(requestData.userAddressId);
      if (!shouldProceed) {
        setIsLoading(false);
        return; // 사용자가 취소한 경우
      }

      console.log('=== 등기부등본 조회 요청 ===');
      console.log('요청 데이터:', requestData);

      const response = await axios.post('/api/real-estate/search/address', requestData);
      
      console.log('=== 등기부등본 조회 응답 ===');
      console.log('응답 데이터:', response.data);

      const responseData = response.data as { success: boolean; message?: string; data?: any };
      if (responseData.success) {
        setResult(responseData);
      } else {
        setError(responseData.message || '등기부등본 조회에 실패했습니다.');
      }
    } catch (err) {
      console.error('등기부등본 조회 오류:', err);
      setError('등기부등본 조회 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof RealEstateFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>등기부등본 조회 테스트</h1>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.row}>
          <div className={styles.field}>
            <label>시군구코드</label>
            <input
              type="text"
              value={formData.sigunguCd}
              onChange={(e) => handleInputChange('sigunguCd', e.target.value)}
              placeholder="41135"
            />
          </div>
          <div className={styles.field}>
            <label>법정동코드</label>
            <input
              type="text"
              value={formData.bjdongCd}
              onChange={(e) => handleInputChange('bjdongCd', e.target.value)}
              placeholder="25300"
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label>번</label>
            <input
              type="text"
              value={formData.bun}
              onChange={(e) => handleInputChange('bun', e.target.value)}
              placeholder="0012"
            />
          </div>
          <div className={styles.field}>
            <label>지</label>
            <input
              type="text"
              value={formData.ji}
              onChange={(e) => handleInputChange('ji', e.target.value)}
              placeholder="0004"
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label>동</label>
            <input
              type="text"
              value={formData.dong}
              onChange={(e) => handleInputChange('dong', e.target.value)}
              placeholder="동 (선택사항)"
            />
          </div>
          <div className={styles.field}>
            <label>호</label>
            <input
              type="text"
              value={formData.ho}
              onChange={(e) => handleInputChange('ho', e.target.value)}
              placeholder="호 (선택사항)"
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label>전화번호</label>
            <input
              type="text"
              value={formData.phoneNo}
              onChange={(e) => handleInputChange('phoneNo', e.target.value)}
              placeholder="01000000000"
            />
          </div>
          <div className={styles.field}>
            <label>비밀번호</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="4자리 숫자"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || isCheckingExisting}
          className={styles.submitButton}
        >
          {isCheckingExisting ? '확인 중...' : isLoading ? '조회 중...' : '등기부등본 조회'}
        </button>
      </form>

      {error && (
        <div className={styles.error}>
          ❌ {error}
        </div>
      )}

      {result && (
        <div className={styles.result}>
          <h2>조회 결과</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}