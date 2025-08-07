import { NextRequest, NextResponse } from 'next/server';
import { StepResultUseCase } from '@be/applications/stepResult/usecase/StepResultUseCase';
import { StepResultRepositoryImpl } from '@be/infrastructure/repository/StepResultRepositoryImpl';
import { GetStepResultQueryDto } from '@be/applications/stepResult/dtos/StepResultDto';

// GET /api/step-result?userAddressId=1&mainNum=1&subNum=2
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userAddressId = searchParams.get('userAddressId');
    const mainNum = searchParams.get('mainNum');
    const subNum = searchParams.get('subNum');

    if (!userAddressId) {
      return NextResponse.json(
        { success: false, error: 'userAddressId는 필수입니다.' },
        { status: 400 }
      );
    }

    const userAddressIdNum = parseInt(userAddressId);
    if (isNaN(userAddressIdNum)) {
      return NextResponse.json(
        { success: false, error: 'userAddressId는 숫자여야 합니다.' },
        { status: 400 }
      );
    }

    const repository = new StepResultRepositoryImpl();
    const useCase = new StepResultUseCase(repository);

    let result;
    if (mainNum && subNum) {
      const mainNumInt = parseInt(mainNum);
      const subNumInt = parseInt(subNum);
      if (isNaN(mainNumInt) || isNaN(subNumInt)) {
        return NextResponse.json(
          { success: false, error: 'mainNum과 subNum은 숫자여야 합니다.' },
          { status: 400 }
        );
      }
      result = await useCase.getStepResultByUserAddressAndMainSubNum(userAddressIdNum, mainNumInt, subNumInt);
    } else if (mainNum) {
      const mainNumInt = parseInt(mainNum);
      if (isNaN(mainNumInt)) {
        return NextResponse.json(
          { success: false, error: 'mainNum은 숫자여야 합니다.' },
          { status: 400 }
        );
      }
      result = await useCase.getStepResultsByUserAddressAndMainNum(userAddressIdNum, mainNumInt);
    } else {
      const queryDto: GetStepResultQueryDto = { userAddressId: userAddressIdNum };
      result = await useCase.getStepResultsByUserAddress(queryDto);
    }

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
    if (!body.stepId) {
      errors.push('stepId는 필수입니다.');
    }
    
    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, error: errors.join(', ') },
        { status: 400 }
      );
    }

    const repository = new StepResultRepositoryImpl();
    const useCase = new StepResultUseCase(repository);
    const result = await useCase.upsertStepResult(body);

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
