import { JeonseGuaranteeRepository } from '@be/domain/repository/JeonseGuaranteeRepository';
import { JeonseGuaranteeEntity } from '@be/domain/entities/JeonseGuarantee';
import { GetJeonseGuaranteeRequestDto } from '@be/applications/jeonseGuarantees/dtos/GetJeonseGuaranteeRequestDto';
import axios from 'axios';

export class JeonseGuaranteeRepositoryImpl
  implements JeonseGuaranteeRepository
{
  private readonly baseUrl =
    'https://apis.data.go.kr/B551408/jnse-rcmd-info-v2/jnse-rcmd-list-v2';

  async getJeonseGuarantee(
    params: GetJeonseGuaranteeRequestDto
  ): Promise<JeonseGuaranteeEntity> {
    try {
      // 서비스키는 환경변수에서 가져옴
      const serviceKey = process.env.RTMSDATA_TRANSACTION_PRICE_KEY_DECODING;

      if (!serviceKey) {
        throw new Error('전세자금보증상품 서비스키가 설정되지 않았습니다.');
      }

      // API 요청 파라미터 구성
      const queryParams = new URLSearchParams({
        serviceKey: serviceKey,
        dataType: 'JSON', // dataType 고정
        numOfRows: params.numOfRows.toString(),
        pageNo: params.pageNo.toString(),
        rentGrntAmt: params.rentGrntAmt.toString(),
        mmrtAmt: params.mmrtAmt.toString(),
        trgtLwdgCd: params.trgtLwdgCd,
        age: params.age.toString(),
        weddStcd: params.weddStcd.toString(),
        myIncmAmt: params.myIncmAmt.toString(),
        myTotDebtAmt: params.myTotDebtAmt.toString(),
        ownHsCnt: params.ownHsCnt.toString(),
      });

      // 보증우대조치구분이 있는 경우 추가
      if (params.grntPrmeActnDvcdCont) {
        queryParams.append('grntPrmeActnDvcdCont', params.grntPrmeActnDvcdCont);
      }

      const url = `${this.baseUrl}?${queryParams.toString()}`;
      const response = await axios.get(url);

      if (response.status !== 200) {
        throw new Error(`API 요청 실패: ${response.status}`);
      }
      // API 응답 데이터 타입 정의
      interface JeonseGuaranteeApiResponse {
        header: {
          resultCode: string;
          resultMsg: string;
        };
        body: {
          pageNo: number;
          totalCount: number;
          numOfRows: number;
          items: Array<{
            rcmdProrRnk: string;
            grntLmtAmt: string;
            loanLmtAmt: string;
            grntDvcd: string;
          }>;
        };
      }

      const data = response.data as JeonseGuaranteeApiResponse;

      console.log(
        '전세자금보증상품 API 응답 데이터:',
        JSON.stringify(data, null, 2)
      );

      // 원본 데이터를 직접 Entity로 변환
      return new JeonseGuaranteeEntity(
        data.header?.resultCode || '',
        data.header?.resultMsg || '',
        data.body?.pageNo || 1,
        data.body?.totalCount || 0,
        data.body?.numOfRows || 0,
        (data.body?.items || []).map((item) => ({
          rcmdProrRnk: parseInt(item.rcmdProrRnk) || 0,
          grntLmtAmt: item.grntLmtAmt || '0',
          loanLmtAmt: item.loanLmtAmt || '0',
          grntDvcd: item.grntDvcd || '',
        }))
      );
    } catch (error) {
      console.error('전세자금보증상품 조회 중 오류 발생:', error);
      throw new Error('전세자금보증상품 조회에 실패했습니다.');
    }
  }
}
