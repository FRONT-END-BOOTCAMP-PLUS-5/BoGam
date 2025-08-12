'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

interface ApiResult {
  success: boolean;
  data?: unknown;
  error?: string;
  message?: string;
}

interface DanJiSerialNumber {
  commBuildingCode: string;
  resBuildingName: string;
  commAddrLotNumber: string;
  resBunji: string;
  commAddrRoadName: string;
}

interface FormData {
  [key: string]: string | number | boolean;
}

export default function ApiTestPage() {
  const [results, setResults] = useState<Record<string, ApiResult>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState<Record<string, FormData>>({});
  const [showForms, setShowForms] = useState<Record<string, boolean>>({});
  const [selectedDanJi, setSelectedDanJi] = useState<DanJiSerialNumber | null>(
    null
  );

  const updateResult = (apiName: string, result: ApiResult) => {
    setResults((prev) => ({ ...prev, [apiName]: result }));

    // 단지 일련번호 조회 성공 시 첫 번째 단지를 자동 선택
    if (apiName === '단지 일련번호 조회' && result.success && result.data) {
      const responseData = result.data as { data?: DanJiSerialNumber[] };
      if (responseData.data && responseData.data.length > 0) {
        setSelectedDanJi(responseData.data[0]);
        // 실거래가 상세 폼 데이터에 자동 적용
        applyDanjiToTransactionForm(responseData.data[0]);
      }
    }
  };

  const setLoadingState = (apiName: string, isLoading: boolean) => {
    setLoading((prev) => ({ ...prev, [apiName]: isLoading }));
  };

  const updateFormData = (
    apiName: string,
    field: string,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [apiName]: { ...prev[apiName], [field]: value },
    }));
  };

  const toggleForm = (apiName: string) => {
    setShowForms((prev) => ({ ...prev, [apiName]: !prev[apiName] }));
  };

  // 선택된 단지 데이터를 실거래가 상세 폼에 적용
  const applyDanjiToTransactionForm = (danji: DanJiSerialNumber) => {
    const apartFormData = {
      organization: '0010',
      apartType: '0', // 아파트
      buildingCode: danji.commBuildingCode, // 단지 일련번호 조회에서 받은 건물코드
      contractYear: '2024',
      contractType: '0', // 전체
    };

    setFormData((prev) => ({
      ...prev,
      '통합 실거래가 상세 (아파트)': apartFormData,
    }));

    // 폼을 자동으로 표시
    setShowForms((prev) => ({
      ...prev,
      '통합 실거래가 상세 (아파트)': true,
    }));
  };

  // 단지 선택 함수
  const selectDanji = (danji: DanJiSerialNumber) => {
    setSelectedDanJi(danji);
    applyDanjiToTransactionForm(danji);
  };

  const getDefaultFormData = (apiName: string) => {
    const defaults: Record<string, FormData> = {
      '통합 실거래가 상세 (아파트)': {
        organization: '0010',
        apartType: '0',
        buildingCode: '12345',
        contractYear: '2024',
        contractType: '0',
      },
      '통합 실거래가 상세 (단독/다가구)': {
        organization: '0010',
        addrSido: '서울특별시',
        addrSigungu: '강남구',
        addrDong: '역삼동',
        contractYear: '2024',
        contractType: '0',
      },
      '단지 일련번호 조회': {
        organization: '0010',
        year: '2024',
        type: '0',
        searchGbn: '0',
        addrSido: '서울특별시',
        addrSigungu: '강남구',
        addrDong: '역삼동',
        complexName: '테스트단지',
      },
      '단지목록 조회': {
        organization: '0010',
        addrSido: '서울특별시',
        addrSigun: '강남구',
        addrDong: '역삼동',
      },
      '부동산 공시가격': {
        organization: '0010',
        addrSearchType: '0',
        addrSiGunGu: '강남구',
        addrDong: '역삼동',
        addrLotNumber: '123-45',
      },
      '공동주택 공시가격': {
        organization: '0010',
        addrSearchType: '0',
        addrSido: '서울특별시',
        addrSiGunGu: '강남구',
        addrDong: '역삼동',
        addrLotNumber: '123-45',
      },
      '시세정보 조회': {
        organization: '0010',
        searchGbn: '1',
        complexNo: '12345',
      },
      '단계 결과 생성': {
        userAddressId: 1,
        stepId: 1,
        mainNum: 1,
        subNum: 1,
        mismatch: 0,
        match: 5,
        unchecked: 0,
      },
      '납세증명서 발급': {
        organization: '0001',
        loginType: '0',
        isIdentityViewYN: 'Y',
        proofType: '0',
        submitTargets: '0',
        userAddressNickname: 'test',
        certType: '0',
        certFile: 'base64_encoded_cert',
        keyFile: 'base64_encoded_key',
        certPassword: 'encrypted_password',
      },
      '주소로 등기부등본 조회': {
        password: 'encrypted_password',
        address: '서울특별시 강남구 역삼동 123-45',
        realtyType: '0',
        userAddressNickname: 'test',
      },
      '고유번호로 등기부등본 조회': {
        password: '1234',
        uniqueNo: '12345678901234',
        inquiryType: '0',
        userAddressNickname: 'test',
      },
      '사용자 주소 추가': {
        latitude: 37.5665,
        longitude: 126.978,
        legalDistrictCode: '11680',
        dong: '역삼동',
        ho: '123-45',
      },
      '대표 주소 변경': {
        userAddressId: 1,
      },
    };
    return defaults[apiName] || {};
  };

  const callApi = async (
    apiName: string,
    url: string,
    options: RequestInit = {}
  ) => {
    setLoadingState(apiName, true);
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();
      updateResult(apiName, {
        success: response.ok,
        data: data,
        error: !response.ok ? data.message || 'API 호출 실패' : undefined,
        message: data.message,
      });
    } catch (error) {
      updateResult(apiName, {
        success: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류',
      });
    } finally {
      setLoadingState(apiName, false);
    }
  };

  // 1. 실거래가 관련 API (통합된 transaction-details API)
  const testTransactionDetailApart = () => {
    const requestData =
      formData['통합 실거래가 상세 (아파트)'] ||
      getDefaultFormData('통합 실거래가 상세 (아파트)');

    callApi(
      '통합 실거래가 상세 (아파트)',
      '/api/transaction-details?type=apart',
      {
        method: 'POST',
        body: JSON.stringify(requestData),
      }
    );
  };

  const testTransactionDetailSingle = () => {
    const requestData =
      formData['통합 실거래가 상세 (단독/다가구)'] ||
      getDefaultFormData('통합 실거래가 상세 (단독/다가구)');

    callApi(
      '통합 실거래가 상세 (단독/다가구)',
      '/api/transaction-details?type=single',
      {
        method: 'POST',
        body: JSON.stringify(requestData),
      }
    );
  };

  // 2. 인증 관련 API
  const testRegister = () => {
    const requestData = {
      email: 'test@example.com',
      password: 'testpassword123',
      name: '테스트 사용자',
    };

    callApi('회원가입', '/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  };

  // 3. 중개사 관련 API
  const testBroker = () => {
    callApi(
      '중개사 정보 조회',
      '/api/broker?brkrNm=테스트&bsnmCmpnm=테스트중개'
    );
  };

  // 4. 단지 관련 API (복수형 경로로 변경)
  const testDanJiSerialNumber = () => {
    const requestData = {
      organization: '0010', // 기관코드 (고정값: "0010")
      year: '2024', // 기준년도 (YYYY)
      type: '0', // 구분 ("0":아파트, "1":연립/다세대, "2":오피스텔)
      searchGbn: '0', // 조회구분 ("0":지번주소, "1":도로명주소)
      addrSido: '서울특별시', // 주소_시도
      addrSigungu: '강남구', // 주소_시군구
      addrDong: '역삼동', // 주소_읍면동로
      complexName: '테스트단지', // 단지명 (선택사항)
    };

    callApi('단지 일련번호 조회', '/api/danji-serial-number', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  };

  const testDanJi = () => {
    const requestData = {
      organization: '0010',
      addrSido: '서울특별시',
      addrSigun: '강남구',
      addrDong: '역삼동',
    };

    callApi('단지목록 조회', '/api/danjis', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  };

  // 5. 공시가격 관련 API (복수형 경로로 변경)
  const testHousingPrice = () => {
    const requestData = {
      organization: '0010',
      addrSearchType: '0',
      addrSiGunGu: '강남구',
      addrDong: '역삼동',
      addrLotNumber: '123-45',
    };

    callApi('부동산 공시가격', '/api/housing-price', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  };

  const testRebHousingPrice = () => {
    const requestData = {
      organization: '0010',
      addrSearchType: '0',
      addrSido: '서울특별시',
      addrSiGunGu: '강남구',
      addrDong: '역삼동',
      addrLotNumber: '123-45',
    };

    callApi('공동주택 공시가격', '/api/reb-housing-prices', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  };

  // 6. 뉴스 API
  const testNaverNews = () => {
    callApi('네이버 뉴스', '/api/naver-news');
  };

  // 7. 장소 검색 API
  const testPlace = () => {
    callApi('장소 검색', '/api/place?query=강남역');
  };

  // 8. 부동산등기부등본 관련 API (복수형 경로로 변경)
  const testRealEstateExists = () => {
    callApi('등기부등본 존재 확인', '/api/real-estates/exists?nickname=test');
  };

  const testRealEstateSearchAddress = () => {
    const requestData = {
      password: 'encrypted_password',
      address: '서울특별시 강남구 역삼동 123-45',
      realtyType: '0',
      userAddressNickname: 'test',
    };

    callApi('주소로 등기부등본 조회', '/api/real-estates/search/address', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  };

  const testRealEstateSearchUniqueNo = () => {
    const requestData = {
      password: '1234',
      uniqueNo: '12345678901234',
      inquiryType: '0',
      userAddressNickname: 'test',
    };

    callApi(
      '고유번호로 등기부등본 조회',
      '/api/real-estates/search/unique-no',
      {
        method: 'POST',
        body: JSON.stringify(requestData),
      }
    );
  };

  const testRealEstateCopy = () => {
    callApi(
      '저장된 등기부등본 조회',
      '/api/real-estate-copies?userAddressNickname=test'
    );
  };

  // 9. 시세 정보 API
  const testSise = () => {
    const requestData = {
      organization: '0010',
      searchGbn: '1',
      complexNo: '12345',
    };

    callApi('시세정보 조회', '/api/sise', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  };

  // 10. 단계 결과 API
  const testStepResultGet = () => {
    callApi('단계 결과 조회', '/api/step-result?userAddressId=1');
  };

  const testStepResultPost = () => {
    const requestData = {
      userAddressId: 1,
      stepId: 1,
      mainNum: 1,
      subNum: 1,
      mismatch: 0,
      match: 5,
      unchecked: 0,
    };

    callApi('단계 결과 생성', '/api/step-result', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  };

  // 11. 납세증명서 관련 API (복수형 경로로 변경)
  const testTaxCert = () => {
    const requestData = {
      organization: '0001',
      loginType: '0',
      isIdentityViewYN: 'Y',
      proofType: '0',
      submitTargets: '0',
      userAddressNickname: 'test',
      certType: '0',
      certFile: 'base64_encoded_cert',
      keyFile: 'base64_encoded_key',
      certPassword: 'encrypted_password',
    };

    callApi('납세증명서 발급', '/api/tax-certs', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  };

  const testTaxCertExists = () => {
    callApi('납세증명서 존재 확인', '/api/tax-certs/exists?nickname=test');
  };

  const testTaxCertCopy = () => {
    callApi(
      '저장된 납세증명서 조회',
      '/api/tax-cert-copies?userAddressNickname=test'
    );
  };

  // 12. 실거래가 조회 API (국토교통부) (복수형 경로로 변경)
  const testTransactionApartment = () => {
    callApi(
      '아파트 실거래가',
      '/api/transactions/apartment?LAWD_CD=11680&DEAL_YMD=202412'
    );
  };

  const testTransactionDetachedHouse = () => {
    callApi(
      '단독/다가구 실거래가',
      '/api/transactions/detached-house?LAWD_CD=11680&DEAL_YMD=202412'
    );
  };

  const testTransactionOfficetel = () => {
    callApi(
      '오피스텔 실거래가',
      '/api/transactions/officetel?LAWD_CD=11680&DEAL_YMD=202412'
    );
  };

  const testTransactionRowHouse = () => {
    callApi(
      '연립다세대 실거래가',
      '/api/transactions/row-house?LAWD_CD=11680&DEAL_YMD=202412'
    );
  };

  // 13. 사용자 주소 관련 API
  const testAddUserAddress = () => {
    const requestData = {
      latitude: 37.5665,
      longitude: 126.978,
      legalDistrictCode: '11680',
      dong: '역삼동',
      ho: '123-45',
    };

    callApi('사용자 주소 추가', '/api/user-address', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  };

  const testGetUserAddresses = () => {
    callApi('사용자 주소 목록', '/api/user-address/my-address-list');
  };

  const testTogglePrimaryAddress = () => {
    const requestData = {
      userAddressId: 1,
    };

    callApi('대표 주소 변경', '/api/user-address/toggle-primary', {
      method: 'PUT',
      body: JSON.stringify(requestData),
    });
  };

  // 전체 API 테스트 실행
  const runAllTests = async () => {
    const testFunctions = [
      testTransactionDetailApart,
      testTransactionDetailSingle,
      testRegister,
      testBroker,
      testDanJiSerialNumber,
      testDanJi,
      testHousingPrice,
      testRebHousingPrice,
      testNaverNews,
      testPlace,
      testRealEstateExists,
      testRealEstateSearchAddress,
      testRealEstateSearchUniqueNo,
      testRealEstateCopy,
      testSise,
      testStepResultGet,
      testStepResultPost,
      testTaxCert,
      testTaxCertExists,
      testTaxCertCopy,
      testTransactionApartment,
      testTransactionDetachedHouse,
      testTransactionOfficetel,
      testTransactionRowHouse,
      testAddUserAddress,
      testGetUserAddresses,
      testTogglePrimaryAddress,
    ];

    for (const testFunc of testFunctions) {
      await new Promise((resolve) => setTimeout(resolve, 500)); // 0.5초 간격으로 실행
      testFunc();
    }
  };

  const renderForm = (apiName: string) => {
    const currentFormData = formData[apiName] || getDefaultFormData(apiName);
    const isFormVisible = showForms[apiName];

    if (!isFormVisible) {
      return null;
    }

    const formFields = Object.keys(currentFormData).map((field) => (
      <div key={field} className={styles.formField}>
        <label className={styles.formLabel}>{field}:</label>
        <input
          type='text'
          value={String(currentFormData[field] || '')}
          onChange={(e) => updateFormData(apiName, field, e.target.value)}
          className={styles.formInput}
          placeholder={`${field} 입력`}
        />
      </div>
    ));

    return (
      <div className={styles.formContainer}>
        <div className={styles.formFields}>{formFields}</div>
        <div className={styles.formActions}>
          <button
            onClick={() => {
              setFormData((prev) => ({
                ...prev,
                [apiName]: getDefaultFormData(apiName),
              }));
            }}
            className={styles.resetButton}
          >
            기본값으로 초기화
          </button>
        </div>
      </div>
    );
  };

  const renderDanjiList = (danjiList: DanJiSerialNumber[]) => {
    return (
      <div className={styles.danjiList}>
        <h4>🏢 조회된 단지 목록 (클릭하여 실거래가 조회에 적용)</h4>
        {danjiList.map((danji, index) => (
          <div
            key={index}
            className={`${styles.danjiItem} ${
              selectedDanJi?.commBuildingCode === danji.commBuildingCode
                ? styles.selected
                : ''
            }`}
            onClick={() => selectDanji(danji)}
          >
            <div className={styles.danjiName}>
              <strong>{danji.resBuildingName}</strong>
              {selectedDanJi?.commBuildingCode === danji.commBuildingCode && (
                <span className={styles.selectedBadge}>✓ 선택됨</span>
              )}
            </div>
            <div className={styles.danjiInfo}>
              <span>건물코드: {danji.commBuildingCode}</span>
              <span>지번: {danji.commAddrLotNumber}</span>
              <span>도로명: {danji.commAddrRoadName}</span>
            </div>
          </div>
        ))}
        {selectedDanJi && (
          <div className={styles.actionButtons}>
            <button
              onClick={() => testTransactionDetailApart()}
              className={styles.continueButton}
              disabled={loading['통합 실거래가 상세 (아파트)']}
            >
              🚀 선택된 단지로 실거래가 조회하기
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderResult = (apiName: string) => {
    const result = results[apiName];
    const isLoading = loading[apiName];

    if (isLoading) {
      return <div className={styles.loading}>로딩 중...</div>;
    }

    if (!result) {
      return <div className={styles.noResult}>테스트 결과 없음</div>;
    }

    // 단지 일련번호 조회 결과 특별 처리
    let danjiListComponent = null;
    if (apiName === '단지 일련번호 조회' && result.success && result.data) {
      const responseData = result.data as { data?: DanJiSerialNumber[] };
      if (responseData.data && responseData.data.length > 0) {
        danjiListComponent = renderDanjiList(responseData.data);
      }
    }

    return (
      <div
        className={`${styles.result} ${
          result.success ? styles.success : styles.error
        }`}
      >
        <div className={styles.resultHeader}>
          <span className={styles.status}>
            {result.success ? '성공' : '실패'}
          </span>
          {result.message && (
            <span className={styles.message}>{result.message}</span>
          )}
        </div>
        {result.error && <div className={styles.error}>{result.error}</div>}

        {danjiListComponent}

        {result.data ? (
          <div className={styles.data}>
            <pre>{JSON.stringify(result.data, null, 2)}</pre>
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {/* 네비게이션 */}
      <div className={styles.navigation}>
        <Link href='/test' className={styles.backLink}>
          ← 테스트 메인으로 돌아가기
        </Link>
      </div>

      <h1 className={styles.title}>BoGam API 종합 테스트</h1>

      {/* 전체 테스트 실행 버튼 */}
      <div className={styles.allTestSection}>
        <button
          onClick={runAllTests}
          className={styles.allTestButton}
          disabled={Object.values(loading).some(Boolean)}
        >
          🚀 모든 API 테스트 실행
        </button>
        <p className={styles.allTestDescription}>
          모든 API를 순차적으로 테스트합니다. (0.5초 간격)
        </p>
      </div>

      <div className={styles.section}>
        <h2>1. 통합 실거래가 상세 API</h2>
        <div className={styles.apiGrid}>
          <div className={styles.apiCard}>
            <h3>통합 실거래가 상세 (아파트)</h3>
            <div className={styles.buttonGroup}>
              <button
                onClick={() => toggleForm('통합 실거래가 상세 (아파트)')}
                className={styles.formToggleButton}
              >
                {showForms['통합 실거래가 상세 (아파트)']
                  ? '폼 숨기기'
                  : '폼 보기'}
              </button>
              <button
                onClick={testTransactionDetailApart}
                disabled={loading['통합 실거래가 상세 (아파트)']}
              >
                테스트 실행
              </button>
            </div>
            {renderForm('통합 실거래가 상세 (아파트)')}
            {renderResult('통합 실거래가 상세 (아파트)')}
          </div>

          <div className={styles.apiCard}>
            <h3>통합 실거래가 상세 (단독/다가구)</h3>
            <div className={styles.buttonGroup}>
              <button
                onClick={() => toggleForm('통합 실거래가 상세 (단독/다가구)')}
                className={styles.formToggleButton}
              >
                {showForms['통합 실거래가 상세 (단독/다가구)']
                  ? '폼 숨기기'
                  : '폼 보기'}
              </button>
              <button
                onClick={testTransactionDetailSingle}
                disabled={loading['통합 실거래가 상세 (단독/다가구)']}
              >
                테스트 실행
              </button>
            </div>
            {renderForm('통합 실거래가 상세 (단독/다가구)')}
            {renderResult('통합 실거래가 상세 (단독/다가구)')}
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2>2. 인증 관련 API</h2>
        <div className={styles.apiGrid}>
          <div className={styles.apiCard}>
            <h3>회원가입</h3>
            <button onClick={testRegister} disabled={loading['회원가입']}>
              테스트 실행
            </button>
            {renderResult('회원가입')}
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2>3. 중개사 관련 API</h2>
        <div className={styles.apiGrid}>
          <div className={styles.apiCard}>
            <h3>중개사 정보 조회</h3>
            <button onClick={testBroker} disabled={loading['중개사 정보 조회']}>
              테스트 실행
            </button>
            {renderResult('중개사 정보 조회')}
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2>4. 단지 관련 API</h2>
        <div className={styles.apiGrid}>
          <div className={styles.apiCard}>
            <h3>단지 일련번호 조회</h3>
            <div className={styles.buttonGroup}>
              <button
                onClick={() => toggleForm('단지 일련번호 조회')}
                className={styles.formToggleButton}
              >
                {showForms['단지 일련번호 조회'] ? '폼 숨기기' : '폼 보기'}
              </button>
              <button
                onClick={testDanJiSerialNumber}
                disabled={loading['단지 일련번호 조회']}
              >
                테스트 실행
              </button>
            </div>
            {renderForm('단지 일련번호 조회')}
            {renderResult('단지 일련번호 조회')}
          </div>

          <div className={styles.apiCard}>
            <h3>단지목록 조회</h3>
            <div className={styles.buttonGroup}>
              <button
                onClick={() => toggleForm('단지목록 조회')}
                className={styles.formToggleButton}
              >
                {showForms['단지목록 조회'] ? '폼 숨기기' : '폼 보기'}
              </button>
              <button onClick={testDanJi} disabled={loading['단지목록 조회']}>
                테스트 실행
              </button>
            </div>
            {renderForm('단지목록 조회')}
            {renderResult('단지목록 조회')}
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2>5. 공시가격 관련 API</h2>
        <div className={styles.apiGrid}>
          <div className={styles.apiCard}>
            <h3>부동산 공시가격</h3>
            <button
              onClick={testHousingPrice}
              disabled={loading['부동산 공시가격']}
            >
              테스트 실행
            </button>
            {renderResult('부동산 공시가격')}
          </div>

          <div className={styles.apiCard}>
            <h3>공동주택 공시가격</h3>
            <button
              onClick={testRebHousingPrice}
              disabled={loading['공동주택 공시가격']}
            >
              테스트 실행
            </button>
            {renderResult('공동주택 공시가격')}
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2>6. 뉴스 API</h2>
        <div className={styles.apiGrid}>
          <div className={styles.apiCard}>
            <h3>네이버 뉴스</h3>
            <button onClick={testNaverNews} disabled={loading['네이버 뉴스']}>
              테스트 실행
            </button>
            {renderResult('네이버 뉴스')}
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2>7. 장소 검색 API</h2>
        <div className={styles.apiGrid}>
          <div className={styles.apiCard}>
            <h3>장소 검색</h3>
            <button onClick={testPlace} disabled={loading['장소 검색']}>
              테스트 실행
            </button>
            {renderResult('장소 검색')}
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2>8. 부동산등기부등본 관련 API</h2>
        <div className={styles.apiGrid}>
          <div className={styles.apiCard}>
            <h3>등기부등본 존재 확인</h3>
            <button
              onClick={testRealEstateExists}
              disabled={loading['등기부등본 존재 확인']}
            >
              테스트 실행
            </button>
            {renderResult('등기부등본 존재 확인')}
          </div>

          <div className={styles.apiCard}>
            <h3>주소로 등기부등본 조회</h3>
            <button
              onClick={testRealEstateSearchAddress}
              disabled={loading['주소로 등기부등본 조회']}
            >
              테스트 실행
            </button>
            {renderResult('주소로 등기부등본 조회')}
          </div>

          <div className={styles.apiCard}>
            <h3>고유번호로 등기부등본 조회</h3>
            <button
              onClick={testRealEstateSearchUniqueNo}
              disabled={loading['고유번호로 등기부등본 조회']}
            >
              테스트 실행
            </button>
            {renderResult('고유번호로 등기부등본 조회')}
          </div>

          <div className={styles.apiCard}>
            <h3>저장된 등기부등본 조회</h3>
            <button
              onClick={testRealEstateCopy}
              disabled={loading['저장된 등기부등본 조회']}
            >
              테스트 실행
            </button>
            {renderResult('저장된 등기부등본 조회')}
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2>9. 시세 정보 API</h2>
        <div className={styles.apiGrid}>
          <div className={styles.apiCard}>
            <h3>시세정보 조회</h3>
            <button onClick={testSise} disabled={loading['시세정보 조회']}>
              테스트 실행
            </button>
            {renderResult('시세정보 조회')}
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2>10. 단계 결과 API</h2>
        <div className={styles.apiGrid}>
          <div className={styles.apiCard}>
            <h3>단계 결과 조회</h3>
            <button
              onClick={testStepResultGet}
              disabled={loading['단계 결과 조회']}
            >
              테스트 실행
            </button>
            {renderResult('단계 결과 조회')}
          </div>

          <div className={styles.apiCard}>
            <h3>단계 결과 생성</h3>
            <button
              onClick={testStepResultPost}
              disabled={loading['단계 결과 생성']}
            >
              테스트 실행
            </button>
            {renderResult('단계 결과 생성')}
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2>11. 납세증명서 관련 API</h2>
        <div className={styles.apiGrid}>
          <div className={styles.apiCard}>
            <h3>납세증명서 발급</h3>
            <button onClick={testTaxCert} disabled={loading['납세증명서 발급']}>
              테스트 실행
            </button>
            {renderResult('납세증명서 발급')}
          </div>

          <div className={styles.apiCard}>
            <h3>납세증명서 존재 확인</h3>
            <button
              onClick={testTaxCertExists}
              disabled={loading['납세증명서 존재 확인']}
            >
              테스트 실행
            </button>
            {renderResult('납세증명서 존재 확인')}
          </div>

          <div className={styles.apiCard}>
            <h3>저장된 납세증명서 조회</h3>
            <button
              onClick={testTaxCertCopy}
              disabled={loading['저장된 납세증명서 조회']}
            >
              테스트 실행
            </button>
            {renderResult('저장된 납세증명서 조회')}
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2>12. 실거래가 조회 API (국토교통부)</h2>
        <div className={styles.apiGrid}>
          <div className={styles.apiCard}>
            <h3>아파트 실거래가</h3>
            <button
              onClick={testTransactionApartment}
              disabled={loading['아파트 실거래가']}
            >
              테스트 실행
            </button>
            {renderResult('아파트 실거래가')}
          </div>

          <div className={styles.apiCard}>
            <h3>단독/다가구 실거래가</h3>
            <button
              onClick={testTransactionDetachedHouse}
              disabled={loading['단독/다가구 실거래가']}
            >
              테스트 실행
            </button>
            {renderResult('단독/다가구 실거래가')}
          </div>

          <div className={styles.apiCard}>
            <h3>오피스텔 실거래가</h3>
            <button
              onClick={testTransactionOfficetel}
              disabled={loading['오피스텔 실거래가']}
            >
              테스트 실행
            </button>
            {renderResult('오피스텔 실거래가')}
          </div>

          <div className={styles.apiCard}>
            <h3>연립다세대 실거래가</h3>
            <button
              onClick={testTransactionRowHouse}
              disabled={loading['연립다세대 실거래가']}
            >
              테스트 실행
            </button>
            {renderResult('연립다세대 실거래가')}
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2>13. 사용자 주소 관련 API</h2>
        <div className={styles.apiGrid}>
          <div className={styles.apiCard}>
            <h3>사용자 주소 추가</h3>
            <button
              onClick={testAddUserAddress}
              disabled={loading['사용자 주소 추가']}
            >
              테스트 실행
            </button>
            {renderResult('사용자 주소 추가')}
          </div>

          <div className={styles.apiCard}>
            <h3>사용자 주소 목록</h3>
            <button
              onClick={testGetUserAddresses}
              disabled={loading['사용자 주소 목록']}
            >
              테스트 실행
            </button>
            {renderResult('사용자 주소 목록')}
          </div>

          <div className={styles.apiCard}>
            <h3>대표 주소 변경</h3>
            <button
              onClick={testTogglePrimaryAddress}
              disabled={loading['대표 주소 변경']}
            >
              테스트 실행
            </button>
            {renderResult('대표 주소 변경')}
          </div>
        </div>
      </div>
    </div>
  );
}
