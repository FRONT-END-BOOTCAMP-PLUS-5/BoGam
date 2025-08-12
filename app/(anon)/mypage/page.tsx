import GuideResultSummary from './_components/GuideResultSummary';

export default function MyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-8 text-center">마이페이지</h1>
        
        {/* 가이드 결과 요약 컴포넌트 */}
        <GuideResultSummary />
      </div>
    </div>
  );
}
