'use client';

import TextBadge from '@/(anon)/@detail/steps/[step-number]/[detail]/_components/TextBadge';

export default function StyleTextBadgesPage() {
  return (
    <div className='p-6 space-y-8 bg-gray-100 min-h-screen'>
      <h1 className='text-2xl font-bold text-center mb-8'>
        텍스트 뱃지 컴포넌트 스타일 가이드
      </h1>

      {/* Match 타입 */}
      <section className='space-y-4'>
        <h2 className='text-xl font-semibold text-brand-green'>
          Match 타입 (안전)
        </h2>
        <div className='flex flex-wrap gap-4'>
          <TextBadge type='match' size='sm' />
          <TextBadge type='match' size='md' />
          <TextBadge type='match' size='lg' />
        </div>
      </section>

      {/* Mismatch 타입 */}
      <section className='space-y-4'>
        <h2 className='text-xl font-semibold text-brand-error'>
          Mismatch 타입 (경고)
        </h2>
        <div className='flex flex-wrap gap-4'>
          <TextBadge type='mismatch' size='sm' />
          <TextBadge type='mismatch' size='md' />
          <TextBadge type='mismatch' size='lg' />
        </div>
      </section>

      {/* Unchecked 타입 */}
      <section className='space-y-4'>
        <h2 className='text-xl font-semibold text-brand-dark-gray'>
          Unchecked 타입 (미확인)
        </h2>
        <div className='flex flex-wrap gap-4'>
          <TextBadge type='unchecked' size='sm' />
          <TextBadge type='unchecked' size='md' />
          <TextBadge type='unchecked' size='lg' />
        </div>
      </section>

      {/* 크기별 비교 */}
      <section className='space-y-4'>
        <h2 className='text-xl font-semibold'>크기별 비교</h2>
        <div className='space-y-4'>
          <div className='flex items-center gap-4'>
            <span className='w-16 text-sm font-medium'>Small:</span>
            <TextBadge type='match' size='sm' />
            <TextBadge type='mismatch' size='sm' />
            <TextBadge type='unchecked' size='sm' />
          </div>
          <div className='flex items-center gap-4'>
            <span className='w-16 text-sm font-medium'>Medium:</span>
            <TextBadge type='match' size='md' />
            <TextBadge type='mismatch' size='md' />
            <TextBadge type='unchecked' size='md' />
          </div>
          <div className='flex items-center gap-4'>
            <span className='w-16 text-sm font-medium'>Large:</span>
            <TextBadge type='match' size='lg' />
            <TextBadge type='mismatch' size='lg' />
            <TextBadge type='unchecked' size='lg' />
          </div>
        </div>
      </section>

      {/* 사용 예시 */}
      <section className='space-y-4'>
        <h2 className='text-xl font-semibold'>사용 예시</h2>
        <div className='space-y-3 p-4 bg-gray-50 rounded-lg'>
          <div className='flex items-center gap-2'>
            <span>상태:</span>
            <TextBadge type='match' size='sm' />
          </div>
          <div className='flex items-center gap-2'>
            <span>결과:</span>
            <TextBadge type='mismatch' size='md' />
          </div>
          <div className='flex items-center gap-2'>
            <span>확인:</span>
            <TextBadge type='unchecked' size='sm' />
          </div>
        </div>
      </section>

      {/* CSS 변수 정보 */}
      <section className='space-y-4'>
        <h2 className='text-xl font-semibold'>사용된 Tailwind 색상 변수</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
          <div className='p-3 bg-white border rounded-lg'>
            <div className='font-medium'>Match (안전)</div>
            <div className='text-gray-600'>배경: bg-white</div>
            <div className='text-gray-600'>
              아이콘 & 텍스트: text-brand-green = #4fa373
            </div>
          </div>
          <div className='p-3 bg-white border rounded-lg'>
            <div className='font-medium'>Mismatch (경고)</div>
            <div className='text-gray-600'>배경: bg-white</div>
            <div className='text-gray-600'>
              아이콘 & 텍스트: text-brand-error = #c24a4a
            </div>
          </div>
          <div className='p-3 bg-white border rounded-lg'>
            <div className='font-medium'>Unchecked (미확인)</div>
            <div className='text-gray-600'>배경: bg-white</div>
            <div className='text-gray-600'>
              아이콘 & 텍스트: text-brand-dark-gray = #6d6d6d
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
