'use client';

import GuideStepItem from '@/(anon)/_components/common/guideStepItem/GuideStepItem';
import GuideStepRow from '@/(anon)/_components/common/guideStepContent/GuideStepRow';
import GuideStepText from '@/(anon)/_components/common/guideStepContent/GuideStepText';
import GuideStepContent from '@/(anon)/_components/common/guideStepContent/GuideStepContent';

export default function GuideStepComponentsTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">가이드스탭 컴포넌트 테스트 페이지</h1>
        
        {/* 개요 설명 */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">📋 컴포넌트 개요</h2>
          <p className="text-gray-700 mb-3">
            가이드스탭 컴포넌트들은 단계별 가이드나 체크리스트를 표시할 때 사용하는 컴포넌트 시스템입니다.
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-4">
            <p className="text-blue-800 text-sm">
              <strong>💡 핵심 특징:</strong> 아이콘과 텍스트를 조합하여 시각적으로 명확한 정보 전달, 
              일관된 디자인 시스템, 재사용 가능한 구조
            </p>
          </div>
        </div>

        {/* GuideStepItem 테스트 */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">🔢 GuideStepItem 컴포넌트</h2>
          <p className="text-gray-700 mb-4">
            <strong>용도:</strong> 가이드의 각 단계를 나타내는 컨테이너 컴포넌트입니다. 
            단계 번호, 제목, 구분선을 포함하며, 내부에 다양한 콘텐츠를 담을 수 있습니다.
          </p>
          
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">기본 사용법</h3>
              <GuideStepItem stepNumber="1" title="기본 단계" showDivider={false}>
                <GuideStepText>이것은 기본 단계의 내용입니다.</GuideStepText>
              </GuideStepItem>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">구분선 포함</h3>
              <GuideStepItem stepNumber="2" title="구분선이 있는 단계" showDivider={true}>
                <GuideStepText>이 단계는 아래에 구분선이 있습니다.</GuideStepText>
              </GuideStepItem>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">복잡한 콘텐츠</h3>
              <GuideStepItem stepNumber="3" title="복잡한 콘텐츠 단계" showDivider={true}>
                <GuideStepContent>
                  <GuideStepRow iconType="match">
                    <GuideStepText>성공적인 항목입니다.</GuideStepText>
                  </GuideStepRow>
                  <GuideStepRow iconType="mismatch">
                    <GuideStepText>주의가 필요한 항목입니다.</GuideStepText>
                  </GuideStepRow>
                </GuideStepContent>
              </GuideStepItem>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mt-4">
            <h4 className="font-medium text-gray-900 mb-2">Props 설명:</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li><code className="bg-gray-200 px-1 rounded">stepNumber</code>: 단계 번호 (예: &quot;1&quot;, &quot;3-1&quot;)</li>
              <li><code className="bg-gray-200 px-1 rounded">title</code>: 단계 제목</li>
              <li><code className="bg-gray-200 px-1 rounded">showDivider</code>: 하단 구분선 표시 여부</li>
              <li><code className="bg-gray-200 px-1 rounded">children</code>: 단계 내용 (GuideStepRow, GuideStepText 등)</li>
            </ul>
          </div>
        </div>

        {/* GuideStepRow 테스트 */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">📝 GuideStepRow 컴포넌트</h2>
          <p className="text-gray-700 mb-4">
            <strong>용도:</strong> 아이콘과 텍스트를 한 줄에 표시하는 컴포넌트입니다. 
            아이콘 타입에 따라 자동으로 적절한 CircularIconBadge를 표시하며, 
            link 타입일 경우 자동으로 링크로 렌더링됩니다.
          </p>

          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">아이콘 타입별 예시</h3>
              <div className="space-y-3">
                <GuideStepRow iconType="match">
                  <GuideStepText>✅ 성공/일치 항목 (파란색 체크)</GuideStepText>
                </GuideStepRow>
                <GuideStepRow iconType="mismatch">
                  <GuideStepText>❌ 불일치/경고 항목 (빨간색 X)</GuideStepText>
                </GuideStepRow>
                <GuideStepRow iconType="unchecked">
                  <GuideStepText>⏳ 미확인 항목 (회색 마이너스)</GuideStepText>
                </GuideStepRow>
                <GuideStepRow iconType="link" href="http://localhost:3000/">
                  🔗 링크 항목 (클릭 가능한 링크)
                </GuideStepRow>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">멀티라인 텍스트 (multiLine prop 사용)</h3>
              <GuideStepRow iconType="unchecked">
                <GuideStepText multiLine>
                  <p>첫 번째 줄: 멀티라인 텍스트를 지원합니다.</p>
                  <p>두 번째 줄: 여러 줄의 내용을 표시할 수 있습니다.</p>
                  <p>세 번째 줄: 각 줄은 자동으로 적절한 간격을 가집니다.</p>
                </GuideStepText>
              </GuideStepRow>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">멀티라인 텍스트 (multiLine prop 없이 사용)</h3>
              <GuideStepRow iconType="unchecked">
                <GuideStepText>
                  <p>서울특별시</p>
                  <p>소액보증금 범위 : 1억 5천만원 이하</p>
                  <p>최우선변제금액 : 5천만원</p>
                </GuideStepText>
              </GuideStepRow>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mt-4">
            <h4 className="font-medium text-gray-900 mb-2">Props 설명:</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li><code className="bg-gray-200 px-1 rounded">iconType</code>: 아이콘 타입 (&apos;match&apos;, &apos;mismatch&apos;, &apos;unchecked&apos;, &apos;link&apos;)</li>
              <li><code className="bg-gray-200 px-1 rounded">href</code>: link 타입일 때 이동할 URL (선택사항)</li>
              <li><code className="bg-gray-200 px-1 rounded">children</code>: 표시할 텍스트나 콘텐츠</li>
            </ul>
          </div>
        </div>

        {/* GuideStepText 테스트 */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">📄 GuideStepText 컴포넌트</h2>
          <p className="text-gray-700 mb-4">
            <strong>용도:</strong> 가이드스탭 내에서 텍스트를 표시하는 컴포넌트입니다. 
            일반 텍스트와 멀티라인 텍스트를 모두 지원하며, 일관된 스타일을 적용합니다.
          </p>

          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">일반 텍스트</h3>
              <GuideStepText>
                이것은 일반 텍스트입니다. 한 줄로 표시되며 기본 스타일이 적용됩니다.
              </GuideStepText>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">멀티라인 텍스트 (multiLine prop 사용)</h3>
              <GuideStepText multiLine>
                <p>첫 번째 문단: 멀티라인 텍스트는 여러 줄의 내용을 구조화하여 표시합니다.</p>
                <p>두 번째 문단: 각 문단은 &lt;p&gt; 태그로 감싸야 하며, 자동으로 적절한 간격이 적용됩니다.</p>
                <p>세 번째 문단: 복잡한 정보나 단계별 설명에 유용합니다.</p>
              </GuideStepText>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">멀티라인 텍스트 (multiLine prop 없이 사용)</h3>
              <GuideStepText>
                <p>서울특별시</p>
                <p>소액보증금 범위 : 1억 5천만원 이하</p>
                <p>최우선변제금액 : 5천만원</p>
              </GuideStepText>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mt-4">
            <h4 className="font-medium text-gray-900 mb-2">Props 설명:</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li><code className="bg-gray-200 px-1 rounded">multiLine</code>: 멀티라인 모드 여부 (기본값: false) - <strong>참고: multiLine prop 없이도 &lt;p&gt; 태그를 사용하면 자동으로 멀티라인으로 렌더링됩니다.</strong></li>
              <li><code className="bg-gray-200 px-1 rounded">children</code>: 표시할 텍스트 내용</li>
              <li><code className="bg-gray-200 px-1 rounded">className</code>: 추가 CSS 클래스 (선택사항)</li>
            </ul>
          </div>
        </div>

        {/* GuideStepContent 테스트 */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">📦 GuideStepContent 컴포넌트</h2>
          <p className="text-gray-700 mb-4">
            <strong>용도:</strong> 여러 GuideStepRow를 그룹화하고 일관된 간격을 제공하는 컨테이너 컴포넌트입니다. 
            GuideStepItem 없이도 사용할 수 있어 유연한 레이아웃 구성이 가능합니다.
          </p>

          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">독립적인 콘텐츠 그룹</h3>
              <GuideStepContent>
                <GuideStepRow iconType="match">
                  <GuideStepText>독립적으로 사용되는 성공 항목입니다.</GuideStepText>
                </GuideStepRow>
                <GuideStepRow iconType="mismatch">
                  <GuideStepText>주의가 필요한 독립 항목입니다.</GuideStepText>
                </GuideStepRow>
                <GuideStepRow iconType="link" href="http://localhost:3000/">
                  독립적인 링크 항목입니다.
                </GuideStepRow>
              </GuideStepContent>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">GuideStepItem 내부에서 사용</h3>
              <GuideStepItem stepNumber="4" title="복합 콘텐츠 단계" showDivider={true}>
                <GuideStepContent>
                  <GuideStepRow iconType="unchecked">
                    <GuideStepText>첫 번째 하위 항목</GuideStepText>
                  </GuideStepRow>
                  <GuideStepRow iconType="match">
                    <GuideStepText>두 번째 하위 항목</GuideStepText>
                  </GuideStepRow>
                  <GuideStepRow iconType="link" href="http://localhost:3000/">
                    세 번째 하위 항목 (링크)
                  </GuideStepRow>
                </GuideStepContent>
              </GuideStepItem>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mt-4">
            <h4 className="font-medium text-gray-900 mb-2">Props 설명:</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li><code className="bg-gray-200 px-1 rounded">children</code>: 포함할 GuideStepRow 컴포넌트들</li>
              <li><code className="bg-gray-200 px-1 rounded">className</code>: 추가 CSS 클래스 (선택사항)</li>
            </ul>
          </div>
        </div>

        {/* 실제 사용 예시 */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">🎯 실제 사용 예시</h2>
          <p className="text-gray-700 mb-4">
            아래는 실제 프로젝트에서 사용할 수 있는 가이드스탭의 완성된 예시입니다.
          </p>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-3">임대인 확인 가이드</h3>
            
            <GuideStepItem stepNumber="1" title="공인중개사 자격 확인" showDivider={true}>
              <GuideStepContent>
                <GuideStepRow iconType="match">
                  <GuideStepText>홍길동 씨는 공인중개사 자격증을 소지하고 있습니다.</GuideStepText>
                </GuideStepRow>
                <GuideStepRow iconType="link" href="http://localhost:3000/verify">
                  자격증 상세 정보 확인하기
                </GuideStepRow>
              </GuideStepContent>
            </GuideStepItem>

            <GuideStepItem stepNumber="2" title="중개사무소 등록 현황" showDivider={true}>
              <GuideStepRow iconType="mismatch">
                <GuideStepText>중개사무소 등록이 만료되었습니다.</GuideStepText>
              </GuideStepRow>
              <GuideStepRow iconType="unchecked">
                <GuideStepText multiLine>
                  <p>등록 갱신일: 2024년 12월 31일</p>
                  <p>현재 상태: 갱신 필요</p>
                </GuideStepText>
              </GuideStepRow>
            </GuideStepItem>

            <GuideStepItem stepNumber="3" title="추가 확인 사항" showDivider={false}>
              <GuideStepContent>
                <GuideStepRow iconType="unchecked">
                  <GuideStepText>보증금 반환 약정서 확인</GuideStepText>
                </GuideStepRow>
                <GuideStepRow iconType="unchecked">
                  <GuideStepText>임대차 계약서 표준약관 준수 여부</GuideStepText>
                </GuideStepRow>
              </GuideStepContent>
            </GuideStepItem>
          </div>
        </div>

        {/* 사용 팁 */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-yellow-900 mb-4">💡 사용 팁</h2>
          <ul className="text-yellow-800 space-y-2">
            <li><strong>컴포넌트 조합:</strong> GuideStepItem → GuideStepContent → GuideStepRow → GuideStepText 순서로 조합하여 사용하세요.</li>
            <li><strong>아이콘 선택:</strong> match(성공), mismatch(경고), unchecked(미확인), link(링크) 중 상황에 맞는 아이콘을 선택하세요.</li>
            <li><strong>구분선 활용:</strong> 마지막 단계가 아닌 경우 showDivider={true}를 사용하여 시각적 구분을 만드세요.</li>
            <li><strong>멀티라인 텍스트:</strong> 복잡한 정보는 GuideStepText의 multiLine prop을 활용하여 구조화하세요.</li>
            <li><strong>독립적 사용:</strong> GuideStepItem 없이 GuideStepContent만 사용하여 간단한 체크리스트를 만들 수 있습니다.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
