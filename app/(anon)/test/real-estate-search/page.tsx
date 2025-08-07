'use client';

import { useState } from 'react';
import axios from 'axios';
import styles from './page.module.css';

interface FormData {
  // 공통 필수 필드
  organization: string;
  phoneNo: string;
  password: string;
  inquiryType: string;
  issueType: string;
  
  // 도로명 주소 조회 필수 필드
  addr_sido: string;
  addr_sigungu: string;
  addr_roadName: string;
  addr_buildingNumber: string;
  
  // 집합건물용 선택 필드
  realtyType: string;
  dong: string;
  ho: string;
  
  // 추가 옵션
  jointMortgageJeonseYN: string;
  tradingYN: string;
  registerSummaryYN: string;
  originDataYN: string;
  electronicClosedYN: string;
  
  // 선불전자지급수단 (발급/열람 시 필수)
  ePrepayNo: string;
  ePrepayPass: string;
  
  // 사용자 주소 닉네임
  userAddressNickname: string;
}

export default function RealEstateSearchTestPage() {
  const [formData, setFormData] = useState<FormData>({
    // 공통 필수
    organization: '0002',
    phoneNo: '01000000000',
    password: '1234',
    inquiryType: '3', // 도로명주소로 찾기
    issueType: '0', // 발급
    
    // 도로명 주소 필수
    addr_sido: '서울특별시',
    addr_sigungu: '강남구',
    addr_roadName: '테헤란로',
    addr_buildingNumber: '123',
    
    // 집합건물 정보
    realtyType: '1', // 집합건물
    dong: '101',
    ho: '1502',
    
    // 추가 옵션
    jointMortgageJeonseYN: '0',
    tradingYN: '0',
    registerSummaryYN: '1',
    originDataYN: '0',
    electronicClosedYN: '0',
    
    // 선불전자지급수단
    ePrepayNo: '',
    ePrepayPass: '',
    
    // 사용자 주소 닉네임
    userAddressNickname: '채원강남집'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingExisting, setIsCheckingExisting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  // 기존 데이터 확인
  const checkExistingData = async (): Promise<boolean> => {
    try {
      setIsCheckingExisting(true);
      const response = await axios.get(`/api/real-estate/exists?nickname=채원강남집`);

      const data = response.data as { exists: boolean; updatedAt?: string };
      if (data.exists) {
        const updatedAt = data.updatedAt ? new Date(data.updatedAt).toLocaleString() : '알 수 없음';
        
        return confirm(
          `이미 저장된 등기부등본이 있습니다.\n` +
          `마지막 업데이트: ${updatedAt}\n\n` +
          `기존 데이터를 새로운 데이터로 업데이트하시겠습니까?`
        );
      }
      
      return true;
    } catch (error) {
      console.error('기존 데이터 확인 실패:', error);
      alert('⚠️ 기존 데이터 확인 중 오류가 발생했습니다.\n그래도 조회를 계속하시겠습니까?');
      return true; // 에러가 있어도 계속 진행
    } finally {
      setIsCheckingExisting(false);
    }
  };

  const validateForm = (): boolean => {
    // 필수 필드 검증
    if (!formData.organization || !formData.phoneNo || !formData.password) {
      setError('기관코드, 전화번호, 비밀번호는 필수 입력 항목입니다.');
      return false;
    }

    if (!formData.addr_sido || !formData.addr_sigungu || !formData.addr_roadName || !formData.addr_buildingNumber) {
      setError('시/도, 시군구, 도로명, 건물번호는 필수 입력 항목입니다.');
      return false;
    }

    // 전화번호 형식 검증
    const validPhonePrefixes = ['010', '011', '016', '017', '018', '019', '070', '02', '031', '032', '033', '041', '042', '043', '0502', '0505', '051', '052', '053', '054', '055', '061', '062', '063', '064'];
    const hasValidPrefix = validPhonePrefixes.some(prefix => formData.phoneNo.startsWith(prefix));
    if (!hasValidPrefix) {
      setError('전화번호가 올바른 형식이 아닙니다.');
      return false;
    }

    // 비밀번호 4자리 검증
    if (formData.password.length !== 4 || !/^\d{4}$/.test(formData.password)) {
      setError('비밀번호는 4자리 숫자여야 합니다.');
      return false;
    }

    // 집합건물인 경우 동 또는 호 중 하나 이상 필수
    if (formData.realtyType === '1' && !formData.dong && !formData.ho) {
      setError('집합건물의 경우 동 또는 호 중 하나 이상 입력해야 합니다.');
      return false;
    }

    // 발급/열람 시 선불전자지급수단 필수
    if (['0', '1'].includes(formData.issueType)) {
      if (!formData.ePrepayNo || !formData.ePrepayPass) {
        setError('발급/열람 시에는 선불전자지급수단 정보가 필수입니다.');
        return false;
      }
      if (formData.ePrepayNo.length !== 12) {
        setError('선불전자지급수단 번호는 12자리여야 합니다.');
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // 기존 데이터 확인 및 사용자 확인
      const shouldProceed = await checkExistingData();
      if (!shouldProceed) {
        setIsLoading(false);
        return;
      }

      console.log('=== 등기부등본 조회 요청 ===');
      console.log('요청 데이터:', formData);

      const response = await axios.post('/api/real-estate/search/road-address', formData);
      
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

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>등기부등본 조회 (도로명주소)</h1>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* 도로명 주소 정보 */}
        <div className={styles.formSection}>
          <h3>도로명 주소 정보</h3>
          
          <div className={styles.row}>
            <div className={styles.fieldGroup}>
              <label className={styles.required}>시/도 *</label>
              <input
                type="text"
                value={formData.addr_sido}
                onChange={(e) => handleInputChange('addr_sido', e.target.value)}
                placeholder="예: 서울특별시"
                className={styles.input}
                required
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.required}>시군구 *</label>
              <input
                type="text"
                value={formData.addr_sigungu}
                onChange={(e) => handleInputChange('addr_sigungu', e.target.value)}
                placeholder="예: 강남구"
                className={styles.input}
                required
              />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.fieldGroup}>
              <label className={styles.required}>도로명 *</label>
              <input
                type="text"
                value={formData.addr_roadName}
                onChange={(e) => handleInputChange('addr_roadName', e.target.value)}
                placeholder="예: 테헤란로"
                className={styles.input}
                required
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.required}>건물번호 *</label>
              <input
                type="text"
                value={formData.addr_buildingNumber}
                onChange={(e) => handleInputChange('addr_buildingNumber', e.target.value)}
                placeholder="예: 123"
                className={styles.input}
                required
              />
            </div>
          </div>
        </div>

        {/* 부동산 구분 및 동/호 */}
        <div className={styles.formSection}>
          <h3>부동산 정보</h3>
          <div className={styles.row}>
            <div className={styles.fieldGroup}>
              <label>부동산 구분</label>
              <select
                value={formData.realtyType}
                onChange={(e) => handleInputChange('realtyType', e.target.value)}
                className={styles.select}
              >
                <option value="1">집합건물</option>
                <option value="2">토지</option>
                <option value="3">건물</option>
              </select>
            </div>
          </div>
          {formData.realtyType === '1' && (
            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <label className={styles.conditionalRequired}>동 {!formData.ho ? '*' : ''}</label>
                <input
                  type="text"
                  value={formData.dong}
                  onChange={(e) => handleInputChange('dong', e.target.value)}
                  placeholder="예: 101동"
                  className={styles.input}
                />
                <span className={styles.fieldDescription}>
                  집합건물의 경우 동 또는 호 중 하나 이상 필수
                </span>
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.conditionalRequired}>호 {!formData.dong ? '*' : ''}</label>
                <input
                  type="text"
                  value={formData.ho}
                  onChange={(e) => handleInputChange('ho', e.target.value)}
                  placeholder="예: 1502호"
                  className={styles.input}
                />
              </div>
            </div>
          )}
        </div>

        {/* 발행 정보 */}
        <div className={styles.formSection}>
          <h3>발행 정보</h3>
          <div className={styles.row}>
            <div className={styles.fieldGroup}>
              <label className={styles.required}>발행구분 *</label>
              <select
                value={formData.issueType}
                onChange={(e) => handleInputChange('issueType', e.target.value)}
                className={styles.select}
                required
              >
                <option value="0">발급</option>
                <option value="1">열람</option>
                <option value="2">고유번호조회</option>
              </select>
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.required}>전화번호 *</label>
              <input
                type="tel"
                value={formData.phoneNo}
                onChange={(e) => handleInputChange('phoneNo', e.target.value)}
                placeholder="01000000000"
                className={styles.input}
                required
              />
              <span className={styles.fieldDescription}>
                010, 011, 016, 017, 018, 019, 070, 02, 031 등으로 시작
              </span>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.fieldGroup}>
              <label className={styles.required}>비밀번호 *</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="4자리 숫자"
                className={styles.input}
                maxLength={4}
                required
              />
              <span className={styles.fieldDescription}>
                재열람 시 사용되는 4자리 숫자
              </span>
            </div>
          </div>
        </div>

        {/* 선불전자지급수단 (발급/열람 시만 표시) */}
        {['0', '1'].includes(formData.issueType) && (
          <div className={styles.formSection}>
            <h3>선불전자지급수단 (전자민원캐시)</h3>
            <div className={styles.infoBox}>
              ⚠️ 발급/열람 시에는 전자민원캐시가 필요합니다.
            </div>
            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <label className={styles.required}>선불전자지급수단 번호 *</label>
                <input
                  type="text"
                  value={formData.ePrepayNo}
                  onChange={(e) => handleInputChange('ePrepayNo', e.target.value)}
                  placeholder="V7411736**** (12자리)"
                  className={styles.input}
                  maxLength={12}
                  required
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.required}>선불전자지급수단 비밀번호 *</label>
                <input
                  type="password"
                  value={formData.ePrepayPass}
                  onChange={(e) => handleInputChange('ePrepayPass', e.target.value)}
                  placeholder="비밀번호"
                  className={styles.input}
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* 추가 옵션 */}
        <div className={styles.formSection}>
          <h3>추가 옵션</h3>
          <div className={styles.row}>
            <div className={styles.fieldGroup}>
              <label>공동담보/전세목록 포함</label>
              <select
                value={formData.jointMortgageJeonseYN}
                onChange={(e) => handleInputChange('jointMortgageJeonseYN', e.target.value)}
                className={styles.select}
              >
                <option value="0">미포함</option>
                <option value="1">포함</option>
              </select>
              <span className={styles.fieldDescription}>
                포함 시 목록이 많으면 발급 불가할 수 있음
              </span>
            </div>
            <div className={styles.fieldGroup}>
              <label>매매목록 포함</label>
              <select
                value={formData.tradingYN}
                onChange={(e) => handleInputChange('tradingYN', e.target.value)}
                className={styles.select}
              >
                <option value="0">미포함</option>
                <option value="1">포함</option>
              </select>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.fieldGroup}>
              <label>등기사항요약 출력</label>
              <select
                value={formData.registerSummaryYN}
                onChange={(e) => handleInputChange('registerSummaryYN', e.target.value)}
                className={styles.select}
              >
                <option value="0">미출력</option>
                <option value="1">출력</option>
              </select>
            </div>
            <div className={styles.fieldGroup}>
              <label>원문Data 포함</label>
              <select
                value={formData.originDataYN}
                onChange={(e) => handleInputChange('originDataYN', e.target.value)}
                className={styles.select}
              >
                <option value="0">미포함</option>
                <option value="1">포함</option>
              </select>
            </div>
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
          <div className={styles.resultInfo}>
            <p><strong>조회 방식:</strong> 도로명주소로 찾기</p>
            <p><strong>상태:</strong> {result.success ? '✅ 성공' : '❌ 실패'}</p>
            {result.message && <p><strong>메시지:</strong> {result.message}</p>}
          </div>
          <pre className={styles.resultData}>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}

    </div>
  );
}