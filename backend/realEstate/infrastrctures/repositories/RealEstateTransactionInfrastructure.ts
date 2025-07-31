import axios, { AxiosResponse, AxiosError } from 'axios';
import { GetRealEstateTransactionRequest } from '../../applications/dtos/GetRealEstateTransactionRequest';
import { GetRealEstateTransactionResponse } from '../../applications/dtos/GetRealEstateTransactionResponse';

/**
 * 실거래가 조회 API 인프라스트럭처
 * 클린 아키텍처의 Infrastructure 레이어
 */
export class RealEstateTransactionInfrastructure {
  private readonly baseUrl: string;
  private readonly timeout: number = 30000; // 30초
  private readonly axiosInstance: ReturnType<typeof axios.create>;

  constructor() {
    this.baseUrl = 'https://apis.data.go.kr/1613000/RTMSDataSvcAptRent';
    
    // axios 인스턴스 생성
    this.axiosInstance = axios.create({
      timeout: this.timeout,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Referer': 'https://www.data.go.kr/',
        'Origin': 'https://www.data.go.kr',
      },
    });
  }

  /**
   * 아파트 전월세 실거래가 조회
   * @param request 요청 데이터
   * @returns 응답 데이터
   */
  async findAll(request: GetRealEstateTransactionRequest): Promise<GetRealEstateTransactionResponse> {
    try {
      // 서비스키 디코딩 (URL 인코딩된 경우)
      const decodedServiceKey = decodeURIComponent(request.serviceKey);
      
      // API 요청 실행
      const response: AxiosResponse<string> = await this.axiosInstance.get(
        `${this.baseUrl}/getRTMSDataSvcAptRent`,
        {
          params: {
            LAWD_CD: request.LAWD_CD,
            DEAL_YMD: request.DEAL_YMD,
            serviceKey: decodedServiceKey,
            numOfRows: request.numOfRows || '10',
            pageNo: request.pageNo || '1',
          },
          responseType: 'text', // XML 응답을 텍스트로 받기
        }
      );
      
      // XML을 JSON으로 파싱
      return this.parseXmlResponse(response.data);
    } catch (error) {
      this.handleError(error as AxiosError | Error);
      throw error;
    }
  }

  /**
   * 단독/다가구 전월세 실거래가 조회
   * @param request 요청 데이터
   * @returns 응답 데이터
   */
  async findDetachedHouseAll(request: GetRealEstateTransactionRequest): Promise<GetRealEstateTransactionResponse> {
    try {
      // API 요청 실행
      const response: AxiosResponse<GetRealEstateTransactionResponse> = await this.axiosInstance.get(
        `${this.baseUrl}/getRTMSDataSvcSHRent`,
        {
          params: {
            LAWD_CD: request.LAWD_CD,
            DEAL_YMD: request.DEAL_YMD,
            serviceKey: request.serviceKey,
            numOfRows: request.numOfRows || '10',
            pageNo: request.pageNo || '1',
          },
        }
      );

      return response.data;
    } catch (error) {
      this.handleError(error as AxiosError | Error);
      throw error;
    }
  }

  /**
   * 오피스텔 전월세 실거래가 조회
   * @param request 요청 데이터
   * @returns 응답 데이터
   */
  async findOfficetelAll(request: GetRealEstateTransactionRequest): Promise<GetRealEstateTransactionResponse> {
    try {
      // API 요청 실행
      const response: AxiosResponse<GetRealEstateTransactionResponse> = await this.axiosInstance.get(
        `${this.baseUrl}/getRTMSDataSvcORTRent`,
        {
          params: {
            LAWD_CD: request.LAWD_CD,
            DEAL_YMD: request.DEAL_YMD,
            serviceKey: request.serviceKey,
            numOfRows: request.numOfRows || '10',
            pageNo: request.pageNo || '1',
          },
        }
      );

      return response.data;
    } catch (error) {
      this.handleError(error as AxiosError | Error);
      throw error;
    }
  }

  /**
   * 지역코드와 계약년월로 실거래가 조회 (편의 메서드)
   * @param lawdCd 지역코드 (법정동코드 5자리)
   * @param dealYmd 계약년월 (YYYYMM 형식)
   * @param options 추가 옵션
   * @returns 응답 데이터
   */
  async findByLocationAndDate(
    lawdCd: string,
    dealYmd: string,
    options: {
      numOfRows?: string;
      pageNo?: string;
      serviceKey?: string;
    } = {}
  ): Promise<GetRealEstateTransactionResponse> {
    const serviceKey = options.serviceKey || process.env.RTMSDATA_TRANSACTION_PRICE_KEY;
    
    if (!serviceKey) {
      throw new Error('공공데이터포털 서비스키가 설정되지 않았습니다.');
    }

    const request: GetRealEstateTransactionRequest = {
      LAWD_CD: lawdCd,
      DEAL_YMD: dealYmd,
      serviceKey,
      numOfRows: options.numOfRows || '10',
      pageNo: options.pageNo || '1',
    };

    return this.findAll(request);
  }

  /**
   * XML 응답을 JSON으로 파싱
   * @param xmlString XML 문자열
   * @returns 파싱된 JSON 객체
   */
  private parseXmlResponse(xmlString: string): GetRealEstateTransactionResponse {
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
   * 에러 처리
   * @param error 에러 객체
   */
  private handleError(error: AxiosError | Error): void {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        console.error('API 응답 에러:', {
          status: axiosError.response.status,
          statusText: axiosError.response.statusText,
          data: axiosError.response.data,
        });
      } else if (axiosError.request) {
        console.error('API 요청 타임아웃 또는 네트워크 에러:', axiosError.message);
      } else {
        console.error('API 요청 설정 에러:', axiosError.message);
      }
    } else {
      console.error('일반 에러:', error.message);
    }
  }
} 