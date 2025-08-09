'use client';

import { useState } from 'react';
import styles from './page.module.css';

interface TransactionItem {
  // 공통 필드
  dealAmount: string;
  buildYear: string;
  dealYear: string;
  dealMonth: string;
  dealDay: string;
  dealDate: string;
  jibun: string;
  floor: string;
  dealingGbn: string;
  buyerGbn: string;
  slerGbn: string;
  
  // 아파트 필드
  aptNm?: string;
  aptDong?: string;
  excluUseAr?: string;
  
  // 오피스텔 필드
  offiNm?: string;
  
  // 단독/다가구 필드
  mhouseNm?: string;
  plottageAr?: string;
  totalFloorAr?: string;
  houseType?: string;
  
  // 기타 필드
  umdNm?: string;
  sggNm?: string;
}

interface TransactionResponse {
  success: boolean;
  data: {
    items: {
      item: TransactionItem[];
    };
    numOfRows: string;
    pageNo: string;
    totalCount: string;
  };
  summary?: {
    dateRange: {
      startDate: string;
      endDate: string;
      totalMonths: number;
    };
    totalCount: number;
    apartmentCount: number;
    detachedHouseCount: number;
    officetelCount: number;
    rowHouseCount: number;
    collectedCount: number;
  };
}

export default function TransactionTestPage() {
  const [lawdCd, setLawdCd] = useState('41285'); // 일산동구
  const [dealYmd, setDealYmd] = useState('202507');
  const [numOfRows, setNumOfRows] = useState('1000');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TransactionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const params = new URLSearchParams({
        LAWD_CD: lawdCd,
        DEAL_YMD: dealYmd,
        numOfRows: numOfRows,
      });

      const response = await fetch(`/api/transaction/all?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API 요청 실패');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    return `${year}년 ${month}월`;
  };

  // 건물명 추출 함수
  const getBuildingName = (item: TransactionItem): string => {
    if (item.aptNm && item.aptNm.trim()) return item.aptNm;
    if (item.offiNm && item.offiNm.trim()) return item.offiNm;
    if (item.mhouseNm && item.mhouseNm.trim()) return item.mhouseNm;
    return '-';
  };

  // 면적 추출 함수
  const getArea = (item: TransactionItem): string => {
    if (item.excluUseAr && item.excluUseAr.trim()) return `${parseFloat(item.excluUseAr).toFixed(2)}㎡`;
    if (item.plottageAr && item.plottageAr.trim()) return `${parseFloat(item.plottageAr).toFixed(2)}㎡`;
    return '-';
  };

  // 거래금액 포맷팅 (만원 단위를 억 단위로 변환)
  const formatDealAmount = (dealAmount: string): string => {
    const amount = parseInt(dealAmount.replace(/,/g, ''));
    if (amount >= 10000) {
      const billion = Math.floor(amount / 10000);
      const million = amount % 10000;
      if (million === 0) {
        return `${billion}억원`;
      } else {
        return `${billion}억 ${million.toLocaleString()}만원`;
      }
    } else {
      return `${amount.toLocaleString()}만원`;
    }
  };

  // 주택 유형 판별 함수
  const getHouseType = (item: TransactionItem): string => {
    if (item.aptNm && item.aptNm.trim()) return '아파트';
    if (item.offiNm && item.offiNm.trim()) return '오피스텔';
    if (item.houseType === '다가구') return '단독/다가구';
    if (item.houseType === '다세대') return '연립다세대';
    return '기타';
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🏠 실거래가 통합 API 테스트</h1>
      
      <div className={styles.description}>
        <p>📋 <strong>4개 주택 유형 통합 조회:</strong> 아파트, 단독/다가구, 오피스텔, 연립다세대</p>
        <p>📅 <strong>범위 조회:</strong> DEAL_YMD 이후부터 현재까지의 모든 데이터를 자동 수집</p>
        <p>🔄 <strong>자동 페이지네이션:</strong> 각 월별로 모든 페이지를 자동으로 수집</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="lawdCd">지역코드 (LAWD_CD):</label>
          <input
            id="lawdCd"
            type="text"
            value={lawdCd}
            onChange={(e) => setLawdCd(e.target.value)}
            placeholder="예: 41285 (일산동구)"
            required
          />
          <small>법정동코드 5자리 (예: 41285=일산동구)</small>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="dealYmd">계약년월 (DEAL_YMD):</label>
          <input
            id="dealYmd"
            type="text"
            value={dealYmd}
            onChange={(e) => setDealYmd(e.target.value)}
            placeholder="예: 202404"
            pattern="[0-9]{6}"
            required
          />
          <small>📅 <strong>범위 조회:</strong> 입력한 월부터 현재까지의 모든 데이터를 자동으로 수집합니다</small>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="numOfRows">batchSize(numOfRows):</label>
          <input
            id="numOfRows"
            type="number"
            value={numOfRows}
            onChange={(e) => setNumOfRows(e.target.value)}
            min="1"
            max="10000"
            required
          />
          <small>한 번에 가져올 데이터 개수 (기본값: 1000)</small>
        </div>

        <button type="submit" disabled={loading} className={styles.submitButton}>
          {loading ? '🔍 데이터 수집 중...' : '🚀 API 호출'}
        </button>
      </form>

      {error && (
        <div className={styles.error}>
          <h3>❌ 오류 발생</h3>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className={styles.result}>
          <h2>📊 조회 결과</h2>
          
          {/* 요약 정보 */}
          {result.summary && (
            <div className={styles.summary}>
              <h3>📈 데이터 요약</h3>
              <div className={styles.summaryGrid}>
                <div className={styles.summaryItem}>
                  <strong>조회 기간:</strong>
                  <span>{formatDate(result.summary.dateRange.startDate)} ~ {formatDate(result.summary.dateRange.endDate)}</span>
                  <small>(총 {result.summary.dateRange.totalMonths}개월)</small>
                </div>
                <div className={styles.summaryItem}>
                  <strong>총 거래 건수:</strong>
                  <span>{result.summary.totalCount.toLocaleString()}건</span>
                </div>
                <div className={styles.summaryItem}>
                  <strong>아파트:</strong>
                  <span>{result.summary.apartmentCount.toLocaleString()}건</span>
                </div>
                <div className={styles.summaryItem}>
                  <strong>단독/다가구:</strong>
                  <span>{result.summary.detachedHouseCount.toLocaleString()}건</span>
                </div>
                <div className={styles.summaryItem}>
                  <strong>오피스텔:</strong>
                  <span>{result.summary.officetelCount.toLocaleString()}건</span>
                </div>
                <div className={styles.summaryItem}>
                  <strong>연립다세대:</strong>
                  <span>{result.summary.rowHouseCount.toLocaleString()}건</span>
                </div>
              </div>
            </div>
          )}

          {/* 상세 데이터 */}
          <div className={styles.details}>
            <h3>📋 상세 거래 내역</h3>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>거래일</th>
                    <th>주택유형</th>
                    <th>건물명</th>
                    <th>층</th>
                    <th>면적</th>
                    <th>거래금액</th>
                    <th>지번</th>
                    <th>거래구분</th>
                  </tr>
                </thead>
                <tbody>
                  {result.data.items.item?.map((item, index) => (
                    <tr key={index}>
                      <td>{item.dealDate}</td>
                      <td>
                        <span className={`${styles.houseType} ${styles[getHouseType(item).toLowerCase()]}`}>
                          {getHouseType(item)}
                        </span>
                      </td>
                      <td>{getBuildingName(item)}</td>
                      <td>{item.floor ? `${item.floor}층` : '-'}</td>
                      <td>{getArea(item)}</td>
                      <td className={styles.dealAmount}>{formatDealAmount(item.dealAmount)}</td>
                      <td>{item.jibun}</td>
                      <td>{item.dealingGbn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={styles.totalCount}>
              총 {result.data.totalCount}건의 거래 내역이 조회되었습니다.
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 