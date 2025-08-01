/**
 * CODEF API 응답 디코딩 유틸리티
 * URL 인코딩된 응답 데이터를 디코딩하고 JSON 파싱
 */

/**
 * 응답 데이터의 URL 디코딩 및 JSON 파싱 처리
 * @param data 원본 응답 데이터 (인코딩된 형태)
 * @returns 디코딩된 응답 데이터
 */
export function decodeCodefResponse(data: any) {
  try {
    // data 필드가 URL 인코딩된 문자열인 경우 디코딩
    if (data) {
      try {
        // URL 디코딩
        const urlDecodedData = decodeURIComponent(data);

        // JSON 파싱
        const jsonData = JSON.parse(urlDecodedData);

        return jsonData;
      } catch (decodeError) {
        console.warn(
          '⚠️ URL 디코딩 또는 JSON 파싱 실패, 원본 데이터 유지:',
          decodeError
        );
      }
    }

    return data;
  } catch (error) {
    console.error('❌ 응답 디코딩 처리 실패:', error);
    return data; // 오류 시 원본 응답 반환
  }
}
