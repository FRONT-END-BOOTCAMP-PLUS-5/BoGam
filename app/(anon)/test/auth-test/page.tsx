'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useState } from 'react';

export default function AuthTestPage() {
  const { data: session, status } = useSession();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await signIn('credentials', {
      username,
      password,
      redirect: false,
    });

    console.log('Login result:', result);
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
  };

  return (
    <div className='min-h-screen bg-gray-100 py-12'>
      <div className='container mx-auto max-w-md'>
        <h1 className='text-3xl font-bold text-center mb-8'>NextAuth 테스트</h1>

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
            </div>
          )}
        </div>

        {!session ? (
          <div className='bg-white p-6 rounded-lg shadow-md'>
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
                className='w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600'
              >
                로그인
              </button>
            </form>
          </div>
        ) : (
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <h2 className='text-xl font-semibold mb-4'>로그아웃</h2>
            <button
              onClick={handleLogout}
              className='w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600'
            >
              로그아웃
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
