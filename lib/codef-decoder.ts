import { CodefResponse, TaxCertResponseData, TaxCertRespiteItem, TaxCertArrearsItem } from '@/backend/tax-cert/application/dtos/TaxCertDto';

export function urlDecode(encodedString: string): string {
  try {
    return decodeURIComponent(encodedString);
  } catch (error) {
    console.error('URL 디코딩 실패:', error);
    return encodedString;
  }
}

export function decodeTaxCertResponse(response: CodefResponse): CodefResponse {
  if (!response || !response.data) {
    return response;
  }

  const decodedResponse = { ...response };
  
  // data가 URL 인코딩된 문자열인 경우 디코딩
  if (typeof response.data === 'string') {
    try {
      const decodedData = urlDecode(response.data);
      const parsedData = JSON.parse(decodedData);
      decodedResponse.data = parsedData;
      console.log('🔍 URL 디코딩 완료:', parsedData);
    } catch (error) {
      console.error('❌ 데이터 디코딩 실패:', error);
    }
  }

  // data 내부의 특정 필드들 디코딩
  if (response.data && typeof response.data === 'object') {
    const data = response.data as TaxCertResponseData;
    
    // 원문 데이터 디코딩
    if (data.resOriGinalData && typeof data.resOriGinalData === 'string') {
      try {
        data.resOriGinalData = urlDecode(data.resOriGinalData);
      } catch (error) {
        console.error('❌ 원문 데이터 디코딩 실패:', error);
      }
    }
    
    if (data.resOriGinalData1 && typeof data.resOriGinalData1 === 'string') {
      try {
        data.resOriGinalData1 = urlDecode(data.resOriGinalData1);
      } catch (error) {
        console.error('❌ PDF 원문 데이터 디코딩 실패:', error);
      }
    }

    // 주소 정보 디코딩
    if (data.resUserAddr && typeof data.resUserAddr === 'string') {
      try {
        data.resUserAddr = urlDecode(data.resUserAddr);
      } catch (error) {
        console.error('❌ 주소 디코딩 실패:', error);
      }
    }

    // 사용자 이름 디코딩
    if (data.resUserNm && typeof data.resUserNm === 'string') {
      try {
        data.resUserNm = urlDecode(data.resUserNm);
      } catch (error) {
        console.error('❌ 사용자 이름 디코딩 실패:', error);
      }
    }

    // 회사명 디코딩
    if (data.resCompanyNm && typeof data.resCompanyNm === 'string') {
      try {
        data.resCompanyNm = urlDecode(data.resCompanyNm);
      } catch (error) {
        console.error('❌ 회사명 디코딩 실패:', error);
      }
    }

    // 사용목적 디코딩
    if (data.resUsePurpose && typeof data.resUsePurpose === 'string') {
      try {
        data.resUsePurpose = urlDecode(data.resUsePurpose);
      } catch (error) {
        console.error('❌ 사용목적 디코딩 실패:', error);
      }
    }

    // 발급기관명 디코딩
    if (data.resIssueOgzNm && typeof data.resIssueOgzNm === 'string') {
      try {
        data.resIssueOgzNm = urlDecode(data.resIssueOgzNm);
      } catch (error) {
        console.error('❌ 발급기관명 디코딩 실패:', error);
      }
    }

    // 담당부서명 디코딩
    if (data.resDepartmentName && typeof data.resDepartmentName === 'string') {
      try {
        data.resDepartmentName = urlDecode(data.resDepartmentName);
      } catch (error) {
        console.error('❌ 담당부서명 디코딩 실패:', error);
      }
    }

    // 유효기간 사유 디코딩
    if (data.resReason && typeof data.resReason === 'string') {
      try {
        data.resReason = urlDecode(data.resReason);
      } catch (error) {
        console.error('❌ 유효기간 사유 디코딩 실패:', error);
      }
    }

    // 납세상태 디코딩
    if (data.resPaymentTaxStatus && typeof data.resPaymentTaxStatus === 'string') {
      try {
        data.resPaymentTaxStatus = urlDecode(data.resPaymentTaxStatus);
      } catch (error) {
        console.error('❌ 납세상태 디코딩 실패:', error);
      }
    }

    // 담당자명 디코딩
    if (data.resUserNm1 && typeof data.resUserNm1 === 'string') {
      try {
        data.resUserNm1 = urlDecode(data.resUserNm1);
      } catch (error) {
        console.error('❌ 담당자명 디코딩 실패:', error);
      }
    }

    // 징수유예등 리스트 디코딩
    if (data.resRespiteList && Array.isArray(data.resRespiteList)) {
      data.resRespiteList = data.resRespiteList.map((item: TaxCertRespiteItem) => {
        const decodedItem: TaxCertRespiteItem = { ...item };
        
        if (item.resRespiteType && typeof item.resRespiteType === 'string') {
          try {
            decodedItem.resRespiteType = urlDecode(item.resRespiteType);
          } catch (error) {
            console.error('❌ 유예종류 디코딩 실패:', error);
          }
        }
        
        if (item.resTaxItemName && typeof item.resTaxItemName === 'string') {
          try {
            decodedItem.resTaxItemName = urlDecode(item.resTaxItemName);
          } catch (error) {
            console.error('❌ 세목 디코딩 실패:', error);
          }
        }
        
        return decodedItem;
      });
    }

    // 체납 리스트 디코딩
    if (data.resArrearsList && Array.isArray(data.resArrearsList)) {
      data.resArrearsList = data.resArrearsList.map((item: TaxCertArrearsItem) => {
        const decodedItem: TaxCertArrearsItem = { ...item };
        
        if (item.resUserNm && typeof item.resUserNm === 'string') {
          try {
            decodedItem.resUserNm = urlDecode(item.resUserNm);
          } catch (error) {
            console.error('❌ 체납자명 디코딩 실패:', error);
          }
        }
        
        if (item.resTaxItemName && typeof item.resTaxItemName === 'string') {
          try {
            decodedItem.resTaxItemName = urlDecode(item.resTaxItemName);
          } catch (error) {
            console.error('❌ 체납 세목 디코딩 실패:', error);
          }
        }
        
        return decodedItem;
      });
    }
  }

  return decodedResponse;
} 