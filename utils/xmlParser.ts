/**
 * XML 파싱 유틸리티
 * 공공데이터포털 API 응답 XML을 JSON으로 변환
 */

/**
 * XML 응답 파싱 결과 타입
 */
export interface XmlParseResult {
  header: {
    resultCode: string;
    resultMsg: string;
  };
  body: {
    items: {
      item: Array<{
        // 아파트 관련 필드
        aptDong?: string;
        aptNm?: string;
        landLeaseholdGbn?: string;
        
        // 연립다세대 관련 필드
        houseType?: string;
        landAr?: string;
        mhouseNm?: string;
        
        // 오피스텔 관련 필드
        offiNm?: string;
        sggNm?: string;
        
        // 단독/다가구 관련 필드
        plottageAr?: string;
        totalFloorAr?: string;
        
        // 공통 필드
        buildYear: string;
        buyerGbn: string;
        cdealDay: string;
        cdealType: string;
        dealAmount: string;
        dealDay: string;
        dealMonth: string;
        dealYear: string;
        dealingGbn: string;
        estateAgentSggNm: string;
        excluUseAr?: string;
        floor?: string;
        jibun: string;
        rgstDate?: string;
        sggCd: string;
        slerGbn: string;
        umdNm: string;
      }>;
    };
    numOfRows: string;
    pageNo: string;
    totalCount: string;
  };
}

/**
 * XML 응답을 JSON으로 파싱
 * @param xmlString XML 문자열
 * @returns 파싱된 JSON 객체
 */
export function parseXmlResponse(xmlString: string): XmlParseResult {
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
    
    // 아이템 파싱 (매매 실거래가 필드)
    const itemMatches = xmlString.match(/<item>([\s\S]*?)<\/item>/g);
    const itemArray = itemMatches ? itemMatches.map(itemXml => {
      // 매매 실거래가 필드들
      const aptDongMatch = itemXml.match(/<aptDong>(.*?)<\/aptDong>/);
      const aptNmMatch = itemXml.match(/<aptNm>(.*?)<\/aptNm>/);
      const buildYearMatch = itemXml.match(/<buildYear>(.*?)<\/buildYear>/);
      const buyerGbnMatch = itemXml.match(/<buyerGbn>(.*?)<\/buyerGbn>/);
      const cdealDayMatch = itemXml.match(/<cdealDay>(.*?)<\/cdealDay>/);
      const cdealTypeMatch = itemXml.match(/<cdealType>(.*?)<\/cdealType>/);
      const dealAmountMatch = itemXml.match(/<dealAmount>(.*?)<\/dealAmount>/);
      const dealDayMatch = itemXml.match(/<dealDay>(.*?)<\/dealDay>/);
      const dealMonthMatch = itemXml.match(/<dealMonth>(.*?)<\/dealMonth>/);
      const dealYearMatch = itemXml.match(/<dealYear>(.*?)<\/dealYear>/);
      const dealingGbnMatch = itemXml.match(/<dealingGbn>(.*?)<\/dealingGbn>/);
      const estateAgentSggNmMatch = itemXml.match(/<estateAgentSggNm>(.*?)<\/estateAgentSggNm>/);
      const excluUseArMatch = itemXml.match(/<excluUseAr>(.*?)<\/excluUseAr>/);
      const floorMatch = itemXml.match(/<floor>(.*?)<\/floor>/);
      const houseTypeMatch = itemXml.match(/<houseType>(.*?)<\/houseType>/);
      const jibunMatch = itemXml.match(/<jibun>(.*?)<\/jibun>/);
      const landArMatch = itemXml.match(/<landAr>(.*?)<\/landAr>/);
      const landLeaseholdGbnMatch = itemXml.match(/<landLeaseholdGbn>(.*?)<\/landLeaseholdGbn>/);
      const mhouseNmMatch = itemXml.match(/<mhouseNm>(.*?)<\/mhouseNm>/);
      const offiNmMatch = itemXml.match(/<offiNm>(.*?)<\/offiNm>/);
      const plottageArMatch = itemXml.match(/<plottageAr>(.*?)<\/plottageAr>/);
      const rgstDateMatch = itemXml.match(/<rgstDate>(.*?)<\/rgstDate>/);
      const sggCdMatch = itemXml.match(/<sggCd>(.*?)<\/sggCd>/);
      const sggNmMatch = itemXml.match(/<sggNm>(.*?)<\/sggNm>/);
      const slerGbnMatch = itemXml.match(/<slerGbn>(.*?)<\/slerGbn>/);
      const totalFloorArMatch = itemXml.match(/<totalFloorAr>(.*?)<\/totalFloorAr>/);
      const umdNmMatch = itemXml.match(/<umdNm>(.*?)<\/umdNm>/);
      
      return {
        aptDong: aptDongMatch ? aptDongMatch[1] : '',
        aptNm: aptNmMatch ? aptNmMatch[1] : '',
        buildYear: buildYearMatch ? buildYearMatch[1] : '',
        buyerGbn: buyerGbnMatch ? buyerGbnMatch[1] : '',
        cdealDay: cdealDayMatch ? cdealDayMatch[1] : '',
        cdealType: cdealTypeMatch ? cdealTypeMatch[1] : '',
        dealAmount: dealAmountMatch ? dealAmountMatch[1] : '',
        dealDay: dealDayMatch ? dealDayMatch[1] : '',
        dealMonth: dealMonthMatch ? dealMonthMatch[1] : '',
        dealYear: dealYearMatch ? dealYearMatch[1] : '',
        dealingGbn: dealingGbnMatch ? dealingGbnMatch[1] : '',
        estateAgentSggNm: estateAgentSggNmMatch ? estateAgentSggNmMatch[1] : '',
        excluUseAr: excluUseArMatch ? excluUseArMatch[1] : '',
        floor: floorMatch ? floorMatch[1] : '',
        houseType: houseTypeMatch ? houseTypeMatch[1] : '',
        jibun: jibunMatch ? jibunMatch[1] : '',
        landAr: landArMatch ? landArMatch[1] : '',
        landLeaseholdGbn: landLeaseholdGbnMatch ? landLeaseholdGbnMatch[1] : '',
        mhouseNm: mhouseNmMatch ? mhouseNmMatch[1] : '',
        offiNm: offiNmMatch ? offiNmMatch[1] : '',
        plottageAr: plottageArMatch ? plottageArMatch[1] : '',
        rgstDate: rgstDateMatch ? rgstDateMatch[1] : '',
        sggCd: sggCdMatch ? sggCdMatch[1] : '',
        sggNm: sggNmMatch ? sggNmMatch[1] : '',
        slerGbn: slerGbnMatch ? slerGbnMatch[1] : '',
        totalFloorAr: totalFloorArMatch ? totalFloorArMatch[1] : '',
        umdNm: umdNmMatch ? umdNmMatch[1] : '',
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