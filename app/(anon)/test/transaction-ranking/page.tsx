'use client';

import { useState } from 'react';
import styles from './page.module.css';

interface ApiResponse {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
  sortedData?: Array<{
    item: {
      aptNm?: string;
      jibun?: string;
      floor?: string;
      excluUseAr?: string;
      dealYear: string;
      dealMonth: string;
      dealDay: string;
    };
    score: number;
    reasons: string[];
  }>;
  userAddressInfo?: {
    address: string;
    dong?: string;
    ho?: string;
    latitude?: number;
    longitude?: number;
    prefArea?: number;
  };
  error?: string;
}

export default function TransactionRankingTest() {
  const [formData, setFormData] = useState({
    // 실거래가 API 파라미터
    LAWD_CD: '11110', // 강남구
    DEAL_YMD: '202401', // 2024년 1월
    numOfRows: '20',
    pageNo: '1',

    // 사용자 주소 정보
    userAddress: '서울특별시 강남구 테헤란로 123',
    userDong: '101',
    userHo: '1503',
    userLatitude: '37.5665',
    userLongitude: '126.9780',
    userPrefArea: '84.95',
  });

  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch('/api/transaction/apartment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data: ApiResponse = await res.json();
      setResponse(data);
    } catch (error) {
      setResponse({
        success: false,
        message: 'API 호출 중 오류가 발생했습니다.',
        error: error instanceof Error ? error.message : '알 수 없는 오류',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      LAWD_CD: '11110',
      DEAL_YMD: '202401',
      numOfRows: '20',
      pageNo: '1',
      userAddress: '서울특별시 강남구 테헤란로 123',
      userDong: '101',
      userHo: '1503',
      userLatitude: '37.5665',
      userLongitude: '126.9780',
      userPrefArea: '84.95',
    });
    setResponse(null);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>실거래가 정렬 테스트</h1>

      <div className={styles.content}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.section}>
            <h2>실거래가 API 파라미터</h2>

            <div className={styles.field}>
              <label htmlFor='LAWD_CD'>법정동코드 *</label>
              <input
                type='text'
                id='LAWD_CD'
                name='LAWD_CD'
                value={formData.LAWD_CD}
                onChange={handleInputChange}
                placeholder='예: 11110 (강남구)'
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor='DEAL_YMD'>계약년월 *</label>
              <input
                type='text'
                id='DEAL_YMD'
                name='DEAL_YMD'
                value={formData.DEAL_YMD}
                onChange={handleInputChange}
                placeholder='예: 202401'
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor='numOfRows'>조회 건수</label>
              <input
                type='number'
                id='numOfRows'
                name='numOfRows'
                value={formData.numOfRows}
                onChange={handleInputChange}
                min='1'
                max='100'
              />
            </div>

            <div className={styles.field}>
              <label htmlFor='pageNo'>페이지 번호</label>
              <input
                type='number'
                id='pageNo'
                name='pageNo'
                value={formData.pageNo}
                onChange={handleInputChange}
                min='1'
              />
            </div>
          </div>

          <div className={styles.section}>
            <h2>사용자 주소 정보 (정렬용)</h2>

            <div className={styles.field}>
              <label htmlFor='userAddress'>주소</label>
              <input
                type='text'
                id='userAddress'
                name='userAddress'
                value={formData.userAddress}
                onChange={handleInputChange}
                placeholder='예: 서울특별시 강남구 테헤란로 123'
              />
            </div>

            <div className={styles.field}>
              <label htmlFor='userDong'>동</label>
              <input
                type='text'
                id='userDong'
                name='userDong'
                value={formData.userDong}
                onChange={handleInputChange}
                placeholder='예: 101'
              />
            </div>

            <div className={styles.field}>
              <label htmlFor='userHo'>호</label>
              <input
                type='text'
                id='userHo'
                name='userHo'
                value={formData.userHo}
                onChange={handleInputChange}
                placeholder='예: 1503'
              />
            </div>

            <div className={styles.field}>
              <label htmlFor='userLatitude'>위도</label>
              <input
                type='number'
                id='userLatitude'
                name='userLatitude'
                value={formData.userLatitude}
                onChange={handleInputChange}
                step='0.0001'
                placeholder='예: 37.5665'
              />
            </div>

            <div className={styles.field}>
              <label htmlFor='userLongitude'>경도</label>
              <input
                type='number'
                id='userLongitude'
                name='userLongitude'
                value={formData.userLongitude}
                onChange={handleInputChange}
                step='0.0001'
                placeholder='예: 126.9780'
              />
            </div>

            <div className={styles.field}>
              <label htmlFor='userPrefArea'>선호 면적 (m²)</label>
              <input
                type='number'
                id='userPrefArea'
                name='userPrefArea'
                value={formData.userPrefArea}
                onChange={handleInputChange}
                step='0.01'
                placeholder='예: 84.95'
              />
            </div>
          </div>

          <div className={styles.buttons}>
            <button
              type='submit'
              disabled={loading}
              className={styles.submitButton}
            >
              {loading ? '요청 중...' : '실거래가 조회 및 정렬'}
            </button>
            <button
              type='button'
              onClick={handleReset}
              className={styles.resetButton}
            >
              초기화
            </button>
          </div>
        </form>

        {response && (
          <div className={styles.response}>
            <h2>응답 결과</h2>
            <div
              className={`${styles.result} ${
                response.success ? styles.success : styles.error
              }`}
            >
              <div className={styles.resultHeader}>
                <span className={styles.status}>
                  {response.success ? '✅ 성공' : '❌ 실패'}
                </span>
              </div>

              <div className={styles.message}>
                <strong>메시지:</strong> {response.message}
              </div>

              {response.error && (
                <div className={styles.error}>
                  <strong>오류:</strong> {response.error}
                </div>
              )}

              {response.userAddressInfo && (
                <div className={styles.userAddressInfo}>
                  <h3>사용자 주소 정보</h3>
                  <ul>
                    <li>
                      <strong>주소:</strong> {response.userAddressInfo.address}
                    </li>
                    {response.userAddressInfo.dong && (
                      <li>
                        <strong>동:</strong> {response.userAddressInfo.dong}
                      </li>
                    )}
                    {response.userAddressInfo.ho && (
                      <li>
                        <strong>호:</strong> {response.userAddressInfo.ho}
                      </li>
                    )}
                    {response.userAddressInfo.latitude && (
                      <li>
                        <strong>위도:</strong>{' '}
                        {response.userAddressInfo.latitude}
                      </li>
                    )}
                    {response.userAddressInfo.longitude && (
                      <li>
                        <strong>경도:</strong>{' '}
                        {response.userAddressInfo.longitude}
                      </li>
                    )}
                    {response.userAddressInfo.prefArea && (
                      <li>
                        <strong>선호 면적:</strong>{' '}
                        {response.userAddressInfo.prefArea}m²
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {response.sortedData && response.sortedData.length > 0 && (
                <div className={styles.sortedData}>
                  <h3>
                    정렬된 실거래가 데이터 (상위 {response.sortedData.length}개)
                  </h3>
                  <div className={styles.sortedList}>
                    {response.sortedData.map((item, index) => (
                      <div key={index} className={styles.sortedItem}>
                        <div className={styles.itemHeader}>
                          <span className={styles.rank}>#{index + 1}</span>
                          <span className={styles.score}>
                            점수: {item.score.toFixed(1)}
                          </span>
                        </div>

                        <div className={styles.itemDetails}>
                          <div>
                            <strong>단지명:</strong> {item.item.aptNm || 'N/A'}
                          </div>
                          <div>
                            <strong>지번:</strong> {item.item.jibun || 'N/A'}
                          </div>
                          <div>
                            <strong>층:</strong> {item.item.floor || 'N/A'}
                          </div>
                          <div>
                            <strong>면적:</strong>{' '}
                            {item.item.excluUseAr || 'N/A'}m²
                          </div>
                          <div>
                            <strong>계약일:</strong> {item.item.dealYear}-
                            {item.item.dealMonth}-{item.item.dealDay}
                          </div>
                        </div>

                        {item.reasons.length > 0 && (
                          <div className={styles.reasons}>
                            <strong>점수 상세:</strong>
                            <ul>
                              {item.reasons.map((reason, reasonIndex) => (
                                <li key={reasonIndex}>{reason}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {response.data && (
                <div className={styles.rawData}>
                  <h3>원본 실거래가 데이터</h3>
                  <details>
                    <summary>데이터 보기</summary>
                    <pre>{JSON.stringify(response.data, null, 2)}</pre>
                  </details>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
