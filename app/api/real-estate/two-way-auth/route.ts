import { NextRequest, NextResponse } from 'next/server';
import { GetRealEstateDataUseCase } from '../../../../backend/realEstate/applications/usecases/GetRealEstateDataUseCase';

const useCase = new GetRealEstateDataUseCase();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { uniqueNo, twoWayInfo } = body;

    if (!uniqueNo) {
      return NextResponse.json(
        { success: false, message: '부동산 고유번호는 필수입니다.' },
        { status: 400 }
      );
    }

    if (!twoWayInfo) {
      return NextResponse.json(
        { success: false, message: '2-way 인증 정보는 필수입니다.' },
        { status: 400 }
      );
    }

    // UseCase 호출
    const response = await useCase.processTwoWayAuth(uniqueNo, twoWayInfo);

    // 응답 검증
    const validationResult = useCase.validateResponse(response);
    if (!validationResult.isValid) {
      return NextResponse.json(
        { success: false, message: validationResult.message },
        { status: 400 }
      );
    }

    // 성공 응답
    return NextResponse.json({
      success: true,
      message: '2-way 인증이 성공적으로 완료되었습니다.',
      data: response.data,
    });
  } catch (error) {
    console.error('2-way 인증 에러:', error);
    return NextResponse.json(
      { success: false, message: '서버 내부 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
