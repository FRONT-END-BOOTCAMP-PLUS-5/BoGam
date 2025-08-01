/**
 * XML 파싱 유틸리티
 * 공공데이터포털 API 응답 XML을 JSON으로 변환
 */

/**
 * XML 응답을 JSON으로 파싱
 * @param xmlString XML 문자열
 * @returns 파싱된 JSON 객체
 */
export function parseXmlResponse(xmlString: string): any {
  try {
    // 에러 체크
    if (xmlString.includes('<cmmMsgHeader>')) {
      const errMsgMatch = xmlString.match(/<errMsg>(.*?)<\/errMsg>/);
      const returnAuthMsgMatch = xmlString.match(/<returnAuthMsg>(.*?)<\/returnAuthMsg>/);
      const returnReasonCodeMatch = xmlString.match(/<returnReasonCode>(.*?)<\/returnReasonCode>/);
      
      const errMsg = errMsgMatch ? errMsgMatch[1] : 'Unknown error';
      const returnAuthMsg = returnAuthMsgMatch ? returnAuthMsgMatch[1] : '';
      const returnReasonCode = returnReasonCodeMatch ? returnReasonCodeMatch[1] : '';
      
      throw new Error(`${errMsg}: ${returnAuthMsg} (코드: ${returnReasonCode})`);
    }
    
    // 정상 응답 파싱
    const resultCodeMatch = xmlString.match(/<resultCode>(.*?)<\/resultCode>/);
    const resultMsgMatch = xmlString.match(/<resultMsg>(.*?)<\/resultMsg>/);
    
    const resultCode = resultCodeMatch ? resultCodeMatch[1] : '';
    const resultMsg = resultMsgMatch ? resultMsgMatch[1] : '';
    
    // 페이지 정보 파싱
    const numOfRowsMatch = xmlString.match(/<numOfRows>(.*?)<\/numOfRows>/);
    const pageNoMatch = xmlString.match(/<pageNo>(.*?)<\/pageNo>/);
    const totalCountMatch = xmlString.match(/<totalCount>(.*?)<\/totalCount>/);
    
    const numOfRows = numOfRowsMatch ? numOfRowsMatch[1] : '';
    const pageNo = pageNoMatch ? pageNoMatch[1] : '';
    const totalCount = totalCountMatch ? totalCountMatch[1] : '';
    
    // 아이템 파싱
    const itemMatches = xmlString.match(/<item>([\s\S]*?)<\/item>/g);
    const itemArray = itemMatches ? itemMatches.map(itemXml => {
      const aptNmMatch = itemXml.match(/<aptNm>(.*?)<\/aptNm>/);
      const buildYearMatch = itemXml.match(/<buildYear>(.*?)<\/buildYear>/);
      const dealDayMatch = itemXml.match(/<dealDay>(.*?)<\/dealDay>/);
      const dealMonthMatch = itemXml.match(/<dealMonth>(.*?)<\/dealMonth>/);
      const dealYearMatch = itemXml.match(/<dealYear>(.*?)<\/dealYear>/);
      const depositMatch = itemXml.match(/<deposit>(.*?)<\/deposit>/);
      const excluUseArMatch = itemXml.match(/<excluUseAr>(.*?)<\/excluUseAr>/);
      const floorMatch = itemXml.match(/<floor>(.*?)<\/floor>/);
      const jibunMatch = itemXml.match(/<jibun>(.*?)<\/jibun>/);
      const monthlyRentMatch = itemXml.match(/<monthlyRent>(.*?)<\/monthlyRent>/);
      const sggCdMatch = itemXml.match(/<sggCd>(.*?)<\/sggCd>/);
      const umdNmMatch = itemXml.match(/<umdNm>(.*?)<\/umdNm>/);
      
      return {
        aptNm: aptNmMatch ? aptNmMatch[1] : '',
        buildYear: buildYearMatch ? buildYearMatch[1] : '',
        contractTerm: '',
        contractType: '',
        dealDay: dealDayMatch ? dealDayMatch[1] : '',
        dealMonth: dealMonthMatch ? dealMonthMatch[1] : '',
        dealYear: dealYearMatch ? dealYearMatch[1] : '',
        deposit: depositMatch ? depositMatch[1] : '',
        excluUseAr: excluUseArMatch ? excluUseArMatch[1] : '',
        floor: floorMatch ? floorMatch[1] : '',
        jibun: jibunMatch ? jibunMatch[1] : '',
        monthlyRent: monthlyRentMatch ? monthlyRentMatch[1] : '',
        preDeposit: '',
        preMonthlyRent: '',
        sggCd: sggCdMatch ? sggCdMatch[1] : '',
        umdNm: umdNmMatch ? umdNmMatch[1] : '',
        useRRRight: '',
      };
    }) : [];
    
    return {
      header: {
        resultCode,
        resultMsg,
      },
      body: {
        items: {
          item: itemArray,
        },
        numOfRows,
        pageNo,
        totalCount,
      },
    };
  } catch (error) {
    throw new Error(`XML 파싱 실패: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * XML에서 특정 태그 값 추출
 * @param xmlString XML 문자열
 * @param tagName 태그명
 * @returns 태그 값
 */
export function extractXmlTag(xmlString: string, tagName: string): string {
  const regex = new RegExp(`<${tagName}>(.*?)<\/${tagName}>`);
  const match = xmlString.match(regex);
  return match ? match[1] : '';
}

/**
 * XML에서 모든 특정 태그 값 추출
 * @param xmlString XML 문자열
 * @param tagName 태그명
 * @returns 태그 값 배열
 */
export function extractAllXmlTags(xmlString: string, tagName: string): string[] {
  const regex = new RegExp(`<${tagName}>(.*?)<\/${tagName}>`, 'g');
  const matches = xmlString.match(regex);
  return matches ? matches.map(match => match.replace(`<${tagName}>`, '').replace(`</${tagName}>`, '')) : [];
}

/**
 * XML 에러 메시지 파싱
 * @param xmlString XML 문자열
 * @returns 에러 정보 객체
 */
export function parseXmlError(xmlString: string): { errMsg: string; returnAuthMsg: string; returnReasonCode: string } {
  const errMsgMatch = xmlString.match(/<errMsg>(.*?)<\/errMsg>/);
  const returnAuthMsgMatch = xmlString.match(/<returnAuthMsg>(.*?)<\/returnAuthMsg>/);
  const returnReasonCodeMatch = xmlString.match(/<returnReasonCode>(.*?)<\/returnReasonCode>/);
  
  return {
    errMsg: errMsgMatch ? errMsgMatch[1] : 'Unknown error',
    returnAuthMsg: returnAuthMsgMatch ? returnAuthMsgMatch[1] : '',
    returnReasonCode: returnReasonCodeMatch ? returnReasonCodeMatch[1] : '',
  };
} 