'use client';

import { useState, useEffect, useMemo } from 'react';
import stepResultsApi, { StepResultRequest } from '@libs/api_front/stepResults.api';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';

const StepResultsApiTest = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [jsonInput, setJsonInput] = useState<string>('');

  // userAddressStore에서 선택된 주소 가져오기
  const { selectedAddress } = useUserAddressStore();

    const defaultData = useMemo((): StepResultRequest => ({
    userAddressId: selectedAddress?.id || 1,
    stepNumber: 1,
    detail: 1,
    jsonDetails: {
      표제부: 'match',
      갑구: 'match',
      을구: 'unchecked'
    }
  }), [selectedAddress?.id]);

  // JSON 입력을 파싱하여 StepResultRequest로 변환
  const parseJsonInput = (): StepResultRequest | null => {
    try {
      const parsed = JSON.parse(jsonInput);
      
             // 필수 필드 검증
       if (typeof parsed.userAddressId !== 'number' || 
           typeof parsed.stepNumber !== 'number' || 
           typeof parsed.detail !== 'number' || 
           !parsed.jsonDetails || typeof parsed.jsonDetails !== 'object') {
         throw new Error('필수 필드가 누락되었거나 타입이 잘못되었습니다.');
       }

       // jsonDetails의 값들이 올바른 타입인지 검증
       for (const [key, value] of Object.entries(parsed.jsonDetails)) {
         if (!['match', 'mismatch', 'unchecked'].includes(value as string)) {
           throw new Error(`jsonDetails.${key}의 값이 올바르지 않습니다. 'match', 'mismatch', 'unchecked' 중 하나여야 합니다.`);
         }
       }

      return parsed as StepResultRequest;
    } catch {
      return null;
    }
  };

  // 선택된 주소가 변경될 때마다 JSON 입력 업데이트
  useEffect(() => {
    const updatedData = {
      ...defaultData,
      userAddressId: selectedAddress?.id || 1
    };
    setJsonInput(JSON.stringify(updatedData, null, 2));
  }, [defaultData, selectedAddress?.id]);

  const handleCreateOrUpdateStepResult = async () => {
    setLoading(true);
    setError('');
    setResult('');

    const parsedData = parseJsonInput();
    if (!parsedData) {
      setError('JSON 형식이 올바르지 않습니다. 필수 필드를 확인해주세요.');
      setLoading(false);
      return;
    }

    try {
      const response = await stepResultsApi.createOrUpdateStepResult(parsedData);
      
      if (response.success) {
        setResult(JSON.stringify(response.data, null, 2));
      } else {
        setError(`API 호출 실패: ${response.message}`);
      }
    } catch (err) {
      setError(`에러 발생: ${err instanceof Error ? err.message : '알 수 없는 에러'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center mb-6">
        Step Results API 테스트
      </h1>

      {/* 선택된 주소 정보 */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-3 text-blue-800">선택된 주소 정보</h2>
        {selectedAddress ? (
          <div className="space-y-2 text-sm">
            <p><strong>ID:</strong> {selectedAddress.id}</p>
            <p><strong>닉네임:</strong> {selectedAddress.nickname}</p>
            <p><strong>지번 주소:</strong> {selectedAddress.lotAddress}</p>
            <p><strong>도로명 주소:</strong> {selectedAddress.roadAddress}</p>
            <p><strong>대표 주소:</strong> {selectedAddress.isPrimary ? '예' : '아니오'}</p>
          </div>
        ) : (
          <p className="text-sm text-gray-600">선택된 주소가 없습니다. 기본값 1을 사용합니다.</p>
        )}
      </div>

      {/* JSON 입력 */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-3">JSON 입력</h2>
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          className="w-full h-48 p-3 font-mono text-sm border rounded resize-none"
          placeholder="JSON을 입력하세요..."
        />
                 <div className="mt-2 text-sm text-gray-600">
           <p>필수 필드: userAddressId, stepNumber, detail, jsonDetails</p>
           <p>jsonDetails 값: &quot;match&quot;, &quot;mismatch&quot;, &quot;unchecked&quot; 중 하나</p>
         </div>
      </div>

      {/* API 호출 버튼 */}
      <div className="flex gap-4">
        <button
          onClick={handleCreateOrUpdateStepResult}
          disabled={loading}
          className="px-4 py-2 bg-brand text-white rounded hover:bg-brand-90 disabled:opacity-50"
        >
          {loading ? '처리중...' : 'Step Result 생성/수정'}
        </button>
      </div>

      {/* 결과 표시 */}
      {result && (
        <div className="bg-green-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3 text-green-800">응답 결과</h2>
          <pre className="bg-white p-3 rounded border text-sm overflow-x-auto text-green-700">
            {result}
          </pre>
        </div>
      )}

      {/* 에러 표시 */}
      {error && (
        <div className="bg-red-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3 text-red-800">에러</h2>
          <pre className="bg-white p-3 rounded border text-sm overflow-x-auto text-red-700">
            {error}
          </pre>
        </div>
      )}

      {/* 사용법 설명 */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-3 text-blue-800">사용법</h2>
        <div className="space-y-2 text-sm text-blue-700">
          <p>1. <strong>Step Result 생성/수정</strong>: POST /api/step-results</p>
          <p>2. <strong>조회 API</strong>: 응답 형태 확인 후 구현 예정</p>
          <p>3. <strong>삭제 기능</strong>: 제공되지 않음</p>
        </div>
      </div>
    </div>
  );
};

export default StepResultsApiTest;
