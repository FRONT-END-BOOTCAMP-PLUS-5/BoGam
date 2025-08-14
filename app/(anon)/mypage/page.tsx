import GuideResultSummary from './_components/GuideResultSummary';
import ResultAccordion from './_components/resultAccordion/ResultAccordion';
import CircularIconBadge from '@/(anon)/_components/common/circularIconBadges/CircularIconBadge';

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

        {/* 결과 아코디언 섹션 */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">가이드 결과 상세</h2>
          
          <ResultAccordion 
            stageNumber="1단계" 
            subtitle="임대인 확인할 때" 
            defaultOpen={true}
            numbers={["1", "10", "9"]}
          >
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-1">
                  <div className="font-bold text-gray-900 mb-1">3-1</div>
                  <h4 className="font-medium text-gray-900 mb-2">가짜 임대인 구분하기</h4>
                  <div className="flex items-center space-x-2">
                    <CircularIconBadge type="match-blue" weight="thick" />
                    <p className="text-gray-700">신흥사부동산중개인사무소의 홍길동 씨는 공인중개사 자격증을 소지하고 있습니다!</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-1">
                  <div className="font-bold text-gray-900 mb-1">3-2</div>
                  <h4 className="font-medium text-gray-900 mb-2">최우선변제 금액 안내</h4>
                  <div className="flex items-center space-x-2">
                    <CircularIconBadge type="unchecked" weight="thick" />
                    <div className="text-gray-700">
                      <p>서울특별시</p>
                      <p>소액보증금 범위 : 1억 5천만원 이하</p>
                      <p>최우선변제금액 : 5천만원</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-1">
                  <div className="font-bold text-gray-900 mb-1">3-3</div>
                  <h4 className="font-medium text-gray-900 mb-2">공제증서 발급 안내</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <CircularIconBadge type="mismatch" weight="thick" />
                      <p className="text-gray-700">공제증서 발급 요건이 불충족되었습니다.</p>
                    </div>
                    <div className="flex items-center space-x-2 text-blue-600 underline cursor-pointer">
                      <CircularIconBadge type="link" weight="thick" />
                      <span>온라인 서비스로 이동하기</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ResultAccordion>

          <ResultAccordion 
            stageNumber="2단계" 
            subtitle="계약서 확인할 때"
            numbers={["2", "8", "7"]}
          >
            <div className="space-y-3">
              <p className="text-gray-700">계약서 관련 상세 내용이 여기에 표시됩니다.</p>
              <p className="text-gray-700">각 항목별로 확인해야 할 사항들을 정리해드립니다.</p>
            </div>
          </ResultAccordion>

          <ResultAccordion 
            stageNumber="3단계" 
            subtitle="입주 전 확인할 때"
            numbers={["3", "6", "5"]}
          >
            <div className="space-y-3">
              <p className="text-gray-700">입주 전 체크리스트가 여기에 표시됩니다.</p>
              <p className="text-gray-700">안전하고 만족스러운 입주를 위한 가이드입니다.</p>
            </div>
          </ResultAccordion>
        </div>
      </div>
    </div>
  );
}
