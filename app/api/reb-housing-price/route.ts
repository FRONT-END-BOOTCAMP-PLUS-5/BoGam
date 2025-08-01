import { NextRequest, NextResponse } from 'next/server';

// 임시로 비활성화된 라우트
export async function POST(_request: NextRequest) {
  void _request; // unused parameter
  return NextResponse.json(
    { success: false, message: '이 API는 현재 비활성화되어 있습니다.' },
    { status: 503 }
  );
}

/*
import { RebHousingPriceUseCase } from '../../../backend/rebHousingPrice/applications/usecases/RebHousingPriceUseCase';
import { RebHousingPriceRepository } from '../../../backend/rebHousingPrice/infrastructures/repositories/RebHousingPriceRepository';
import {
  RebHousingPriceRequest,
  RebHousingPriceTwoWayRequest,
} from '../../../backend/rebHousingPrice/applications/dtos/RebHousingPriceDto';

const repository = new RebHousingPriceRepository();
const useCase = new RebHousingPriceUseCase(repository);

export async function POST(request: NextRequest) {
  try {
    const body: RebHousingPriceRequest | RebHousingPriceTwoWayRequest =
      await request.json();

    // 필수 필드 검증
    if (!body.organization) {
      return NextResponse.json(
        { success: false, message: '기관코드는 필수입니다.' },
        { status: 400 }
      );
    }

    if (!body.addrSearchType) {
      return NextResponse.json(
        { success: false, message: '주소검색 구분은 필수입니다.' },
        { status: 400 }
      );
    }

    if (!body.addrSido) {
      return NextResponse.json(
        { success: false, message: '시도는 필수입니다.' },
        { status: 400 }
      );
    }

    if (!body.addrSiGunGu) {
      return NextResponse.json(
        { success: false, message: '시군구는 필수입니다.' },
        { status: 400 }
      );
    }

    // addrSearchType에 따른 조건부 검증
    if (body.addrSearchType === '0') {
      if (!body.addrDong) {
        return NextResponse.json(
          { success: false, message: '지번 검색 시 읍면동로는 필수입니다.' },
          { status: 400 }
        );
      }
      if (!body.addrLotNumber) {
        return NextResponse.json(
          { success: false, message: '지번 검색 시 지번은 필수입니다.' },
          { status: 400 }
        );
      }
    } else if (body.addrSearchType === '1') {
      if (!body.addrRoadName) {
        return NextResponse.json(
          { success: false, message: '도로명 검색 시 도로명은 필수입니다.' },
          { status: 400 }
        );
      }
      if (!body.addrBuildingNumber) {
        return NextResponse.json(
          { success: false, message: '도로명 검색 시 건물번호는 필수입니다.' },
          { status: 400 }
        );
      }
    }

    // 2-way 인증 요청인지 확인
    if ('is2Way' in body && body.is2Way) {
      if (!body.twoWayInfo) {
        return NextResponse.json(
          { success: false, message: '2-way 인증 정보가 필요합니다.' },
          { status: 400 }
        );
      }

      // 2-way 인증 처리
      const response = await useCase.getRebHousingPrice(body);

      // 응답 검증
      const validationResult = useCase.validateResponse(response);
      if (!validationResult.isValid) {
        return NextResponse.json(
          { success: false, message: validationResult.message },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: '2-way 인증이 성공적으로 완료되었습니다.',
        data: response.data,
      });
    }

    // 일반 공시가격 조회
    const response = await useCase.getRebHousingPrice(body);

    // 응답 데이터 검증
    const validationResult = useCase.validateResponse(response);
    if (!validationResult.isValid) {
      if (validationResult.requiresTwoWayAuth) {
        return NextResponse.json({
          success: false,
          message: '추가인증이 필요합니다.',
          requiresTwoWayAuth: true,
          twoWayInfo: response.data,
        });
      }
      return NextResponse.json(
        { success: false, message: validationResult.message },
        { status: 400 }
      );
    }

    // 2-way 인증 필요 여부 확인
    if (useCase.requiresTwoWayAuth(response)) {
      return NextResponse.json({
        success: false,
        message: '추가인증이 필요합니다.',
        requiresTwoWayAuth: true,
        twoWayInfo: response.data,
      });
    }

    // 공시가격 데이터 추출
    const housingPriceData = useCase.extractHousingPriceData(response);
    const statistics = useCase.getStatistics(response);

    // 성공 응답
    return NextResponse.json({
      success: true,
      message: '부동산 공시가격(공동주택) 조회가 성공적으로 완료되었습니다.',
      data: {
        result: response.result,
        housingPriceData,
        statistics,
        rawData: response.data,
      },
    });
  } catch (error) {
    console.error('부동산 공시가격(공동주택) 조회 에러:', error);
    return NextResponse.json(
      { success: false, message: '서버 내부 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
*/