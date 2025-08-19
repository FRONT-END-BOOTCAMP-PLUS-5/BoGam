import { NextRequest, NextResponse } from 'next/server';
import { StepResultUsecase } from '@be/applications/stepResults/usecases/StepResultUsecase';
import { StepResultRepositoryImpl } from '@be/infrastructure/repository/StepResultRepositoryImpl';

// GET /api/step-result?stepNumber=1&detail=2
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    // userAddressNickname은 전역에서 가져옴. 일단 임시로 설정
    const userAddressNickname = '채원강남집';
    const mainNum = searchParams.get('stepNumber');
    const subNum = searchParams.get('detail');

    if (!userAddressNickname) {
      return NextResponse.json(
        { success: false, error: 'userAddressNickname는 필수입니다.' },
        { status: 400 }
      );
    }

    const repository = new StepResultRepositoryImpl();
    const usecase = new StepResultUsecase(repository);

    // mainNum과 subNum 파싱
    const mainNumInt = mainNum ? parseInt(mainNum) : undefined;
    const subNumInt = subNum ? parseInt(subNum) : undefined;

    if (mainNum && isNaN(mainNumInt!)) {
      return NextResponse.json(
        { success: false, error: 'mainNum은 숫자여야 합니다.' },
        { status: 400 }
      );
    }

    if (subNum && isNaN(subNumInt!)) {
      return NextResponse.json(
        { success: false, error: 'subNum은 숫자여야 합니다.' },
        { status: 400 }
      );
    }

    const result = await usecase.getStepResults(
      userAddressNickname,
      mainNumInt,
      subNumInt
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

    const errors: string[] = [];
    if (!body.userAddressId) {
      errors.push('userAddressId는 필수입니다.');
    }

    // stepId 또는 mainNum+subNum 중 하나는 필요
    if (!body.stepId && (!body.mainNum || !body.subNum)) {
      errors.push('stepId 또는 mainNum+subNum이 필요합니다.');
    }

    if (!body.details) {
      errors.push('details는 필수입니다.');
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, error: errors.join(', ') },
        { status: 400 }
      );
    }

    const repository = new StepResultRepositoryImpl();
    const usecase = new StepResultUsecase(repository);
    const result = await usecase.upsertStepResult(body);

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
