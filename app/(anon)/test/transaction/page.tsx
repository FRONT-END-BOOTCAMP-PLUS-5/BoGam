'use client';

import { useState } from 'react';
import styles from './page.module.css';

interface TransactionResponse {
  success: boolean;
  message: string;
  data?: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    transactionList: Array<{
      aptNm: string;
      buildYear: string;
      dealDate: string;
      deposit: string;
      excluUseAr: string;
      floor: string;
      jibun: string;
      monthlyRent: string;
      umdNm: string;
    }>;
    pagination: {
      numOfRows: string;
      pageNo: string;
      totalCount: string;
    };
  };
}

export default function TransactionTestPage() {
  const [formData, setFormData] = useState({
    LAWD_CD: '11680',
    DEAL_YMD: '202406',
    pageNo: '1',
    numOfRows: '10',
  });
  
  const [response, setResponse] = useState<TransactionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const params = new URLSearchParams({
        LAWD_CD: formData.LAWD_CD,
        DEAL_YMD: formData.DEAL_YMD,
        pageNo: formData.pageNo,
        numOfRows: formData.numOfRows,
      });

      const response = await fetch(`/api/real-estate/transaction?${params}`);
      const data = await response.json();
      
      setResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>실거래가 조회 테스트</h1>
        
        <form onSubmit={handleSubmit} className={styles.form}>
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
            type="submit" 
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? '조회 중...' : '실거래가 조회'}
          </button>
        </form>

        {error && (
          <div className={styles.error}>
            <h3>오류 발생</h3>
            <p>{error}</p>
          </div>
        )}

        {response && (
          <div className={styles.result}>
            <h3>조회 결과</h3>
            
            <div className={styles.responseInfo}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>성공 여부:</span>
                <span className={response.success ? styles.success : styles.failure}>
                  {response.success ? '성공' : '실패'}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>메시지:</span>
                <span>{response.message}</span>
              </div>
            </div>

            {response.data && (
              <>
                <div className={styles.headerInfo}>
                  <h4>응답 헤더</h4>
                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>결과 코드:</span>
                      <span>{response.data.header.resultCode}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>결과 메시지:</span>
                      <span>{response.data.header.resultMsg}</span>
                    </div>
                  </div>
                </div>

                <div className={styles.paginationInfo}>
                  <h4>페이지 정보</h4>
                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>페이지당 행 수:</span>
                      <span>{response.data.pagination.numOfRows}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>현재 페이지:</span>
                      <span>{response.data.pagination.pageNo}</span>
                    </div>
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>전체 건수:</span>
                      <span>{response.data.pagination.totalCount}</span>
                    </div>
                  </div>
                </div>

                {response.data.transactionList && response.data.transactionList.length > 0 && (
                  <div className={styles.transactionList}>
                    <h4>실거래가 목록 ({response.data.transactionList.length}건)</h4>
                    <div className={styles.tableContainer}>
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            <th>아파트명</th>
                            <th>건축년도</th>
                            <th>계약일</th>
                            <th>보증금</th>
                            <th>월세</th>
                            <th>전용면적</th>
                            <th>층</th>
                            <th>지번</th>
                            <th>법정동</th>
                          </tr>
                        </thead>
                        <tbody>
                          {response.data.transactionList.map((item, index) => (
                            <tr key={index}>
                              <td>{item.aptNm}</td>
                              <td>{item.buildYear}</td>
                                                             <td>{item.dealDate}</td>
                              <td>{item.deposit}</td>
                              <td>{item.monthlyRent}</td>
                              <td>{item.excluUseAr}</td>
                              <td>{item.floor}</td>
                              <td>{item.jibun}</td>
                              <td>{item.umdNm}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 