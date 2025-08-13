'use client';

import { CircularIconBadge } from '@/(anon)/_components/common/circular-icon-badges';

export default function StyleBadgesPage() {
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-center mb-8">뱃지 컴포넌트 스타일 가이드</h1>

      {/* 크기별 비교 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">크기별 비교</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="w-16 text-sm font-medium">Small:</span>
            <CircularIconBadge type="match" size="sm" />
            <CircularIconBadge type="match-blue" size="sm" />
            <CircularIconBadge type="mismatch" size="sm" />
            <CircularIconBadge type="uncheck" size="sm" />
            <CircularIconBadge type="link" size="sm" />
          </div>
          <div className="flex items-center gap-4">
            <span className="w-16 text-sm font-medium">Medium:</span>
            <CircularIconBadge type="match" size="md" />
            <CircularIconBadge type="match-blue" size="md" />
            <CircularIconBadge type="mismatch" size="md" />
            <CircularIconBadge type="uncheck" size="md" />
            <CircularIconBadge type="link" size="md" />
          </div>
          <div className="flex items-center gap-4">
            <span className="w-16 text-sm font-medium">Large:</span>
            <CircularIconBadge type="match" size="lg" />
            <CircularIconBadge type="match-blue" size="lg" />
            <CircularIconBadge type="mismatch" size="lg" />
            <CircularIconBadge type="uncheck" size="lg" />
            <CircularIconBadge type="link" size="lg" />
          </div>
        </div>
      </section>

      {/* 두께별 비교 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">두께별 비교</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="w-16 text-sm font-medium">Thin:</span>
            <CircularIconBadge type="match" weight="thin" />
            <CircularIconBadge type="mismatch" weight="thin" />
            <CircularIconBadge type="uncheck" weight="thin" />
            <CircularIconBadge type="link" weight="thin" />
          </div>
          <div className="flex items-center gap-4">
            <span className="w-16 text-sm font-medium">Normal:</span>
            <CircularIconBadge type="match" weight="normal" />
            <CircularIconBadge type="mismatch" weight="normal" />
            <CircularIconBadge type="uncheck" weight="normal" />
            <CircularIconBadge type="link" weight="normal" />
          </div>
          <div className="flex items-center gap-4">
            <span className="w-16 text-sm font-medium">Thick:</span>
            <CircularIconBadge type="match" weight="thick" />
            <CircularIconBadge type="mismatch" weight="thick" />
            <CircularIconBadge type="uncheck" weight="thick" />
            <CircularIconBadge type="link" weight="thick" />
          </div>
        </div>
      </section>

      {/* 중단계 결과 확인용 아이콘 세트 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--brand)]">중단계 결과 확인용 아이콘 세트</h2>
        <div className="flex flex-wrap gap-4">
          <CircularIconBadge type="match-blue" weight="thick" />
          <CircularIconBadge type="mismatch" weight="thick" />
          <CircularIconBadge type="uncheck" weight="thick" />
          <CircularIconBadge type="link" weight="thick" />
        </div>
      </section>

      {/* 마이페이지 결과 확인용 아이콘 세트 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--brand-green)]">마이페이지 결과 확인용 아이콘 세트</h2>
        <div className="flex flex-wrap gap-4">
          <CircularIconBadge type="match" weight="thin" />
          <CircularIconBadge type="mismatch" weight="thin" />
          <CircularIconBadge type="uncheck" weight="thin" />
        </div>
      </section>

      {/* 사용 예시 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">사용 예시</h2>
        <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <span>상태:</span>
            <CircularIconBadge type="match" size="sm" />
          </div>
          <div className="flex items-center gap-2">
            <span>결과:</span>
            <CircularIconBadge type="mismatch" size="md" />
          </div>
          <div className="flex items-center gap-2">
            <span>확인:</span>
            <CircularIconBadge type="uncheck" size="sm" />
          </div>
        </div>
      </section>

      {/* CSS 변수 정보 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">사용된 CSS 변수</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="p-3 bg-white border rounded-lg">
            <div className="font-medium">Match (일치)</div>
            <div className="text-gray-600">배경: var(--brand-green) = #4fa373</div>
            <div className="text-gray-600">아이콘: white</div>
          </div>
          <div className="p-3 bg-white border rounded-lg">
            <div className="font-medium">Match Blue (파란색 일치)</div>
            <div className="text-gray-600">배경: var(--brand) = #4b72a6</div>
            <div className="text-gray-600">아이콘: white</div>
          </div>
          <div className="p-3 bg-white border rounded-lg">
            <div className="font-medium">Mismatch (불일치)</div>
            <div className="text-gray-600">배경: var(--error) = #c24a4a</div>
            <div className="text-gray-600">아이콘: white</div>
          </div>
          <div className="p-3 bg-white border rounded-lg">
            <div className="font-medium">Uncheck (미확인)</div>
            <div className="text-gray-600">배경: var(--brand-light-gray) = #e5e7eb</div>
            <div className="text-gray-600">아이콘: var(--brand-dark-gray) = #6D6D6D</div>
          </div>
          <div className="p-3 bg-white border rounded-lg">
            <div className="font-medium">Link (링크)</div>
            <div className="text-gray-600">배경: var(--brand-gold) = #a68a56</div>
            <div className="text-gray-600">아이콘: white</div>
          </div>
        </div>
      </section>
    </div>
  );
}
