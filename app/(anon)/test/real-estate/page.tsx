'use client';

import { useState } from 'react';
import styles from './page.module.css';

interface ApiResponse {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
  error?: string;
  requiresTwoWayAuth?: boolean;
  twoWayInfo?: {
    jobIndex: number;
    threadIndex: number;
    jti: string;
    twoWayTimestamp: number;
    method?: string;
    extraInfo?: {
      resAddrList?: AddressListItem[];
    };
  };
  resAddrList?: AddressListItem[];
  savedRealEstateCopy?: {
    id: number;
    userAddressId: number;
    isUpdated: boolean;
  };
  warning?: string;
  resultCode?: string;
}

interface AddressListItem {
  resUserNm?: string; // 소유자
  commUniqueNo: string; // 부동산 고유번호
  commAddrLotNumber: string; // 부동산 소재지번 (상세 주소)
  resState: string; // 상태
  resType?: string; // 구분
}

export default function RealEstateSearchTest() {
  const [formData, setFormData] = useState({
    userAddressId: 1,
    password: '1234',
    address: '경기도 고양시 일산동구 위시티3로 111 207동 1901호',
    realtyType: '3',
    recordStatus: '0',
    startPageNo: '1',
    pageCount: '5', // 검색 결과 제한을 위해 줄임
    applicationType: '1', // 전유 포함으로 변경하여 더 구체적인 검색
    organization: '0002',
    phoneNo: '01011111111',
    inquiryType: '1', // 조회 구분 추가
    issueType: '1',
    joinMortgageJeonseYN: '0',
    tradingYN: '0',
    electronicClosedYN: '0',
    originDataYN: '0',
    warningSkipYN: '0',
    registerSummaryYN: '0',
    selectAddress: '0',
    isIdentityViewYn: '0',
  });

  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [twoWayLoading, setTwoWayLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] =
    useState<AddressListItem | null>(null);

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
    setSelectedAddress(null);

    try {
      const res = await fetch('/api/real-estate/search/address', {
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

  const handleTwoWayAuth = async () => {
    if (!selectedAddress || !response?.twoWayInfo) {
      alert('부동산을 선택해주세요.');
      return;
    }

    setTwoWayLoading(true);

    try {
      const twoWayRequest = {
        // 2-way 인증 필수 파라미터
        uniqueNo: selectedAddress.commUniqueNo,
        jobIndex: response.twoWayInfo.jobIndex,
        threadIndex: response.twoWayInfo.threadIndex,
        jti: response.twoWayInfo.jti,
        twoWayTimestamp: response.twoWayInfo.twoWayTimestamp,
        isTwoWayAuth: true, // 2-way 인증 요청 플래그

        // 원본 요청 파라미터들
        ...formData,
      };

      const res = await fetch('/api/real-estate/search/address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(twoWayRequest),
      });

      const data: ApiResponse = await res.json();
      setResponse(data);
    } catch (error) {
      setResponse({
        success: false,
        message: '2-way 인증 API 호출 중 오류가 발생했습니다.',
        error: error instanceof Error ? error.message : '알 수 없는 오류',
      });
    } finally {
      setTwoWayLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      userAddressId: 1,
      password: '1234',
      address: '경기도 고양시 일산동구 식사동 0 207동 1901호',
      realtyType: '3',
      recordStatus: '0',
      startPageNo: '1',
      pageCount: '5', // 검색 결과 제한을 위해 줄임
      applicationType: '0', // 전유 포함으로 변경하여 더 구체적인 검색
      organization: '0002',
      phoneNo: '01011111111',
      inquiryType: '1', // 조회 구분 추가
      issueType: '1',
      joinMortgageJeonseYN: '0',
      tradingYN: '0',
      electronicClosedYN: '0',
      originDataYN: '0',
      warningSkipYN: '0',
      registerSummaryYN: '0',
      selectAddress: '0',
      isIdentityViewYn: '0',
    });
    setResponse(null);
    setSelectedAddress(null);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        부동산등기부등본 조회 API 테스트 (2-way 인증 포함)
      </h1>

      <div className={styles.content}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.section}>
            <h2>필수 파라미터</h2>

            <div className={styles.field}>
              <label htmlFor='userAddressId'>사용자 주소 ID *</label>
              <input
                type='number'
                id='userAddressId'
                name='userAddressId'
                value={formData.userAddressId}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor='password'>비밀번호 (4자리 숫자) *</label>
              <input
                type='password'
                id='password'
                name='password'
                value={formData.password}
                onChange={handleInputChange}
                pattern='[0-9]{4}'
                maxLength={4}
                placeholder='0000'
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor='address'>검색 주소 (최소 3자리) *</label>
              <input
                type='text'
                id='address'
                name='address'
                value={formData.address}
                onChange={handleInputChange}
                placeholder='예: 강남대로'
                minLength={3}
                required
              />
            </div>
          </div>

          <div className={styles.section}>
            <h2>부동산 정보</h2>

            <div className={styles.field}>
              <label htmlFor='realtyType'>부동산 구분</label>
              <input
                type='text'
                id='realtyType'
                name='realtyType'
                value={formData.realtyType}
                disabled
                className={styles.disabledField}
              />
              <small>건물로 고정됨</small>
            </div>

            <div className={styles.field}>
              <label htmlFor='recordStatus'>등기기록상태</label>
              <select
                id='recordStatus'
                name='recordStatus'
                value={formData.recordStatus}
                onChange={handleInputChange}
              >
                <option value='0'>현행</option>
                <option value='1'>폐쇄</option>
                <option value='2'>현행+폐쇄</option>
              </select>
            </div>
          </div>

          <div className={styles.section}>
            <h2>페이지 설정</h2>

            <div className={styles.field}>
              <label htmlFor='startPageNo'>시작 페이지 번호</label>
              <input
                type='number'
                id='startPageNo'
                name='startPageNo'
                value={formData.startPageNo}
                onChange={handleInputChange}
                min='1'
              />
            </div>

            <div className={styles.field}>
              <label htmlFor='pageCount'>조회 페이지 수 (1-100)</label>
              <input
                type='number'
                id='pageCount'
                name='pageCount'
                value={formData.pageCount}
                onChange={handleInputChange}
                min='1'
                max='100'
              />
            </div>

            <div className={styles.field}>
              <label htmlFor='applicationType'>신청구분</label>
              <select
                id='applicationType'
                name='applicationType'
                value={formData.applicationType}
                onChange={handleInputChange}
              >
                <option value='0'>전유 제외</option>
                <option value='1'>전유 포함</option>
              </select>
            </div>
          </div>

          <div className={styles.section}>
            <h2>옵션 설정</h2>

            <div className={styles.field}>
              <label htmlFor='joinMortgageJeonseYN'>
                공동담보/전세목록 포함
              </label>
              <select
                id='joinMortgageJeonseYN'
                name='joinMortgageJeonseYN'
                value={formData.joinMortgageJeonseYN}
                onChange={handleInputChange}
              >
                <option value='0'>미포함</option>
                <option value='1'>포함</option>
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor='tradingYN'>매매목록 포함</label>
              <select
                id='tradingYN'
                name='tradingYN'
                value={formData.tradingYN}
                onChange={handleInputChange}
              >
                <option value='0'>미포함</option>
                <option value='1'>포함</option>
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor='registerSummaryYN'>등기사항요약 출력</label>
              <select
                id='registerSummaryYN'
                name='registerSummaryYN'
                value={formData.registerSummaryYN}
                onChange={handleInputChange}
              >
                <option value='0'>미출력</option>
                <option value='1'>출력</option>
              </select>
            </div>
          </div>

          <div className={styles.buttons}>
            <button
              type='submit'
              disabled={loading}
              className={styles.submitButton}
            >
              {loading ? '요청 중...' : 'API 호출'}
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
                {response.resultCode && (
                  <span className={styles.resultCode}>
                    코드: {response.resultCode}
                  </span>
                )}
              </div>

              <div className={styles.message}>
                <strong>메시지:</strong> {response.message}
              </div>

              {response.error && (
                <div className={styles.error}>
                  <strong>오류:</strong> {response.error}
                </div>
              )}

              {/* 3단계: CF-03002 응답 시 부동산 목록 표시 및 선택 */}

              {response.requiresTwoWayAuth &&
                response.resAddrList &&
                response.resAddrList.length > 0 && (
                  <div className={styles.twoWaySection}>
                    <h3>🔍 3단계: 부동산 목록에서 선택하세요</h3>
                    <p className={styles.sectionDescription}>
                      아래 부동산 목록에서 조회하고자 하는 부동산을 클릭하여
                      선택하세요. 선택된 부동산의 고유번호가 4단계 2-way 인증
                      요청에 포함됩니다.
                    </p>

                    <div className={styles.addressList}>
                      {response.resAddrList.map((addr, index) => (
                        <div
                          key={index}
                          className={`${styles.addressItem} ${
                            selectedAddress?.commUniqueNo === addr.commUniqueNo
                              ? styles.selected
                              : ''
                          }`}
                          onClick={() => setSelectedAddress(addr)}
                        >
                          <div className={styles.addressText}>
                            <strong>📍 상세 주소:</strong>{' '}
                            {addr.commAddrLotNumber}
                          </div>
                          <div className={styles.uniqueNo}>
                            <strong>🔑 부동산 고유번호:</strong>{' '}
                            {addr.commUniqueNo}
                          </div>
                          {addr.resUserNm && (
                            <div className={styles.owner}>
                              <strong>👤 소유자:</strong> {addr.resUserNm}
                            </div>
                          )}
                          {selectedAddress?.commUniqueNo ===
                            addr.commUniqueNo && (
                            <div className={styles.selectedIndicator}>
                              ✅ 선택됨
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {selectedAddress && (
                      <div className={styles.twoWayInfo}>
                        <h4>📋 4단계: 선택된 부동산 정보</h4>
                        <div className={styles.selectedAddressInfo}>
                          <p>
                            <strong>📍 상세 주소:</strong>{' '}
                            {selectedAddress.commAddrLotNumber}
                          </p>
                          <p>
                            <strong>🔑 부동산 고유번호:</strong>{' '}
                            {selectedAddress.commUniqueNo}
                            <span className={styles.uniqueNoNote}>
                              (이 고유번호가 2-way 인증 요청에 포함됩니다)
                            </span>
                          </p>
                          {selectedAddress.resUserNm && (
                            <p>
                              <strong>👤 소유자:</strong>{' '}
                              {selectedAddress.resUserNm}
                            </p>
                          )}
                        </div>

                        <div className={styles.twoWayRequestInfo}>
                          <h5>📤 2-way 인증 요청 파라미터</h5>
                          <ul>
                            <li>
                              <strong>uniqueNo:</strong>{' '}
                              {selectedAddress.commUniqueNo}
                            </li>
                            <li>
                              <strong>jobIndex:</strong>{' '}
                              {response.twoWayInfo?.jobIndex}
                            </li>
                            <li>
                              <strong>threadIndex:</strong>{' '}
                              {response.twoWayInfo?.threadIndex}
                            </li>
                            <li>
                              <strong>jti:</strong> {response.twoWayInfo?.jti}
                            </li>
                            <li>
                              <strong>twoWayTimestamp:</strong>{' '}
                              {response.twoWayInfo?.twoWayTimestamp}
                            </li>
                          </ul>
                        </div>

                        <button
                          onClick={handleTwoWayAuth}
                          disabled={twoWayLoading}
                          className={styles.twoWayButton}
                        >
                          {twoWayLoading
                            ? '🔄 2-way 인증 요청 중...'
                            : '🚀 2-way 인증 요청'}
                        </button>
                      </div>
                    )}
                  </div>
                )}

              {response.twoWayInfo && !response.requiresTwoWayAuth && (
                <div className={styles.twoWayInfo}>
                  <h4>2-way 인증 정보</h4>
                  <ul>
                    <li>
                      <strong>Method:</strong> {response.twoWayInfo.method}
                    </li>
                    <li>
                      <strong>Job Index:</strong> {response.twoWayInfo.jobIndex}
                    </li>
                    <li>
                      <strong>Thread Index:</strong>{' '}
                      {response.twoWayInfo.threadIndex}
                    </li>
                    <li>
                      <strong>JTI:</strong> {response.twoWayInfo.jti}
                    </li>
                    <li>
                      <strong>Timestamp:</strong>{' '}
                      {response.twoWayInfo.twoWayTimestamp}
                    </li>
                  </ul>
                </div>
              )}

              {response.savedRealEstateCopy && (
                <div className={styles.dbInfo}>
                  <strong>DB 저장 정보:</strong>
                  <ul>
                    <li>ID: {response.savedRealEstateCopy.id}</li>
                    <li>
                      사용자 주소 ID:{' '}
                      {response.savedRealEstateCopy.userAddressId}
                    </li>
                    <li>
                      업데이트 여부:{' '}
                      {response.savedRealEstateCopy.isUpdated ? '예' : '아니오'}
                    </li>
                  </ul>
                </div>
              )}

              {response.warning && (
                <div className={styles.warning}>
                  <strong>경고:</strong> {response.warning}
                </div>
              )}

              {response.data && (
                <div className={styles.data}>
                  <strong>응답 데이터:</strong>
                  <pre>{JSON.stringify(response.data, null, 2)}</pre>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
