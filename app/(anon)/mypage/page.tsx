import GuideResultSummary from './_components/GuideResultSummary';

export default function MyPage() {
  // 랜덤 데이터 생성 (0~100 사이)
  const generateRandomValue = () => Math.floor(Math.random() * 101);
  
  const match = generateRandomValue();        // 안전
  const mismatch = generateRandomValue();      // 경고
  const unchecked = generateRandomValue();     // 미확인

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
