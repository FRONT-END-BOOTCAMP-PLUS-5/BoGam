'use client';

import { useState } from 'react';
import StateIconItem from '@/(anon)/_components/common/stateIcon/StateIconItem';
import Button from '@/(anon)/_components/common/button/Button';

export default function StateIconTestPage() {
  const [counts, setCounts] = useState({
    completed: 5,
    unconfirmed: 3,
    warning: 1,
  });

  const incrementCount = (type: 'completed' | 'unconfirmed' | 'warning') => {
    setCounts((prev) => ({
      ...prev,
      [type]: prev[type] + 1,
    }));
  };

  const decrementCount = (type: 'completed' | 'unconfirmed' | 'warning') => {
    setCounts((prev) => ({
      ...prev,
      [type]: Math.max(0, prev[type] - 1),
    }));
  };

  const resetCounts = () => {
    setCounts({
      completed: 5,
      unconfirmed: 3,
      warning: 1,
    });
  };

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-4xl mx-auto px-4'>
        <h1 className='text-3xl font-bold text-center mb-8 text-brand-black'>
          StateIcon 컴포넌트 테스트
        </h1>

        {/* 기본 사용 예시 */}
        <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
          <h2 className='text-xl font-semibold mb-4 text-brand-black'>
            기본 StateIcon 아이템들
          </h2>

          <div className='space-y-4'>
            <div className='flex gap-4'>
              <div className='flex-1'>
                <StateIconItem type='completed' count={counts.completed} />
              </div>
              <div className='flex gap-2'>
                <Button
                  onClick={() => decrementCount('completed')}
                  variant='secondary'
                  className='px-3 py-1 text-sm'
                >
                  -
                </Button>
                <Button
                  onClick={() => incrementCount('completed')}
                  variant='primary'
                  className='px-3 py-1 text-sm'
                >
                  +
                </Button>
              </div>
            </div>

            <div className='flex gap-4'>
              <div className='flex-1'>
                <StateIconItem type='unconfirmed' count={counts.unconfirmed} />
              </div>
              <div className='flex gap-2'>
                <Button
                  onClick={() => decrementCount('unconfirmed')}
                  variant='secondary'
                  className='px-3 py-1 text-sm'
                >
                  -
                </Button>
                <Button
                  onClick={() => incrementCount('unconfirmed')}
                  variant='primary'
                  className='px-3 py-1 text-sm'
                >
                  +
                </Button>
              </div>
            </div>

            <div className='flex gap-4'>
              <div className='flex-1'>
                <StateIconItem type='warning' count={counts.warning} />
              </div>
              <div className='flex gap-2'>
                <Button
                  onClick={() => decrementCount('warning')}
                  variant='secondary'
                  className='px-3 py-1 text-sm'
                >
                  -
                </Button>
                <Button
                  onClick={() => incrementCount('warning')}
                  variant='primary'
                  className='px-3 py-1 text-sm'
                >
                  +
                </Button>
              </div>
            </div>
          </div>

          <div className='mt-6 flex justify-center'>
            <Button onClick={resetCounts} variant='ghost'>
              초기값으로 리셋
            </Button>
          </div>
        </div>

        {/* 그룹으로 사용하는 예시 */}
        <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
          <h2 className='text-xl font-semibold mb-4 text-brand-black'>
            그룹으로 사용 (실제 사용 예시)
          </h2>

          <div className='flex gap-1.5 w-full'>
            <StateIconItem type='completed' count={counts.completed} />
            <StateIconItem type='unconfirmed' count={counts.unconfirmed} />
            <StateIconItem type='warning' count={counts.warning} />
          </div>
        </div>

        {/* 다양한 개수로 테스트 */}
        <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
          <h2 className='text-xl font-semibold mb-4 text-brand-black'>
            다양한 개수 테스트
          </h2>

          <div className='space-y-4'>
            <div>
              <h3 className='text-sm font-medium text-gray-600 mb-2'>
                개수 0개
              </h3>
              <div className='flex gap-1.5'>
                <StateIconItem type='completed' count={0} />
                <StateIconItem type='unconfirmed' count={0} />
                <StateIconItem type='warning' count={0} />
              </div>
            </div>

            <div>
              <h3 className='text-sm font-medium text-gray-600 mb-2'>
                개수 1개
              </h3>
              <div className='flex gap-1.5'>
                <StateIconItem type='completed' count={1} />
                <StateIconItem type='unconfirmed' count={1} />
                <StateIconItem type='warning' count={1} />
              </div>
            </div>

            <div>
              <h3 className='text-sm font-medium text-gray-600 mb-2'>
                큰 숫자
              </h3>
              <div className='flex gap-1.5'>
                <StateIconItem type='completed' count={99} />
                <StateIconItem type='unconfirmed' count={123} />
                <StateIconItem type='warning' count={999} />
              </div>
            </div>
          </div>
        </div>

        {/* 개별 아이템 상세 */}
        <div className='bg-white rounded-lg shadow-md p-6'>
          <h2 className='text-xl font-semibold mb-4 text-brand-black'>
            각 상태별 상세 정보
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='text-center'>
              <StateIconItem type='completed' count={counts.completed} />
              <div className='mt-3 text-sm text-gray-600'>
                <p className='font-semibold text-green-600'>확인 완료</p>
                <p>✅ Check 아이콘</p>
                <p>🎨 초록색 배경</p>
                <p>📝 흰색 텍스트</p>
              </div>
            </div>

            <div className='text-center'>
              <StateIconItem type='unconfirmed' count={counts.unconfirmed} />
              <div className='mt-3 text-sm text-gray-600'>
                <p className='font-semibold text-gray-600'>미확인</p>
                <p>❌ X 아이콘 (빨간색)</p>
                <p>🎨 회색 배경</p>
                <p>📝 회색 텍스트</p>
              </div>
            </div>

            <div className='text-center'>
              <StateIconItem type='warning' count={counts.warning} />
              <div className='mt-3 text-sm text-gray-600'>
                <p className='font-semibold text-red-600'>경고</p>
                <p>😱 이모지 아이콘</p>
                <p>🎨 빨간색 배경</p>
                <p>📝 흰색 텍스트</p>
              </div>
            </div>
          </div>
        </div>

        {/* 사용법 안내 */}
        <div className='bg-white rounded-lg shadow-md p-6 mt-6'>
          <h2 className='text-xl font-semibold mb-4 text-brand-black'>
            사용법
          </h2>

          <div className='space-y-4 text-sm text-brand-dark-gray'>
            <div>
              <h3 className='font-semibold text-brand-black'>기본 사용:</h3>
              <pre className='bg-gray-100 p-3 rounded mt-2 overflow-x-auto'>
                {`<StateIconItem type="completed" count={5} />
<StateIconItem type="unconfirmed" count={3} />
<StateIconItem type="warning" count={1} />`}
              </pre>
            </div>

            <div>
              <h3 className='font-semibold text-brand-black'>그룹으로 사용:</h3>
              <pre className='bg-gray-100 p-3 rounded mt-2 overflow-x-auto'>
                {`<div className="flex gap-1.5 w-full">
  <StateIconItem type="completed" count={5} />
  <StateIconItem type="unconfirmed" count={3} />
  <StateIconItem type="warning" count={1} />
</div>`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
