'use client';

import { useState } from 'react';
import styles from '@/(anon)/test/transaction/page.module.css';

interface OfficetelTransactionItem {
  buildYear: string;
  buyerGbn: string;
  cdealDay: string;
  cdealType: string;
  dealAmount: string;
  dealDay: string;
  dealMonth: string;
  dealYear: string;
  dealingGbn: string;
  estateAgentSggNm: string;
  excluUseAr: string;
  floor: string;
  jibun: string;
  offiNm: string;
  rgstDate: string;
  sggCd: string;
  sggNm: string;
  slerGbn: string;
  umdNm: string;
}

interface TransactionResponse {
  success: boolean;
  data: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items: {
        item: OfficetelTransactionItem[];
      };
      numOfRows: string;
      pageNo: string;
      totalCount: string;
    };
  };
}

export default function OfficetelTransactionTestPage() {
  const [formData, setFormData] = useState({
    LAWD_CD: '11680',
    DEAL_YMD: '202406',
    pageNo: '1',
    numOfRows: '10',
  });
  const [transactionList, setTransactionList] = useState<OfficetelTransactionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchTransactionData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        LAWD_CD: formData.LAWD_CD,
        DEAL_YMD: formData.DEAL_YMD,
        pageNo: formData.pageNo,
        numOfRows: formData.numOfRows,
      });

      const response = await fetch(`/api/transaction/officetel?${params}`);
      const data: TransactionResponse = await response.json();
      
      console.log('API Response:', data);
      
      if (data.success && data.data?.body?.items?.item) {
        setTransactionList(data.data.body.items.item);
      } else {
        setError('데이터 조회에 실패했습니다.');
        console.error('API Error:', data);
      }
    } catch (err) {
      setError('서버 오류가 발생했습니다.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>오피스텔 매매 실거래가 조회 테스트</h1>
      
      <div className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="LAWD_CD" className={styles.label}>
            지역코드 (LAWD_CD) *
          </label>
          <input
            type="text"
            id="LAWD_CD"
            name="LAWD_CD"
            value={formData.LAWD_CD}
            onChange={handleInputChange}
            className={styles.input}
            placeholder="예: 11680"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="DEAL_YMD" className={styles.label}>
            계약년월 (DEAL_YMD) *
          </label>
          <input
            type="text"
            id="DEAL_YMD"
            name="DEAL_YMD"
            value={formData.DEAL_YMD}
            onChange={handleInputChange}
            className={styles.input}
            placeholder="예: 202406"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="pageNo" className={styles.label}>
            페이지 번호 (pageNo)
          </label>
          <input
            type="number"
            id="pageNo"
            name="pageNo"
            value={formData.pageNo}
            onChange={handleInputChange}
            className={styles.input}
            placeholder="기본값: 1"
            min="1"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="numOfRows" className={styles.label}>
            페이지당 행 수 (numOfRows)
          </label>
          <input
            type="number"
            id="numOfRows"
            name="numOfRows"
            value={formData.numOfRows}
            onChange={handleInputChange}
            className={styles.input}
            placeholder="기본값: 10"
            min="1"
            max="100"
          />
        </div>

        <button
          onClick={fetchTransactionData}
          disabled={loading}
          className={styles.button}
        >
          {loading ? '조회 중...' : '오피스텔 실거래가 조회'}
        </button>
      </div>

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      {transactionList.length > 0 && (
        <div className={styles.tableContainer}>
          <h3>조회 결과: {transactionList.length}건</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>오피스텔명</th>
                <th>거래일</th>
                <th>거래금액</th>
                <th>전용면적</th>
                <th>층</th>
                <th>지번</th>
                <th>시군구</th>
                <th>읍면동</th>
                <th>거래구분</th>
                <th>매수자</th>
                <th>매도자</th>
                <th>건축년도</th>
              </tr>
            </thead>
            <tbody>
              {transactionList.map((item, index) => (
                <tr key={index}>
                  <td>{item.offiNm}</td>
                  <td>{`${item.dealYear}-${item.dealMonth.padStart(2, '0')}-${item.dealDay.padStart(2, '0')}`}</td>
                  <td>{item.dealAmount}</td>
                  <td>{item.excluUseAr}</td>
                  <td>{item.floor}</td>
                  <td>{item.jibun}</td>
                  <td>{item.sggNm}</td>
                  <td>{item.umdNm}</td>
                  <td>{item.dealingGbn}</td>
                  <td>{item.buyerGbn}</td>
                  <td>{item.slerGbn}</td>
                  <td>{item.buildYear}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 