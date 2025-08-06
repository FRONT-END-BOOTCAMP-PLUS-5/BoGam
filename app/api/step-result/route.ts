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

    // 입력 유효성 검사
    if (!userAddressId) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'userAddressId는 필수입니다.' 
        },
        { status: 400 }
      );
    }

    const userAddressIdNum = parseInt(userAddressId);
    if (isNaN(userAddressIdNum)) {
      return NextResponse.json(
        { 
          success: false, 
          message: '유효하지 않은 userAddressId입니다.' 
        },
        { status: 400 }
      );
    }

    const repository = new StepResultRepositoryImpl();
    const useCase = new StepResultUseCase(repository);
    
    let result;

    // mainNum과 subNum이 모두 있으면 특정 스탭 조회
    if (mainNum && subNum) {
      const mainNumInt = parseInt(mainNum);
      const subNumInt = parseInt(subNum);
      
      if (isNaN(mainNumInt) || isNaN(subNumInt)) {
        return NextResponse.json(
          { 
            success: false, 
            message: '유효하지 않은 mainNum 또는 subNum입니다.' 
          },
          { status: 400 }
        );
      }

      result = await useCase.getStepResultByUserAddressAndMainSubNum(userAddressIdNum, mainNumInt, subNumInt);
    }
    // mainNum만 있으면 해당 mainNum의 모든 스탭 조회
    else if (mainNum) {
      const mainNumInt = parseInt(mainNum);
      
      if (isNaN(mainNumInt)) {
        return NextResponse.json(
          { 
            success: false, 
            message: '유효하지 않은 mainNum입니다.' 
          },
          { status: 400 }
        );
      }

      result = await useCase.getStepResultsByUserAddressAndMainNum(userAddressIdNum, mainNumInt);
    }
    // 둘 다 없으면 전체 조회
    else {
      const queryDto: GetStepResultQueryDto = {
        userAddressId: userAddressIdNum
      };
      result = await useCase.getStepResultsByUserAddress(queryDto);
    }

    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: '스탭 결과 조회 실패',
          error: result.error 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      message: result.message
    }, { status: 200 });

  } catch (error) {
    console.error('❌ 스탭 결과 조회 오류:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: '서버 오류가 발생했습니다.' 
      },
      { status: 500 }
    );
  }
}

// POST /api/step-result (upsert - 생성 또는 업데이트)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 입력 유효성 검사
    const errors: string[] = [];
    
    if (!body.userAddressId) {
      errors.push('userAddressId는 필수입니다.');
    }
    if (!body.stepId) {
      errors.push('stepId는 필수입니다.');
    }
    
    // 유효성 검사 실패 시 400 반환
    if (errors.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: '입력 데이터 검증 실패',
          errors 
        },
        { status: 400 }
      );
    }

    const repository = new StepResultRepositoryImpl();
    const useCase = new StepResultUseCase(repository);
    
    // upsert로 생성 또는 업데이트
    const result = await useCase.upsertStepResult(body);

    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: '스탭 결과 생성/수정 실패',
          error: result.error 
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      message: result.message
    }, { status: 200 });

  } catch (error) {
    console.error('❌ 스탭 결과 생성/수정 오류:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: '서버 오류가 발생했습니다.' 
      },
      { status: 500 }
    );
  }
}

// PUT /api/step-result?id=1
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'id는 필수입니다.' 
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    const repository = new StepResultRepositoryImpl();
    const useCase = new StepResultUseCase(repository);
    
    const result = await useCase.updateStepResult(parseInt(id), body);

    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: '스탭 결과 수정 실패',
          error: result.error 
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      message: result.message
    }, { status: 200 });

  } catch (error) {
    console.error('❌ 스탭 결과 수정 오류:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: '서버 오류가 발생했습니다.' 
      },
      { status: 500 }
    );
  }
}

// DELETE /api/step-result?id=1
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'id는 필수입니다.' 
        },
        { status: 400 }
      );
    }

    const repository = new StepResultRepositoryImpl();
    const useCase = new StepResultUseCase(repository);
    
    const result = await useCase.deleteStepResult(parseInt(id));

    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: '스탭 결과 삭제 실패',
          error: result.error 
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message
    }, { status: 200 });

  } catch (error) {
    console.error('❌ 스탭 결과 삭제 오류:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: '서버 오류가 발생했습니다.' 
      },
      { status: 500 }
    );
  }
}
