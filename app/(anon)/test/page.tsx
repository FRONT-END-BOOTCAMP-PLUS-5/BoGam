'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import ToastTest from '@/(anon)/_components/common/toast/ToastTest';

interface UserAddressData {
  id: number;
  addressId: number;
  userId: string;
  nickname: string;
  isPrimary: boolean;
  isSelected: boolean;
  createdAt: string;
  address: {
    id: number;
    latitude?: number;
    longitude?: number;
    legalDistrictCode?: string;
    dong?: string;
    ho?: string;
    lotAddress: string;
    roadAddress?: string;
  };
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: UserAddressData;
}

export default function TestPage() {
  const { data: session, status } = useSession();
  const [userNickname, setUserNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 주소 선택 상태 업데이트 테스트용
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateResult, setUpdateResult] = useState<any>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [testAddressId, setTestAddressId] = useState('');

  // 세션에서 닉네임 가져오기
  const currentUserNickname = session?.user?.nickname;

  const testSelectedUserAddress = async () => {
    // 입력이 비어있으면 현재 사용자의 닉네임 사용
    const nicknameToTest = userNickname.trim() || currentUserNickname;

    if (!nicknameToTest) {
      setError('사용자 닉네임을 입력하거나 로그인해주세요.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(
        `/api/selected-user-address?userNickname=${encodeURIComponent(
          nicknameToTest
        )}`
      );

      const data: ApiResponse = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.message || 'API 호출에 실패했습니다.');
      }
    } catch (err) {
      setError('네트워크 오류가 발생했습니다.');
      console.error('API 호출 오류:', err);
    } finally {
      setLoading(false);
    }
  };

  const testUpdateSelectedAddress = async () => {
    const nicknameToTest = userNickname.trim() || currentUserNickname;

    if (!nicknameToTest) {
      setUpdateError('사용자 닉네임을 입력하거나 로그인해주세요.');
      return;
    }

    if (!testAddressId.trim()) {
      setUpdateError('주소 ID를 입력해주세요.');
      return;
    }

    setUpdateLoading(true);
    setUpdateError(null);
    setUpdateResult(null);

    try {
      const response = await fetch('/api/update-selected-address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userNickname: nicknameToTest,
          addressId: parseInt(testAddressId),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setUpdateResult(data);
      } else {
        setUpdateError(data.message || 'API 호출에 실패했습니다.');
      }
    } catch (err) {
      setUpdateError('네트워크 오류가 발생했습니다.');
      console.error('API 호출 오류:', err);
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='container mx-auto py-8 px-4'>
        <h1 className='text-3xl font-bold text-gray-900 mb-8'>
          API 테스트 페이지
        </h1>

        {/* 선택된 사용자 주소 API 테스트 */}
        <div className='bg-white rounded-lg shadow-md p-6 mb-8'>
          <h2 className='text-xl font-semibold text-gray-800 mb-4'>
            선택된 사용자 주소 조회 API 테스트
          </h2>

          <div className='space-y-4'>
            {/* 현재 로그인된 사용자 정보 */}
            {status === 'loading' && (
              <div className='p-3 bg-blue-50 border border-blue-200 rounded-md'>
                <p className='text-sm text-blue-600'>세션 로딩 중...</p>
              </div>
            )}

            {status === 'unauthenticated' && (
              <div className='p-3 bg-yellow-50 border border-yellow-200 rounded-md'>
                <p className='text-sm text-yellow-600'>로그인이 필요합니다.</p>
              </div>
            )}

            {status === 'authenticated' && currentUserNickname && (
              <div className='p-3 bg-green-50 border border-green-200 rounded-md'>
                <p className='text-sm text-green-600'>
                  <strong>현재 로그인된 사용자:</strong> {currentUserNickname}
                </p>
              </div>
            )}

            <div>
              <label
                htmlFor='userNickname'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                테스트할 사용자 닉네임
              </label>
              <input
                id='userNickname'
                type='text'
                value={userNickname}
                onChange={(e) => setUserNickname(e.target.value)}
                placeholder='닉네임을 입력하세요 (비워두면 현재 사용자로 테스트)'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>

            <div className='flex gap-2'>
              <button
                onClick={testSelectedUserAddress}
                disabled={loading}
                className='flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {loading ? '조회 중...' : '선택된 주소 조회'}
              </button>

              {currentUserNickname && (
                <button
                  onClick={() => {
                    setUserNickname(currentUserNickname);
                    testSelectedUserAddress();
                  }}
                  disabled={loading}
                  className='flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {loading ? '조회 중...' : '현재 사용자로 테스트'}
                </button>
              )}
            </div>
          </div>

          {/* 결과 표시 */}
          {error && (
            <div className='mt-4 p-4 bg-red-50 border border-red-200 rounded-md'>
              <h3 className='text-sm font-medium text-red-800 mb-2'>오류</h3>
              <p className='text-sm text-red-600'>{error}</p>
            </div>
          )}

          {result && (
            <div className='mt-4 p-4 bg-green-50 border border-green-200 rounded-md'>
              <h3 className='text-sm font-medium text-green-800 mb-2'>결과</h3>
              <div className='text-sm text-green-600 mb-3'>
                <p>
                  <strong>성공:</strong> {result.success ? '예' : '아니오'}
                </p>
                <p>
                  <strong>메시지:</strong> {result.message}
                </p>
              </div>

              {result.data && (
                <div className='bg-white p-4 rounded border'>
                  <h4 className='font-medium text-gray-800 mb-2'>주소 정보</h4>
                  <div className='space-y-2 text-sm'>
                    <p>
                      <strong>ID:</strong> {result.data.id}
                    </p>
                    <p>
                      <strong>사용자 ID:</strong> {result.data.userId}
                    </p>
                    <p>
                      <strong>닉네임:</strong> {result.data.nickname}
                    </p>
                    <p>
                      <strong>주소 ID:</strong> {result.data.addressId}
                    </p>
                    <p>
                      <strong>기본 주소:</strong>{' '}
                      {result.data.isPrimary ? '예' : '아니오'}
                    </p>
                    <p>
                      <strong>선택된 주소:</strong>{' '}
                      {result.data.isSelected ? '예' : '아니오'}
                    </p>
                    <p>
                      <strong>생성일:</strong>{' '}
                      {new Date(result.data.createdAt).toLocaleString()}
                    </p>

                    <div className='mt-3 pt-3 border-t'>
                      <h5 className='font-medium text-gray-700 mb-2'>
                        주소 상세
                      </h5>
                      <p>
                        <strong>지번 주소:</strong>{' '}
                        {result.data.address.lotAddress}
                      </p>
                      {result.data.address.roadAddress && (
                        <p>
                          <strong>도로명 주소:</strong>{' '}
                          {result.data.address.roadAddress}
                        </p>
                      )}
                      {result.data.address.dong && (
                        <p>
                          <strong>동:</strong> {result.data.address.dong}
                        </p>
                      )}
                      {result.data.address.ho && (
                        <p>
                          <strong>호:</strong> {result.data.address.ho}
                        </p>
                      )}
                      {result.data.address.latitude &&
                        result.data.address.longitude && (
                          <p>
                            <strong>좌표:</strong>{' '}
                            {result.data.address.latitude},{' '}
                            {result.data.address.longitude}
                          </p>
                        )}
                      {result.data.address.legalDistrictCode && (
                        <p>
                          <strong>법정동 코드:</strong>{' '}
                          {result.data.address.legalDistrictCode}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 주소 선택 상태 업데이트 API 테스트 */}
        <div className='bg-white rounded-lg shadow-md p-6 mb-8'>
          <h2 className='text-xl font-semibold text-gray-800 mb-4'>
            주소 선택 상태 업데이트 API 테스트
          </h2>

          <div className='space-y-4'>
            <div>
              <label
                htmlFor='testAddressId'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                주소 ID
              </label>
              <input
                id='testAddressId'
                type='number'
                value={testAddressId}
                onChange={(e) => setTestAddressId(e.target.value)}
                placeholder='주소 ID를 입력하세요'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>

            <button
              onClick={testUpdateSelectedAddress}
              disabled={updateLoading}
              className='w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {updateLoading ? '업데이트 중...' : '주소 선택 상태 업데이트'}
            </button>
          </div>

          {/* 업데이트 결과 표시 */}
          {updateError && (
            <div className='mt-4 p-4 bg-red-50 border border-red-200 rounded-md'>
              <h3 className='text-sm font-medium text-red-800 mb-2'>오류</h3>
              <p className='text-sm text-red-600'>{updateError}</p>
            </div>
          )}

          {updateResult && (
            <div className='mt-4 p-4 bg-green-50 border border-green-200 rounded-md'>
              <h3 className='text-sm font-medium text-green-800 mb-2'>결과</h3>
              <div className='text-sm text-green-600'>
                <p>
                  <strong>성공:</strong>{' '}
                  {updateResult.success ? '예' : '아니오'}
                </p>
                <p>
                  <strong>메시지:</strong> {updateResult.message}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 기존 Toast 테스트 */}
        <div className='bg-white rounded-lg shadow-md p-6'>
          <h2 className='text-xl font-semibold text-gray-800 mb-4'>
            Toast 테스트
          </h2>
          <ToastTest />
        </div>
      </div>
    </div>
  );
}
