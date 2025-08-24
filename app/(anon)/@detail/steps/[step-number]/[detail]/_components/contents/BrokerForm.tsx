'use client';

import React, { useState } from 'react';
import styles from './BrokerForm.styles';
import TextBadge from '../TextBadge';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';

interface BrokerFormData {
  businessName: string;
  agentName: string;
  description: string;
}

interface BrokerFormProps {
  title?: string;
  data: BrokerFormData[];
}

interface BrokerData {
  brkrAsortCodeNm: string;
  brkrAsortCode: string;
  jurirno: string;
  crqfcAcqdt: string;
  ofcpsSeCodeNm: string;
  ofcpsSeCode: string;
  brkrNm: string;
  lastUpdtDt: string;
  IdCodeNm: string;
  IdCode: string;
  crqfcNo: string;
  bsnmCmpnm: string;
}

interface BrokerResult {
  type: 'match' | 'mismatch' | 'unchecked';
  message: string;
  data?: BrokerData | BrokerData[];
}

export default function BrokerForm({ title, data }: BrokerFormProps) {
  const [businessName, setBusinessName] = useState('');
  const [agentName, setAgentName] = useState('');
  const [result, setResult] = useState<BrokerResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const selectedAddress = useUserAddressStore((state) => state.selectedAddress);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!businessName.trim() || !agentName.trim()) {
      alert('사업자 상호와 중개업자명을 모두 입력해주세요.');
      return;
    }

    setIsLoading(true);
    
    try {
      if (!selectedAddress?.nickname) {
        setResult({
          type: 'mismatch',
          message: '사용자 주소 정보를 찾을 수 없습니다. 주소를 먼저 선택해주세요.',
        });
        setIsLoading(false);
        return;
      }

      const params = new URLSearchParams({
        brkrNm: agentName.trim(),
        bsnmCmpnm: businessName.trim(),
        userAddressNickname: selectedAddress.nickname,
        numOfRows: '10',
        pageNo: '1'
      });
      
      const response = await fetch(`/api/brokers?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseText = await response.text();
      
      if (!responseText) {
        throw new Error('Empty response from server');
      }

      const responseData: { success: boolean; data?: BrokerData | BrokerData[] } = JSON.parse(responseText);
      
      if (responseData.success && responseData.data && (Array.isArray(responseData.data) ? responseData.data.length > 0 : responseData.data)) {
        setResult({
          type: 'match',
          message: '입력하신 중개업자명과 사업자상호로 임대인을 찾았습니다.',
          data: responseData.data
        });
      } else {
        setResult({
          type: 'mismatch',
          message: `입력하신 중개업자명과 사업자상호로 임대인을 찾을 수 없습니다.`,
        });
      }
    } catch (error) {
      setResult({
        type: 'mismatch',
        message: `입력하신 중개업자명과 사업자상호로 임대인을 찾을 수 없습니다.`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {title && <h2 className={styles.title}>{title}</h2>}
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="businessName" className={styles.label}>
            사업자 상호
          </label>
          <input
            id="businessName"
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className={styles.input}
            placeholder="사업자 상호를 입력하세요"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="agentName" className={styles.label}>
            중개업자명
          </label>
          <input
            id="agentName"
            type="text"
            value={agentName}
            onChange={(e) => setAgentName(e.target.value)}
            className={styles.input}
            placeholder="중개업자명을 입력하세요"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={styles.submitButton}
        >
          {isLoading ? '조회 중...' : '입력 제출'}
        </button>
      </form>

      {data[0]?.description && (
        <p className={styles.description}>{data[0].description}</p>
      )}

      {result && (
        <div className={`${styles.resultContainer} ${
          result.type === 'match' ? styles.resultSuccess : styles.resultWarning
        }`}>
          <div className="flex items-center justify-center gap-3 mb-3">
            <TextBadge type={result.type} size="md" />
          </div>
          <p className={styles.resultText}>{result.message}</p>
          
          {result.type === 'match' && result.data && (
            <div className="mt-4 p-3 bg-white rounded border">
              <h4 className="font-semibold mb-2">조회 결과:</h4>
              <div className="space-y-2 text-sm">
                {Array.isArray(result.data) ? (
                  result.data.map((broker, index) => (
                    <div key={index} className="border-b border-gray-200 pb-2 last:border-b-0">
                      <h5 className="font-medium text-brand mb-2">중개업자 정보 {index + 1}</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div><span className="font-medium">중개업자종별:</span> {broker.brkrAsortCodeNm} ({broker.brkrAsortCode})</div>
                        <div><span className="font-medium">등록번호:</span> {broker.jurirno || '정보없음'}</div>
                        <div><span className="font-medium">자격증취득일:</span> {broker.crqfcAcqdt || '정보없음'}</div>
                        <div><span className="font-medium">직위구분:</span> {broker.ofcpsSeCodeNm} ({broker.ofcpsSeCode})</div>
                        <div><span className="font-medium">중개업자명:</span> {broker.brkrNm}</div>
                        <div><span className="font-medium">데이터기준일자:</span> {broker.lastUpdtDt}</div>
                        <div><span className="font-medium">시군구:</span> {broker.IdCodeNm} ({broker.IdCode})</div>
                        <div><span className="font-medium">자격증번호:</span> {broker.crqfcNo || '정보없음'}</div>
                        <div><span className="font-medium">사업자상호:</span> {broker.bsnmCmpnm}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="space-y-2">
                    <div><span className="font-medium">중개업자종별:</span> {result.data.brkrAsortCodeNm} ({result.data.brkrAsortCode})</div>
                    <div><span className="font-medium">등록번호:</span> {result.data.jurirno || '정보없음'}</div>
                    <div><span className="font-medium">자격증취득일:</span> {result.data.crqfcAcqdt || '정보없음'}</div>
                    <div><span className="font-medium">직위구분:</span> {result.data.ofcpsSeCodeNm} ({result.data.ofcpsSeCode})</div>
                    <div><span className="font-medium">중개업자명:</span> {result.data.brkrNm}</div>
                    <div><span className="font-medium">데이터기준일자:</span> {result.data.lastUpdtDt}</div>
                    <div><span className="font-medium">시군구:</span> {result.data.IdCodeNm} ({result.data.IdCode})</div>
                    <div><span className="font-medium">자격증번호:</span> {result.data.crqfcNo || '정보없음'}</div>
                    <div><span className="font-medium">사업자상호:</span> {result.data.bsnmCmpnm}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
