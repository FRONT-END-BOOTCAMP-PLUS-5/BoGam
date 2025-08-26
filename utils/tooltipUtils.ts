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

  // tooltip 단어들을 길이 순으로 정렬 (긴 단어부터 처리)
  const sortedTerms = Object.keys(tooltips).sort((a, b) => b.length - a.length);
  
  let result: (string | { term: string; definition: string | string[] })[] = [text];

  for (const term of sortedTerms) {
    const newResult: (string | { term: string; definition: string | string[] })[] = [];
    
    for (const item of result) {
      if (typeof item === 'string') {
        const regex = new RegExp(`(${term})`, 'g');
        const parts = item.split(regex);
        
        for (let i = 0; i < parts.length; i++) {
          if (parts[i] === term) {
            newResult.push({
              term: parts[i],
              definition: tooltips[term]
            });
          } else if (parts[i]) {
            newResult.push(parts[i]);
          }
        }
      } else {
        newResult.push(item);
      }
    }
    
    result = newResult;
  }

  return result;
};
