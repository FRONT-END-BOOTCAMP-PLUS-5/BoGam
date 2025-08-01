/**
 * URL 디코딩 유틸리티
 */

/**
 * URL 인코딩된 문자열을 디코딩합니다.
 * @param encodedString URL 인코딩된 문자열
 * @returns 디코딩된 문자열
 */
export function urlDecode(encodedString: string): string {
  try {
    return decodeURIComponent(encodedString);
  } catch (error) {
    console.error('URL 디코딩 실패:', error);
    return encodedString; // 디코딩 실패 시 원본 반환
  }
}

/**
 * 응답 데이터를 처리합니다 (URL 디코딩 + JSON 파싱)
 * @param responseData 응답 데이터 (문자열 또는 객체)
 * @returns 파싱된 객체
 */
export function processResponse<T = any>(responseData: any): T {
  console.log('📥 응답 데이터 처리 시작:', typeof responseData);
  
  // 이미 객체인 경우 그대로 반환
  if (typeof responseData === 'object' && responseData !== null) {
    console.log('✅ 응답이 이미 객체입니다.');
    return responseData as T;
  }
  
  // 문자열인 경우 디코딩 후 JSON 파싱
  if (typeof responseData === 'string') {
    try {
      console.log('🔓 문자열 응답 디코딩 시도...');
      const decodedText = urlDecode(responseData);
      console.log('🔓 디코딩된 응답:', decodedText);
      
      // 디코딩된 텍스트가 JSON 형태인지 확인
      if (decodedText.trim().startsWith('{') || decodedText.trim().startsWith('[')) {
        const parsed = JSON.parse(decodedText);
        console.log('✅ JSON 파싱 성공');
        return parsed as T;
      } else {
        console.log('⚠️ JSON 형태가 아님, 원본 텍스트 반환');
        return decodedText as T;
      }
    } catch (error) {
      console.error('❌ 디코딩/파싱 실패:', error);
      console.error('❌ 문제가 된 응답:', responseData);
      throw new Error(`응답 처리 실패: ${error}`);
    }
  }
  
  // 다른 타입인 경우 그대로 반환
  console.log('⚠️ 예상치 못한 응답 타입, 원본 반환');
  return responseData as T;
}