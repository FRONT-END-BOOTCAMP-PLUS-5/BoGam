interface TooltipData {
  tooltips: Record<string, string | string[]>;
}

// tooltip 단어 JSON 파일을 로드하는 함수
export const loadTooltipWords = async (): Promise<TooltipData> => {
  try {
    //Next.js에서 JSON 파일을 import할 때는 상대 경로를 사용해야 함
    const tooltipModule = await import('../app/(anon)/_components/common/infoToolTip/info-tooltip-words.json'); 
    
    return tooltipModule.default;
  } catch (error) {
    console.warn('Tooltip words file not found:', error);
    return { tooltips: {} };
  }
};

// 텍스트에서 tooltip 단어들을 찾아서 InfoToolTip 컴포넌트로 교체하는 함수
export const applyTooltipsToText = (
  text: string, 
  tooltips: Record<string, string | string[]>
): (string | { term: string; definition: string | string[] })[] => {
  if (!tooltips || Object.keys(tooltips).length === 0) {
    return [text];
  }

  // 이미 툴팁 객체가 포함된 배열인지 확인
  if (Array.isArray(text)) {
    return text;
  }

  // tooltip 단어들을 길이 순으로 정렬 (긴 단어부터 처리)
  const sortedTerms = Object.keys(tooltips).sort((a, b) => b.length - a.length);
  
  let result: (string | { term: string; definition: string | string[] })[] = [text];
  const processedTerms = new Set<string>(); // 이미 처리된 단어들을 추적

  // 각 term에 대해 한 번씩만 처리
  for (const term of sortedTerms) {
    // 이미 처리된 단어는 건너뛰기
    if (processedTerms.has(term)) {
      console.log(`"${term}"은 이미 처리됨, 건너뛰기`);
      continue;
    }
    
    // 현재 result 배열의 모든 문자열에서 해당 term을 찾아 첫 번째만 교체
    const newResult: (string | { term: string; definition: string | string[] })[] = [];
    let termFound = false; // 이 term이 처리되었는지 추적
    
    for (const item of result) {
      if (typeof item === 'string' && !termFound) {
        // 현재 문자열에서 해당 단어의 첫 번째 위치 찾기
        const firstIndex = item.indexOf(term);
        
        if (firstIndex !== -1) {
          console.log(`"${term}" 첫 번째 매칭 발견, 툴팁으로 변환`);
          
          // 첫 번째 매칭 이전 텍스트
          if (firstIndex > 0) {
            newResult.push(item.substring(0, firstIndex));
          }
          
          // 첫 번째 매칭된 단어를 툴팁으로 변환
          newResult.push({
            term: term,
            definition: tooltips[term]
          });
          
          // 첫 번째 매칭 이후 텍스트
          const afterMatch = item.substring(firstIndex + term.length);
          if (afterMatch) {
            newResult.push(afterMatch);
          }
          
          // 이 term을 처리 완료로 표시하고 더 이상 찾지 않음
          processedTerms.add(term);
          termFound = true;
          console.log(`"${term}" 처리 완료, processedTerms:`, Array.from(processedTerms));
        } else {
          newResult.push(item);
        }
      } else {
        newResult.push(item);
      }
    }
    
    result = newResult;
  }

  console.log('최종 결과:', result);
  return result;
};
