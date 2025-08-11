'use client';

import { useState } from 'react';
import styles from './page.module.css';

interface ComplexSerialNumberRequest {
  organization: string;
  year: string;
  type: string;
  searchGbn: string;
  addrSido: string;
  addrSigungu: string;
  addrDong: string;
  complexName?: string;
}

interface ComplexSerialNumber {
  commBuildingCode: string;
  resBuildingName: string;
  commAddrLotNumber: string;
  resBunji: string;
  commAddrRoadName: string;
}

interface ApiResultMeta {
  code: string;
  message: string;
  extraMessage?: string;
}

interface ComplexSerialNumberApiResponse {
  result: ApiResultMeta;
  data?: ComplexSerialNumber[];
}

interface ActualTransactionRequestDto {
  organization: string; // 고정: 0010
  type: string; // 0/1/2
  buildingCode: string; // commBuildingCode
  contractYear: string; // YYYY
  contractType: string; // 0/1/2
}

export default function ComplexSerialNumberTestPage() {
  // 1) 단지 일련번호 조회 요청 상태
  const [request, setRequest] = useState<ComplexSerialNumberRequest>({
    organization: '0010',
    year: '2023',
    type: '0',
    searchGbn: '0',
    addrSido: '',
    addrSigungu: '',
    addrDong: '',
    complexName: '',
  });

  // 2) 단지 일련번호 조회 응답 상태
  const [response, setResponse] =
    useState<ComplexSerialNumberApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 3) 사용자가 선택한 단지/건물코드
  const [selected, setSelected] = useState<ComplexSerialNumber | null>(null);

  // 4) 선택된 단지로 실거래가 조회 요청 상태/응답 상태
  const [actualReq, setActualReq] = useState<
    Pick<ActualTransactionRequestDto, 'contractYear' | 'contractType'>
  >({
    contractYear: '2023',
    contractType: '0',
  });
  const [actualLoading, setActualLoading] = useState(false);
  const [actualError, setActualError] = useState<string | null>(null);
  const [actualRes, setActualRes] = useState<any>(null);

  const handleInputChange = (
    field: keyof ComplexSerialNumberRequest,
    value: string
  ) => {
    setRequest((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);
    setSelected(null);
    setActualRes(null);

    try {
      const res = await fetch('/api/complex-serial-number', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const data = (await res.json()) as ComplexSerialNumberApiResponse;

      if (!res.ok) {
        throw new Error((data as any).error || 'API 호출에 실패했습니다.');
      }

      setResponse(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSelectComplex = (item: ComplexSerialNumber) => {
    setSelected(item);
    // 선택 변경 시 이전 실거래가 결과 초기화
    setActualRes(null);
    setActualError(null);
  };

  const submitActualTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setActualLoading(true);
    setActualError(null);
    setActualRes(null);

    const payload: ActualTransactionRequestDto = {
      organization: '0010',
      type: request.type,
      buildingCode: selected.commBuildingCode,
      contractYear: actualReq.contractYear,
      contractType: actualReq.contractType,
    };

    try {
      const res = await fetch('/api/actual-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || '실거래가 조회 실패');
      }
      setActualRes(data);
    } catch (err) {
      setActualError(err instanceof Error ? err.message : '알 수 없는 오류');
    } finally {
      setActualLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        단지 일련번호 조회 → 실거래가 연동 테스트
      </h1>

      {/* 1) 단지 일련번호 조회 폼 */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor='organization'>기관코드:</label>
          <input
            id='organization'
            type='text'
            value={request.organization}
            onChange={(e) => handleInputChange('organization', e.target.value)}
            placeholder='0010'
            required
          />
          <small>고정값: 0010</small>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor='year'>기준년도:</label>
          <input
            id='year'
            type='text'
            value={request.year}
            onChange={(e) => handleInputChange('year', e.target.value)}
            placeholder='2023'
            required
          />
          <small>YYYY 형식</small>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor='type'>구분:</label>
          <select
            id='type'
            value={request.type}
            onChange={(e) => handleInputChange('type', e.target.value)}
            required
          >
            <option value='0'>아파트</option>
            <option value='1'>연립/다세대</option>
            <option value='2'>오피스텔</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor='searchGbn'>조회구분:</label>
          <select
            id='searchGbn'
            value={request.searchGbn}
            onChange={(e) => handleInputChange('searchGbn', e.target.value)}
            required
          >
            <option value='0'>지번주소</option>
            <option value='1'>도로명주소</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor='addrSido'>시도:</label>
          <input
            id='addrSido'
            type='text'
            value={request.addrSido}
            onChange={(e) => handleInputChange('addrSido', e.target.value)}
            placeholder='서울특별시'
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor='addrSigungu'>시군구:</label>
          <input
            id='addrSigungu'
            type='text'
            value={request.addrSigungu}
            onChange={(e) => handleInputChange('addrSigungu', e.target.value)}
            placeholder='강남구'
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor='addrDong'>읍면동로:</label>
          <input
            id='addrDong'
            type='text'
            value={request.addrDong}
            onChange={(e) => handleInputChange('addrDong', e.target.value)}
            placeholder='삼성동'
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor='complexName'>단지명 (선택):</label>
          <input
            id='complexName'
            type='text'
            value={request.complexName}
            onChange={(e) => handleInputChange('complexName', e.target.value)}
            placeholder='삼성풍림2차아파트'
          />
        </div>

        <button
          type='submit'
          disabled={loading}
          className={styles.submitButton}
        >
          {loading ? '조회 중...' : '단지 일련번호 조회'}
        </button>
      </form>

      {error && (
        <div className={styles.error}>
          <h3>오류</h3>
          <p>{error}</p>
        </div>
      )}

      {/* 2) 단지 일련번호 조회 결과 */}
      {response && (
        <div className={styles.response}>
          <h3>단지 일련번호 조회 결과</h3>
          <div className={styles.resultInfo}>
            <p>
              <strong>결과 코드:</strong> {response.result.code}
            </p>
            <p>
              <strong>결과 메시지:</strong> {response.result.message}
            </p>
            {response.result.extraMessage && (
              <p>
                <strong>추가 메시지:</strong> {response.result.extraMessage}
              </p>
            )}
            <p>
              <strong>데이터 개수:</strong> {response.data?.length || 0}개
            </p>
          </div>

          {response.data && response.data.length > 0 && (
            <div className={styles.dataList}>
              <h4>조회 결과</h4>
              {response.data.map((item, index) => (
                <div key={index} className={styles.dataItem}>
                  <p>
                    <strong>건물코드:</strong> {item.commBuildingCode}
                  </p>
                  <p>
                    <strong>건물명칭:</strong> {item.resBuildingName}
                  </p>
                  <p>
                    <strong>지번:</strong> {item.commAddrLotNumber}
                  </p>
                  <p>
                    <strong>번지:</strong> {item.resBunji}
                  </p>
                  <p>
                    <strong>도로명:</strong> {item.commAddrRoadName}
                  </p>
                  <button
                    type='button'
                    className={styles.submitButton}
                    onClick={() => handleSelectComplex(item)}
                  >
                    선택
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3) 선택한 단지 정보 + 실거래가 조회 폼 */}
      {selected && (
        <div className={styles.response} style={{ marginTop: 16 }}>
          <h3>선택한 단지</h3>
          <div className={styles.resultInfo}>
            <p>
              <strong>건물코드:</strong> {selected.commBuildingCode}
            </p>
            <p>
              <strong>건물명칭:</strong> {selected.resBuildingName}
            </p>
            <p>
              <strong>주소(지번):</strong> {selected.commAddrLotNumber}{' '}
              {selected.resBunji}
            </p>
            <p>
              <strong>주소(도로명):</strong> {selected.commAddrRoadName}
            </p>
          </div>

          <form onSubmit={submitActualTransaction} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor='contractYear'>계약년도</label>
              <input
                id='contractYear'
                type='text'
                value={actualReq.contractYear}
                onChange={(e) =>
                  setActualReq((p) => ({ ...p, contractYear: e.target.value }))
                }
                placeholder='YYYY'
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor='contractType'>계약구분</label>
              <select
                id='contractType'
                value={actualReq.contractType}
                onChange={(e) =>
                  setActualReq((p) => ({ ...p, contractType: e.target.value }))
                }
              >
                <option value='0'>전체</option>
                <option value='1'>매매</option>
                <option value='2'>전월세</option>
              </select>
            </div>

            <button
              type='submit'
              className={styles.submitButton}
              disabled={actualLoading}
            >
              {actualLoading
                ? '실거래가 조회 중...'
                : '선택 건물 실거래가 조회'}
            </button>
          </form>

          {actualError && (
            <div className={styles.error}>
              <p>{actualError}</p>
            </div>
          )}

          {actualRes && (
            <div className={styles.response}>
              <h4>실거래가 응답</h4>
              <pre style={{ whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(actualRes, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
