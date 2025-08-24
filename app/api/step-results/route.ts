import { NextRequest, NextResponse } from 'next/server';
import { StepResultUsecase } from '@be/applications/stepResults/usecases/StepResultUsecase';
import { StepResultRepositoryImpl } from '@be/infrastructure/repository/StepResultRepositoryImpl';
import { getUserAddressId } from '@utils/userAddress';

// GET /api/step-result?userAddressNickname=채원강남집&stepNumber=1&detail=2
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    // userAddressNickname은 전역에서 가져옴.
    const userAddressNickname = searchParams.get('userAddressNickname');
    const stepNumber = searchParams.get('stepNumber');
    const detail = searchParams.get('detail');

    if (!userAddressNickname) {
      return NextResponse.json(
        { success: false, error: 'userAddressNickname는 필수입니다.' },
        { status: 400 }
      );
    }

    const repository = new StepResultRepositoryImpl();
    const usecase = new StepResultUsecase(repository);

    // stepNumber와 detail 파싱
    const stepNumberInt = stepNumber ? parseInt(stepNumber) : undefined;
    const detailInt = detail ? parseInt(detail) : undefined;

    if (stepNumber && isNaN(stepNumberInt!)) {
      return NextResponse.json(
        { success: false, error: 'stepNumber는 숫자여야 합니다.' },
        { status: 400 }
      );
    }

    if (detail && isNaN(detailInt!)) {
      return NextResponse.json(
        { success: false, error: 'detail은 숫자여야 합니다.' },
        { status: 400 }
      );
    }

    const result = await usecase.getStepResults(
      userAddressNickname,
      stepNumberInt,
      detailInt
    );

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, data: result.data, message: result.message },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ GET /api/step-result 오류:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// POST /api/step-result (upsert - 생성 또는 업데이트)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 저장 요청 데이터 로깅
    console.log('🔍 API 엔드포인트에서 받은 저장 요청 데이터:', {
      userAddressNickname: body.userAddressNickname,
      stepNumber: body.stepNumber,
      detail: body.detail,
      jsonDetails: body.jsonDetails,
    });

    const errors: string[] = [];
    if (!body.userAddressNickname) {
      errors.push('userAddressNickname는 필수입니다.');
    }

    // stepId 또는 stepNumber+detail 중 하나는 필요
    if (!body.stepId && (!body.stepNumber || !body.detail)) {
      errors.push('stepId 또는 stepNumber+detail이 필요합니다.');
    }

    // jsonDetails가 없어도 위험도 검사 데이터가 직접 전달되므로 검증 제거

    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, error: errors.join(', ') },
        { status: 400 }
      );
    }

    const userAddressId = await getUserAddressId(body.userAddressNickname);

    if (userAddressId) {
      body.userAddressId = userAddressId;
    }

    // 위험도 검사 항목들만 추출
    const {
      userAddressNickname,
      stepNumber,
      detail,
      userAddressId: id,
      ...riskData
    } = body;

    // 백엔드에 전달할 데이터 구성 (메타데이터 + 위험도 검사 데이터)
    const backendData = {
      userAddressId: id,
      stepNumber,
      detail,
      jsonDetails: riskData, // 위험도 검사 데이터를 jsonDetails에 저장
    };

    const repository = new StepResultRepositoryImpl();
    const usecase = new StepResultUsecase(repository);
    const result = await usecase.upsertStepResult(backendData);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, data: result.data, message: result.message },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ POST /api/step-result 오류:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
