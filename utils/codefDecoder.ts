/**
 * CODEF API 응답 디코딩 유틸리티
 * URL 인코딩된 응답 데이터를 디코딩하고 JSON 파싱
 */

import { GetRealEstateResponse } from '@be/applications/realEstate/dtos/RealEstateResponse';

/**
 * URL 인코딩된 문자열을 디코딩합니다.
 * @param encodedString URL 인코딩된 문자열
 * @returns 디코딩된 문자열
 */
export function decodeCodefResponse(
  encodedString: string
): GetRealEstateResponse {
  try {
    const urlDecodedData = decodeURIComponent(encodedString);
    const jsonData = JSON.parse(urlDecodedData);
    return jsonData as unknown as GetRealEstateResponse;
  } catch (error) {
    console.error('URL 디코딩 실패:', error);
    return encodedString as unknown as GetRealEstateResponse; // 디코딩 실패 시 원본 반환
  }
}
