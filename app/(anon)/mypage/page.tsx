import GuideResultSummary from './_components/GuideResultSummary';

export default function MyPage() {
  // 예시 데이터 (실제로는 API에서 가져올 값들)
  const match = 15;        // 안전
  const mismatch = 9;      // 경고
  const unchecked = 4;     // 미확인

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-8 text-center">마이페이지</h1>
        
        {/* 가이드 결과 요약 컴포넌트 */}
        <GuideResultSummary 
          match={match}
          mismatch={mismatch}
          unchecked={unchecked}
        />
      </div>
    </div>
  );
}
