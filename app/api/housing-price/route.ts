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
import { HousingPriceUseCase } from '@be/applications/housingPrice/usecases/HousingPriceUseCase';
import { HousingPriceRepository } from '@be/infrastructure/repository/HousingPriceRepository';
import { HousingPriceRequest } from '@be/applications/housingPrice/dtos/HousingPriceDto';

const repository = new HousingPriceRepository();
const useCase = new HousingPriceUseCase(repository);

export async function POST(request: NextRequest) {
  try {
    const body: HousingPriceRequest = await request.json();

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

    // addrSearchType에 따른 조건부 검증
    if (body.addrSearchType === '0') {
      if (!body.addrSiGunGu) {
        return NextResponse.json(
          { success: false, message: '지번입력조회 시 시군구는 필수입니다.' },
          { status: 400 }
        );
      }
      if (!body.addrDong) {
        return NextResponse.json(
          { success: false, message: '지번입력조회 시 읍면동로는 필수입니다.' },
          { status: 400 }
        );
      }
      if (!body.addrLotNumber) {
        return NextResponse.json(
          { success: false, message: '지번입력조회 시 지번은 필수입니다.' },
          { status: 400 }
        );
      }
    } else if (body.addrSearchType === '1') {
      if (!body.address) {
        return NextResponse.json(
          {
            success: false,
            message: '도로명주소입력조회 시 주소는 필수입니다.',
          },
          { status: 400 }
        );
      }
    }

    // 부동산 공시가격 조회
    const response = await useCase.getHousingPrice(body);

    // 응답 데이터 검증
    const validationResult = useCase.validateResponse(response);
    if (!validationResult.isValid) {
      return NextResponse.json(
        { success: false, message: validationResult.message },
        { status: 400 }
      );
    }

    // 공시가격 데이터 추출
    const housingPriceList = useCase.extractHousingPriceList(response);
    const statistics = useCase.getStatistics(response);

    // 성공 응답
    return NextResponse.json({
      success: true,
      message: '부동산 공시가격 조회가 성공적으로 완료되었습니다.',
      data: {
        result: response.result,
        housingPriceList,
        statistics,
        rawData: response.data,
      },
    });
  } catch (error) {
    console.error('부동산 공시가격 조회 에러:', error);
    return NextResponse.json(
      { success: false, message: '서버 내부 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
*/