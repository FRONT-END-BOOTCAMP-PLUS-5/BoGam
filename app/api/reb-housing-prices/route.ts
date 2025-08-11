import { NextRequest, NextResponse } from 'next/server';
import { GetRebHousingPriceListUsecase } from '@be/applications/rebHousingPrices/usecases/GetRebHousingPriceListUsecase';
import { RebHousingPriceRepository } from '@be/infrastructure/repository/RebHousingPriceRepository';
import { GetRebHousingPriceListRequestDto } from '@be/applications/rebHousingPrices/dtos/GetRebHousingPriceListRequestDto';

const repository = new RebHousingPriceRepository();
const usecase = new GetRebHousingPriceListUsecase(repository);

export async function POST(request: NextRequest) {
  try {
    const body: GetRebHousingPriceListRequestDto = await request.json();

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
      const response = await usecase.getRebHousingPriceList(body);

      return NextResponse.json({
        success: true,
        message: '2-way 인증이 성공적으로 완료되었습니다.',
        data: response.data,
      });
    }

    // 일반 공시가격 조회
    const response = await usecase.getRebHousingPriceList(body);

    // 2-way 인증 필요 여부 확인
    if (usecase.requiresTwoWayAuth(response)) {
      return NextResponse.json({
        success: false,
        message: '추가인증이 필요합니다.',
        requiresTwoWayAuth: true,
        twoWayInfo: response.data,
      });
    }

    // 공시가격 데이터 추출

    // 성공 응답
    return NextResponse.json({
      success: true,
      message: '부동산 공시가격(공동주택) 조회가 성공적으로 완료되었습니다.',
      data: response.data,
      status: 200,
    });
  } catch (error) {
    console.error('부동산 공시가격(공동주택) 조회 에러:', error);
    return NextResponse.json(
      { success: false, message: '서버 내부 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
