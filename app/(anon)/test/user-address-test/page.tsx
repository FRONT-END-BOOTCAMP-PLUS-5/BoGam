'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useState } from 'react';

// 동적 렌더링 설정
export const dynamic = 'force-dynamic';



interface UserAddress {
  id: number;
  userId: string;
  addressId: number;
  nickname?: string;
  createdAt: string;
  address: {
    id: number;
    latitude: number;
    longitude: number;
    legalDistrictCode: string;
    dong: string;
    ho: string;
  };
  isPrimary: boolean;
}

export default function UserAddressTestPage() {
  const sessionResult = useSession();
  const session = sessionResult?.data;
  const status = sessionResult?.status;

  // session이 undefined일 때를 대비한 안전한 처리
  const isAuthenticated = !!session?.user?.nickname;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [addressData, setAddressData] = useState({
    address: '서울특별시 강남구 테헤란로 123',
    dong: '101',
    ho: '1503',
    latitude: 37.5665,
    longitude: 126.9780,
    prefArea: 84.95,
    addressNickname: '집',
  });
  const [userAddresses, setUserAddresses] = useState<UserAddress[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const result = await signIn('credentials', {
      username,
      password,
      redirect: false,
    });

    if (result?.error) {
      setMessage(`로그인 실패: ${result.error}`);
    } else {
      setMessage('로그인 성공!');
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    setUserAddresses([]);
    setMessage('로그아웃 완료');
  };

  // 1. 주소 추가 API
  const handleAddAddress = async () => {
    if (!isAuthenticated) {
      setMessage('로그인이 필요합니다.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/user-address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(addressData),
      });

      const result = await response.json();

      if (result.success) {
        setMessage(`주소 추가 성공: ${result.message}`);
        // 주소 목록 새로고침
        handleGetAddresses();
      } else {
        setMessage(`주소 추가 실패: ${result.message}`);
      }
    } catch (error) {
      setMessage(`API 호출 오류: ${error}`);
    }

    setLoading(false);
  };

  // 2. 주소 목록 조회 API
  const handleGetAddresses = async () => {
    if (!isAuthenticated) {
      setMessage('로그인이 필요합니다.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/user-address/my-address-list');
      const result = await response.json();

      if (result.success) {
        setUserAddresses(result.data);
        setMessage(`주소 목록 조회 성공: ${result.data.length}개 주소`);
      } else {
        setMessage(`주소 목록 조회 실패: ${result.message}`);
      }
    } catch (error) {
      setMessage(`API 호출 오류: ${error}`);
    }

    setLoading(false);
  };

  // 3. 즐겨찾기 토글 API
  const handleTogglePrimary = async (userAddressId: number) => {
    if (!isAuthenticated) {
      setMessage('로그인이 필요합니다.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/user-address/toggle-primary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userAddressId }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage(`즐겨찾기 토글 성공: ${result.message}`);
        // 주소 목록 새로고침
        handleGetAddresses();
      } else {
        setMessage(`즐겨찾기 토글 실패: ${result.message}`);
      }
    } catch (error) {
      setMessage(`API 호출 오류: ${error}`);
    }

    setLoading(false);
  };

  return (
    <div className='min-h-screen bg-gray-100 py-12'>
      <div className='container mx-auto max-w-4xl px-4'>
        <h1 className='text-3xl font-bold text-center mb-8'>
          User Address API 테스트
        </h1>

        {/* 로그인 상태 */}
        <div className='bg-white p-6 rounded-lg shadow-md mb-6'>
          <h2 className='text-xl font-semibold mb-4'>현재 상태</h2>
          <p>
            <strong>Status:</strong> {status}
          </p>
          <p>
            <strong>Session:</strong> {session ? '로그인됨' : '로그인 안됨'}
          </p>
          {session && (
            <div className='mt-4 p-4 bg-green-100 rounded'>
              <p>
                <strong>사용자 ID:</strong> {session.user.id}
              </p>
              <p>
                <strong>이름:</strong> {session.user.name}
              </p>
              <p>
                <strong>사용자명:</strong> {session.user.username}
              </p>
              <p>
                <strong>닉네임:</strong> {session.user.nickname}
              </p>
            </div>
          )}
        </div>

        {/* 로그인 폼 */}
        {!isAuthenticated ? (
          <div className='bg-white p-6 rounded-lg shadow-md mb-6'>
            <h2 className='text-xl font-semibold mb-4'>로그인</h2>
            <form onSubmit={handleLogin}>
              <div className='mb-4'>
                <label className='block text-sm font-medium mb-2'>
                  사용자명
                </label>
                <input
                  type='text'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md'
                  required
                />
              </div>
              <div className='mb-4'>
                <label className='block text-sm font-medium mb-2'>
                  비밀번호
                </label>
                <input
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md'
                  required
                />
              </div>
              <button
                type='submit'
                disabled={loading}
                className='w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400'
              >
                {loading ? '로그인 중...' : '로그인'}
              </button>
            </form>
          </div>
        ) : (
          <div className='bg-white p-6 rounded-lg shadow-md mb-6'>
            <h2 className='text-xl font-semibold mb-4'>로그아웃</h2>
            <button
              onClick={handleLogout}
              className='w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600'
            >
              로그아웃
            </button>
          </div>
        )}

        {/* API 테스트 섹션 */}
        {isAuthenticated && (
          <>
            {/* 1. 주소 추가 API */}
            <div className='bg-white p-6 rounded-lg shadow-md mb-6'>
              <h2 className='text-xl font-semibold mb-4'>1. 주소 추가 API</h2>
              <div className='grid grid-cols-2 gap-4 mb-4'>
                <div>
                  <label className='block text-sm font-medium mb-2'>위도</label>
                  <input
                    type='number'
                    step='any'
                    value={addressData.latitude}
                    onChange={(e) =>
                      setAddressData({
                        ...addressData,
                        latitude: parseFloat(e.target.value),
                      })
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-md'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium mb-2'>경도</label>
                  <input
                    type='number'
                    step='any'
                    value={addressData.longitude}
                    onChange={(e) =>
                      setAddressData({
                        ...addressData,
                        longitude: parseFloat(e.target.value),
                      })
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-md'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium mb-2'>
                    주소
                  </label>
                  <input
                    type='text'
                    value={addressData.address}
                    onChange={(e) =>
                      setAddressData({
                        ...addressData,
                        address: e.target.value,
                      })
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-md'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium mb-2'>동</label>
                  <input
                    type='text'
                    value={addressData.dong}
                    onChange={(e) =>
                      setAddressData({ ...addressData, dong: e.target.value })
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-md'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium mb-2'>호</label>
                  <input
                    type='text'
                    value={addressData.ho}
                    onChange={(e) =>
                      setAddressData({ ...addressData, ho: e.target.value })
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-md'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium mb-2'>
                    주소 별명
                  </label>
                  <input
                    type='text'
                    value={addressData.addressNickname}
                    onChange={(e) =>
                      setAddressData({
                        ...addressData,
                        addressNickname: e.target.value,
                      })
                    }
                    className='w-full px-3 py-2 border border-gray-300 rounded-md'
                  />
                </div>
              </div>
              <button
                onClick={handleAddAddress}
                disabled={loading}
                className='w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:bg-gray-400'
              >
                {loading ? '처리 중...' : '주소 추가'}
              </button>
            </div>

            {/* 2. 주소 목록 조회 API */}
            <div className='bg-white p-6 rounded-lg shadow-md mb-6'>
              <h2 className='text-xl font-semibold mb-4'>
                2. 주소 목록 조회 API
              </h2>
              <button
                onClick={handleGetAddresses}
                disabled={loading}
                className='w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400 mb-4'
              >
                {loading ? '조회 중...' : '주소 목록 조회'}
              </button>

              {userAddresses.length > 0 && (
                <div className='mt-4'>
                  <h3 className='font-semibold mb-2'>조회된 주소 목록:</h3>
                  <div className='space-y-2'>
                    {userAddresses.map((address) => (
                      <div
                        key={address.id}
                        className='p-3 border rounded bg-gray-50'
                      >
                        <div className='flex justify-between items-center'>
                          <div>
                            <p>
                              <strong>ID:</strong> {address.id}
                            </p>
                            <p>
                              <strong>별명:</strong>{' '}
                              {address.nickname || '없음'}
                            </p>
                            <p>
                              <strong>주소:</strong> {address.address.dong}{' '}
                              {address.address.ho}
                            </p>
                            <p>
                              <strong>좌표:</strong> {address.address.latitude},{' '}
                              {address.address.longitude}
                            </p>
                            <p>
                              <strong>즐겨찾기:</strong>{' '}
                              {address.isPrimary ? '✅' : '❌'}
                            </p>
                          </div>
                          <button
                            onClick={() => handleTogglePrimary(address.id)}
                            disabled={loading}
                            className='bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 disabled:bg-gray-400'
                          >
                            {address.isPrimary
                              ? '즐겨찾기 해제'
                              : '즐겨찾기 추가'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* 메시지 표시 */}
        {message && (
          <div className='bg-white p-4 rounded-lg shadow-md mb-6'>
            <h3 className='font-semibold mb-2'>응답 메시지:</h3>
            <p className='text-sm bg-gray-100 p-3 rounded'>{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
