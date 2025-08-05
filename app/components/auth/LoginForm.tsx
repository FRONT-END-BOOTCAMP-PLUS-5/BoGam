'use client';

import { useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('로그인에 실패했습니다. 사용자명과 비밀번호를 확인해주세요.');
      } else {
        router.push('/dashboard'); // 로그인 성공 시 리다이렉트
      }
    } catch (error) {
      setError('로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  if (status === 'loading') {
    return <div>로딩 중...</div>;
  }

  if (session) {
    return (
      <div className='max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md'>
        <h2 className='text-2xl font-bold mb-4'>로그인됨</h2>
        <p className='mb-4'>
          안녕하세요, {session.user.name || session.user.username}님!
        </p>
        <button
          onClick={handleLogout}
          className='w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600'
        >
          로그아웃
        </button>
      </div>
    );
  }

  return (
    <div className='max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md'>
      <h2 className='text-2xl font-bold mb-4'>로그인</h2>
      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label htmlFor='username' className='block text-sm font-medium mb-2'>
            사용자명
          </label>
          <input
            type='text'
            id='username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            required
          />
        </div>
        <div className='mb-4'>
          <label htmlFor='password' className='block text-sm font-medium mb-2'>
            비밀번호
          </label>
          <input
            type='password'
            id='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            required
          />
        </div>
        {error && <div className='mb-4 text-red-500 text-sm'>{error}</div>}
        <button
          type='submit'
          disabled={isLoading}
          className='w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50'
        >
          {isLoading ? '로그인 중...' : '로그인'}
        </button>
      </form>
    </div>
  );
}
