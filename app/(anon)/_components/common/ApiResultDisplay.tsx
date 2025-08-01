'use client';

import { CodefResponse } from '../../../../backend/applications/taxCert/dtos/TaxCertDto';
import { extractActualData } from '@libs/responseUtils';

interface ApiResultDisplayProps {
  response: CodefResponse;
  error?: string | null;
}

export default function ApiResultDisplay({ response, error }: ApiResultDisplayProps) {
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-bold text-red-900 mb-4">❌ 오류 발생</h3>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!response) {
    return null;
  }

  const { result } = response;
  const data = extractActualData(response);
  const isSuccess = result?.code === 'CF-00000';
  const hasData = data && Object.keys(data).length > 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        {isSuccess ? '✅ API 응답 성공' : '⚠️ API 응답'}
      </h3>
      
      {/* 결과 정보 */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-3">결과 정보</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">결과 코드</label>
            <p className={`text-sm font-semibold ${
              isSuccess ? 'text-green-600' : 'text-red-600'
            }`}>
              {result?.code || '-'}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">결과 메시지</label>
            <p className="text-sm text-gray-900">{result?.message || '-'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">추가 메시지</label>
            <p className="text-sm text-gray-900">{result?.extraMessage || '-'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">트랜잭션 ID</label>
            <p className="text-sm text-gray-900">{result?.transactionId || '-'}</p>
          </div>
        </div>
      </div>

      {/* 데이터 정보 */}
      {hasData && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-3">응답 데이터</h4>
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.continue2Way && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">추가인증 필요</label>
                  <p className="text-sm font-semibold text-blue-600">예</p>
                </div>
              )}
              {data.method && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">인증 방법</label>
                  <p className="text-sm text-gray-900">{data.method}</p>
                </div>
              )}
              {data.resIssueNo && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">발급번호</label>
                  <p className="text-sm font-semibold text-green-600">{data.resIssueNo}</p>
                </div>
              )}
              {data.resReceiptNo && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">접수번호</label>
                  <p className="text-sm text-gray-900">{data.resReceiptNo}</p>
                </div>
              )}
              {data.resUserNm && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">성명(대표자)</label>
                  <p className="text-sm text-gray-900">{data.resUserNm}</p>
                </div>
              )}
              {data.resCompanyNm && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">상호(법인명)</label>
                  <p className="text-sm text-gray-900">{data.resCompanyNm}</p>
                </div>
              )}
              {data.resPaymentTaxStatus && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">납세상태</label>
                  <p className="text-sm text-gray-900">{data.resPaymentTaxStatus}</p>
                </div>
              )}
              {data.resUsePurpose && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">증명서 사용목적</label>
                  <p className="text-sm text-gray-900">{data.resUsePurpose}</p>
                </div>
              )}
              {data.resIssueOgzNm && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">발급기관</label>
                  <p className="text-sm text-gray-900">{data.resIssueOgzNm}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 원본 응답 데이터 (디버깅용) */}
      <div>
        <h4 className="text-lg font-semibold text-gray-800 mb-3">원본 응답 데이터</h4>
        <div className="bg-gray-100 p-4 rounded-md">
          <pre className="text-xs overflow-x-auto max-h-40">
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
} 