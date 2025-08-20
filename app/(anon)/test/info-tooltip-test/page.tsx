import React from 'react';
import InfoToolTip from '@/(anon)/_components/common/infoToolTip/InfoToolTip';

export default function InfoToolTipTestPage() {
  return (
    <div className="p-8 font-sans max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">InfoToolTip 컴포넌트 테스트</h1>
      
      <div className="space-y-8">
        {/* 기본 사용법 */}
        <section className="border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">기본 사용법</h2>
          <div className="text-lg">
            사업자상호 : <InfoToolTip 
              term="신흥사부동산중개인사"
              definition="사업자가 사업 활동을 위해 사용하는 명칭"
            />
          </div>
        </section>

        {/* 여러 줄 설명 */}
        <section className="border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">여러 줄 설명</h2>
          <div className="text-lg">
            중개수수료 : <InfoToolTip 
              term="중개수수료"
              definition={[
                "부동산 중개업자가 중개 서비스를 제공한 대가로 받는 수수료",
                "일반적으로 거래금액의 0.1~0.9% 범위에서 협의 결정",
                "법정 상한선이 있음"
              ]}
            />
          </div>
        </section>

        {/* 부동산 관련 용어들 */}
        <section className="border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">부동산 관련 용어</h2>
          <div className="space-y-3 text-lg">
            <div>
              <InfoToolTip 
                term="부동산중개업"
                definition="부동산의 거래, 임대차, 교환을 중개하는 업무"
              /> : 부동산 거래를 중개하는 업무
            </div>
            <div>
              <InfoToolTip 
                term="전세권"
                definition="건물이나 토지를 사용하고 수익할 수 있는 권리"
              /> : 건물 사용권
            </div>
            <div>
              <InfoToolTip 
                term="임대차"
                definition={[
                  "건물이나 토지를 빌려서 사용하는 계약",
                  "월세, 전세 등이 포함됨"
                ]}
              /> : 임대 계약
            </div>
          </div>
        </section>

        {/* 긴 텍스트와 함께 사용 */}
        <section className="border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">긴 텍스트와 함께 사용</h2>
          <p className="text-lg leading-relaxed">
            부동산 거래 시에는 <InfoToolTip 
              term="중개업소"
              definition="부동산 중개업을 영위하는 업소"
            />를 통해 거래하는 것이 일반적입니다. 
            특히 <InfoToolTip 
              term="아파트"
              definition="공동주택의 한 형태로, 여러 가구가 한 건물에 거주하는 주택"
            />나 <InfoToolTip 
              term="빌라"
              definition="소규모 다세대 주택으로, 보통 3-5층 정도의 건물"
            />와 같은 공동주택의 경우 중개업소를 통한 거래가 필수적입니다.
          </p>
        </section>

        {/* 경계 테스트 - 화면 끝에서 툴팁이 잘리지 않는지 확인 */}
        <section className="border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">경계 테스트 (화면 끝에서 잘리지 않음)</h2>
          <div className="flex justify-between items-start space-x-4">
            <div className="text-lg">
              왼쪽 끝: <InfoToolTip 
                term="왼쪽용어"
                definition="화면 왼쪽 끝에서 툴팁이 잘리지 않는지 테스트"
              />
            </div>
            <div className="text-lg">
              오른쪽 끝: <InfoToolTip 
                term="오른쪽용어"
                definition="화면 오른쪽 끝에서 툴팁이 잘리지 않는지 테스트"
              />
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <div className="text-lg">
              중앙: <InfoToolTip 
                term="중앙용어"
                definition="화면 중앙에서 툴팁이 제대로 표시되는지 테스트"
              />
            </div>
          </div>
        </section>

        {/* 스타일 테스트 */}
        <section className="border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">스타일 테스트</h2>
          <div className="space-y-2">
            <div className="text-sm">
              작은 글씨: <InfoToolTip 
                term="소형"
                definition="크기가 작은 것"
              />
            </div>
            <div className="text-2xl">
              큰 글씨: <InfoToolTip 
                term="대형"
                definition="크기가 큰 것"
              />
            </div>
            <div className="text-blue-600">
              파란색: <InfoToolTip 
                term="색상"
                definition="빛의 파장에 따라 달라지는 시각적 특성빛의 파장에 따라 달라지는 시각적 특성빛의 파장에 따라 달라지는 시각적 특성빛의 파장에 따라 달라지는 시각적 특성빛의 파장에 따라 달라지는 시각적 특성빛의 파장에 따라 달라지는 시각적 특성빛의 파장에 따라 달라지는 시각적 특성빛의 파장에 따라 달라지는 시각적 특성빛의 파장에 따라 달라지는 시각적 특성빛의 파장에 따라 달라지는 시각적 특성빛의 파장에 따라 달라지는 시각적 특성"
              />
            </div>
          </div>
        </section>
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold mb-2">사용법:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>하이라이트된 용어를 클릭하면 툴팁이 나타납니다</li>
          <li>툴팁 영역 밖을 클릭하면 자동으로 닫힙니다</li>
          <li>단일 설명과 여러 줄 설명 모두 지원합니다</li>
          <li>용어는 초록색, 볼드, 밑줄로 표시됩니다</li>
          <li>화면 <InfoToolTip 
                term="색상"
                definition="빛의 파장에 따라 달라지는 시각적 특성빛의 파장에 따라 달라지는 시각적 특성빛의 파장에 따라 달라지는 시각적 특성빛의 파장에 따라 달라지는 시각적 특성빛의 파장에 따라 달라지는 시각적 특성빛의 파장에 따라 달라지는 시각적 특성빛의 파장에 따라 달라지는 시각적 특성빛의 파장에 따라 달라지는 시각적 특성빛의 파장에 따라 달라지는 시각적 특성빛의 파장에 따라 달라지는 시각적 특성빛의 파장에 따라 달라지는 시각적 특성"
              /> 툴팁이 잘리지 않도록 자동으로 위치가 조정됩니다</li>
        </ul>
      </div>
    </div>
  );
}
