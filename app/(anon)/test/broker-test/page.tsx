'use client';

import { useState } from 'react';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import { styles } from './page.styles';

interface BrokerCopyData {
  id: number;
  userAddressId: number;
  brokerData: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: BrokerCopyData;
}

export default function BrokerTestPage() {
  const { userAddresses, selectedAddress } = useUserAddressStore();
  const [userAddressNickname, setUserAddressNickname] = useState<string>('');
  const [brkrNm, setBrkrNm] = useState<string>('');
  const [bsnmCmpnm, setBsnmCmpnm] = useState<string>('');
  const [brokerData, setBrokerData] = useState<string>('');
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 중개사 복사본 조회
  const handleGetBrokerCopy = async () => {
    if (!userAddressNickname) {
      setApiResponse({ success: false, error: '사용자 주소 닉네임을 입력해주세요.' });
      return;
    }

    if (!brkrNm) {
      setApiResponse({ success: false, error: '중개업자명을 입력해주세요.' });
      return;
    }

    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        userAddressNickname,
        brkrNm
      });
      
      if (bsnmCmpnm) {
        params.append('bsnmCmpnm', bsnmCmpnm);
      }
      
      const response = await fetch(`/api/brokers?${params.toString()}`);
      const result: ApiResponse = await response.json();
      setApiResponse(result);
    } catch (error) {
      setApiResponse({ 
        success: false, 
        error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 중개사 복사본 존재 여부 확인
  const handleCheckExists = async () => {
    if (!userAddressNickname) {
      setApiResponse({ success: false, error: '사용자 주소 닉네임을 입력해주세요.' });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/brokers/exists?userAddressNickname=${encodeURIComponent(userAddressNickname)}`);
      const result: ApiResponse = await response.json();
      setApiResponse(result);
    } catch (error) {
      setApiResponse({ 
        success: false, 
        error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 중개사 복사본 생성/수정
  const handleCreateBrokerCopy = async () => {
    if (!userAddressNickname || !brokerData) {
      setApiResponse({ success: false, error: '사용자 주소 닉네임과 중개사 데이터를 모두 입력해주세요.' });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/copies/broker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userAddressId: selectedAddress?.id || 0,
          brokerJson: JSON.parse(brokerData)
        }),
      });
      const result: ApiResponse = await response.json();
      setApiResponse(result);
    } catch (error) {
      setApiResponse({ 
        success: false, 
        error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 중개사 복사본 DB 조회
  const handleGetBrokerCopyFromDB = async () => {
    if (!userAddressNickname) {
      setApiResponse({ success: false, error: '사용자 주소 닉네임을 입력해주세요.' });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/copies/broker?userAddressNickname=${encodeURIComponent(userAddressNickname)}`);
      const result: ApiResponse = await response.json();
      setApiResponse(result);
    } catch (error) {
      setApiResponse({ 
        success: false, 
        error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>중개사 복사본 테스트 페이지</h1>
      
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>사용자 주소 정보</h2>
                 <div className={styles.addressInfo}>
           <p className={styles.addressInfoText}><strong>선택된 주소:</strong> {selectedAddress?.nickname || '없음'}</p>
           <p className={styles.addressInfoText}><strong>주소 ID:</strong> {selectedAddress?.id || '없음'}</p>
           <p className={styles.addressInfoText}><strong>전체 주소 수:</strong> {userAddresses.length}</p>
         </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>중개사 복사본 조회</h2>
        <div className={styles.inputGroup}>
          <input
            type="text"
            value={userAddressNickname}
            onChange={(e) => setUserAddressNickname(e.target.value)}
            placeholder="사용자 주소 닉네임을 입력하세요"
            className={styles.input}
          />
          <input
            type="text"
            value={brkrNm}
            onChange={(e) => setBrkrNm(e.target.value)}
            placeholder="중개업자명을 입력하세요"
            className={styles.input}
          />
          <input
            type="text"
            value={bsnmCmpnm}
            onChange={(e) => setBsnmCmpnm(e.target.value)}
            placeholder="사업자상호를 입력하세요 (선택사항)"
            className={styles.input}
          />
          <button 
            onClick={handleGetBrokerCopy}
            disabled={isLoading}
            className={styles.button}
          >
            {isLoading ? '조회 중...' : '중개사 복사본 조회'}
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>중개사 복사본 존재 여부 확인</h2>
        <button 
          onClick={handleCheckExists}
          disabled={isLoading || !userAddressNickname}
          className={styles.button}
        >
          {isLoading ? '확인 중...' : '존재 여부 확인'}
        </button>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>중개사 복사본 DB 조회</h2>
        <button 
          onClick={handleGetBrokerCopyFromDB}
          disabled={isLoading || !userAddressNickname}
          className={styles.button}
        >
          {isLoading ? '조회 중...' : 'DB에서 중개사 복사본 조회'}
        </button>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>중개사 복사본 생성/수정</h2>
        <div className={styles.inputGroup}>
          <textarea
            value={brokerData}
            onChange={(e) => setBrokerData(e.target.value)}
            placeholder="중개사 JSON 데이터를 입력하세요 (예: {'name': '테스트 중개사'})"
            className={styles.textarea}
            rows={5}
          />
          <button 
            onClick={handleCreateBrokerCopy}
            disabled={isLoading || !brokerData}
            className={styles.button}
          >
            {isLoading ? '저장 중...' : '중개사 복사본 저장'}
          </button>
        </div>
      </div>

      {apiResponse && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>API 응답 결과</h2>
                     <div className={`${styles.response} ${apiResponse.success ? styles.success : styles.error}`}>
             <p className={styles.responseText}><strong>상태:</strong> {apiResponse.success ? '성공' : '실패'}</p>
             {apiResponse.message && <p className={styles.responseText}><strong>메시지:</strong> {apiResponse.message}</p>}
             {apiResponse.error && <p className={styles.responseText}><strong>에러:</strong> {apiResponse.error}</p>}
            {apiResponse.data && (
              <div>
                <p><strong>데이터:</strong></p>
                <pre className={styles.jsonData}>
                  {JSON.stringify(apiResponse.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
