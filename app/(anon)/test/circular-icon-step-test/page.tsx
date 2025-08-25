'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import CircularIconBadge from '@/(anon)/_components/common/circularIconBadges/CircularIconBadge';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import { parseStepUrl } from '@utils/stepUrlParser';
import stepResultQueryApi from '@libs/api_front/stepResultQueries.api';

export default function CircularIconStepTestPage() {
  const pathname = usePathname();
  const { selectedAddress } = useUserAddressStore();
  
  // 가상 URL 상태 관리 (실제 라우팅하지 않음)
  const [virtualPath, setVirtualPath] = useState('/steps/1/2'); // 기본값 설정
  const stepInfo = parseStepUrl(virtualPath);
  
  const [stepDetails, setStepDetails] = useState<Record<string, 'match' | 'mismatch' | 'unchecked'>>({
    '표제부': 'unchecked',
    '갑구': 'unchecked',
    '을구': 'unchecked'
  });

  const [apiResult, setApiResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // URL이 바뀔 때 기존 데이터 가져오기
  useEffect(() => {
    const fetchExistingData = async () => {
      if (!stepInfo || !selectedAddress) return;
      
      setIsLoading(true);
      try {
        console.log('🔍 기존 데이터 가져오기 시작:', { 
          stepNumber: stepInfo.stepNumber, 
          detail: stepInfo.detail,
          userAddressId: selectedAddress.id 
        });
        
        const existingData = await stepResultQueryApi.getStepResult({
          userAddressNickname: selectedAddress?.nickname || '채원강남집',
          stepNumber: stepInfo.stepNumber.toString(),
          detail: stepInfo.detail.toString()
        });
        
        console.log('✅ 기존 데이터 가져오기 성공:', existingData);
        
        if (existingData.jsonDetails) {
          // API에서 받은 jsonDetails를 현재 상태와 병합
          // 타입 안전성을 위해 필터링
          const filteredDetails: Record<string, 'match' | 'mismatch' | 'unchecked'> = {};
          Object.entries(existingData.jsonDetails).forEach(([key, value]) => {
            if (value === 'match' || value === 'mismatch' || value === 'unchecked') {
              filteredDetails[key] = value;
            }
          });
          
          // 기본 템플릿과 병합 (기존 데이터가 우선)
          const defaultTemplate: Record<string, 'match' | 'mismatch' | 'unchecked'> = {
            '표제부': 'unchecked',
            '갑구': 'unchecked',
            '을구': 'unchecked'
          };
          const mergedDetails = { ...defaultTemplate, ...filteredDetails };
          
          setStepDetails(mergedDetails);
          setApiResult(`✅ 기존 데이터 로드됨: ${Object.keys(filteredDetails).length}개 항목`);
        } else {
          // 기존 데이터가 없으면 기본 템플릿 사용
          setStepDetails({
            '표제부': 'unchecked' as const,
            '갑구': 'unchecked' as const,
            '을구': 'unchecked' as const
          });
          setApiResult('ℹ️ 기존 데이터 없음 - 기본 템플릿 사용');
        }
      } catch (error) {
        console.log('❌ 기존 데이터 가져오기 실패:', error);
        // 에러 발생 시에는 기본 템플릿 사용
        setStepDetails({
          '표제부': 'unchecked' as const,
          '갑구': 'unchecked' as const,
          '을구': 'unchecked' as const
        });
        setApiResult('❌ 기존 데이터 가져오기 실패');
      } finally {
        setIsLoading(false);
      }
    };

    fetchExistingData();
  }, [virtualPath, selectedAddress, stepInfo]); // virtualPath나 selectedAddress, stepInfo가 바뀔 때마다 실행

  const handleStepResultUpdate = (newDetails: Record<string, 'match' | 'mismatch' | 'unchecked'>) => {
    setStepDetails(newDetails);
    setApiResult('✅ Step Result 업데이트 성공!');
  };

  // 가상 URL 변경 함수 (실제 라우팅하지 않음)
  const changeUrl = (stepNumber: number, detail: number) => {
    const newPath = `/steps/${stepNumber}/${detail}`;
    console.log('🔄 URL 변경:', { from: virtualPath, to: newPath, stepNumber, detail });
    setVirtualPath(newPath);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">CircularIconBadge Step Result 테스트</h1>
      
      <div className="bg-blue-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-3">URL 정보</h2>
        <p><strong>실제 경로:</strong> {pathname}</p>
        <p><strong>가상 경로:</strong> {virtualPath}</p>
        {stepInfo ? (
          <>
            <p><strong>Main:</strong> {stepInfo.stepNumber}</p>
            <p><strong>Sub:</strong> {stepInfo.detail}</p>
            {isLoading && <p className="text-blue-600">🔄 기존 데이터 로딩 중...</p>}
          </>
        ) : (
          <p>⚠️ Steps URL이 아닙니다</p>
        )}
        
        {/* URL 변경 버튼들 */}
        <div className="mt-4">
          <h3 className="text-md font-medium mb-2">테스트용 URL 변경:</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => changeUrl(1, 2)}
              className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            >
              Steps 1-2
            </button>
            <button
              onClick={() => changeUrl(3, 1)}
              className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            >
              Steps 3-1
            </button>
            <button
              onClick={() => changeUrl(5, 3)}
              className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            >
              Steps 5-3
            </button>
            <button
              onClick={() => setVirtualPath('/test/circular-icon-step-test')}
              className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
            >
              테스트 페이지로 돌아가기
            </button>
          </div>
        </div>
      </div>

      <div className="bg-green-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-3">주소 정보</h2>
        {selectedAddress ? (
          <p>ID: {selectedAddress.id}, 닉네임: {selectedAddress.nickname}</p>
        ) : (
          <p>선택된 주소 없음</p>
        )}
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-3">Step Details 테스트</h2>
        
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(stepDetails).map(([key, value]) => (
            <div key={key} className="flex items-center gap-3">
              <span className="text-sm font-medium">{key}:</span>
              <CircularIconBadge
                type={value === 'match' ? 'match-blue' : value === 'mismatch' ? 'mismatch' : 'unchecked'}
                size="md"
                clickable={value === 'unchecked' || value === 'match'}
                stepData={stepInfo ? {
                  stepNumber: stepInfo.stepNumber,
                  detail: stepInfo.detail,
                  currentDetails: stepDetails,
                  currentKey: key, // 현재 뱃지의 키 전달
                  onStepResultUpdate: handleStepResultUpdate
                } : undefined}
              />
              <span className="text-xs">({value})</span>
            </div>
          ))}
        </div>

        {/* 클릭 불가능한 뱃지 예시 */}
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h4 className="text-sm font-medium mb-3 text-gray-700">클릭 불가능한 뱃지 예시</h4>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <CircularIconBadge type="match" size="md" clickable={false} />
              <span className="text-xs text-gray-600">클릭 불가능한 match</span>
            </div>
            <div className="flex items-center gap-2">
              <CircularIconBadge type="unchecked" size="md" clickable={false} />
              <span className="text-xs text-gray-600">클릭 불가능한 unchecked</span>
            </div>
            <div className="flex items-center gap-2">
              <CircularIconBadge type="mismatch" size="md" clickable={false} />
              <span className="text-xs text-gray-600">클릭 불가능한 mismatch</span>
            </div>
          </div>
        </div>
      </div>

      {apiResult && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">API 결과</h2>
          <p>{apiResult}</p>
        </div>
      )}

      <div className="bg-gray-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-3">사용법</h2>
        <p className="text-sm">1. unchecked 뱃지를 클릭하면 match로 변경되고 API가 호출됩니다</p>
        <p className="text-sm">2. match 뱃지를 클릭하면 unchecked로 변경됩니다 (토글 기능)</p>
        <p className="text-sm">3. 위의 &quot;Steps X-Y&quot; 버튼을 클릭하여 가상 URL을 변경하세요</p>
        <p className="text-sm">4. 가상 URL이 변경되면 자동으로 기존 데이터를 가져옵니다 (GET 요청)</p>
        <p className="text-sm">5. 가상 URL이 변경되면 stepNumber, detail이 자동으로 파싱됩니다</p>
        <p className="text-sm">6. &quot;테스트 페이지로 돌아가기&quot; 버튼으로 원래 가상 경로로 돌아갈 수 있습니다</p>
        <p className="text-sm">7. 실제 페이지는 이동하지 않고 테스트 페이지 안에서 시뮬레이션됩니다</p>
      </div>
    </div>
  );
}
