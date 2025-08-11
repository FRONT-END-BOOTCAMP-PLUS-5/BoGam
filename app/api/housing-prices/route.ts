import { NextRequest, NextResponse } from 'next/server';
import { GetHousingPriceListusecase } from '@be/applications/housingPrices/usecases/GetHousingPriceListusecase';
import { HousingPriceRepository } from '@be/infrastructure/repository/HousingPriceRepository';
import { GetHousingPriceRequestDto } from '@be/applications/housingPrices/dtos/GetHousingPriceListRequestDto';

const repository = new HousingPriceRepository();
const usecase = new GetHousingPriceListusecase(repository);

export async function POST(request: NextRequest) {
  try {
    const body: GetHousingPriceRequestDto = await request.json();

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
    const response = await usecase.getHousingPriceList(body);

    // 성공 응답
    return NextResponse.json({
      success: true,
      message: '부동산 공시가격 조회가 성공적으로 완료되었습니다.',
      result: response.result,
      data: response.data,
      status: 200,
    });
  } catch (error) {
    console.error('부동산 공시가격 조회 에러:', error);
    return NextResponse.json(
      { success: false, message: '서버 내부 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
