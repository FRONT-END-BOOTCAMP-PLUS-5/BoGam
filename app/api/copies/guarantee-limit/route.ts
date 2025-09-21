import { NextRequest, NextResponse } from 'next/server';
import { GetGuaranteeLimitCopyUsecase } from '@be/applications/guaranteeLimitCopies/usecases/GetGuaranteeLimitCopyUsecase';
import { CreateGuaranteeLimitCopyUsecase } from '@be/applications/guaranteeLimitCopies/usecases/CreateGuaranteeLimitCopyUsecase';
import { GuaranteeLimitCopyRepositoryImpl } from '@be/infrastructure/repository/GuaranteeLimitCopyRepositoryImpl';
import { getUserAddressId } from '@utils/userAddress';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userAddressNickname = searchParams.get('userAddressNickname');

    if (!userAddressNickname) {
      return NextResponse.json(
        { success: false, error: 'userAddressNickname 파라미터가 필요합니다.' },
        { status: 400 }
      );
    }

    // userAddressNickname을 userAddressId로 변환
    const userAddressId = await getUserAddressId(userAddressNickname);
    if (!userAddressId) {
      return NextResponse.json(
        {
          success: false,
          error: '주소 닉네임을 찾을 수 없습니다.',
        },
        { status: 400 }
      );
    }

    const guaranteeLimitCopyRepository = new GuaranteeLimitCopyRepositoryImpl();
    const getGuaranteeLimitCopyUsecase = new GetGuaranteeLimitCopyUsecase(guaranteeLimitCopyRepository);

    const result = await getGuaranteeLimitCopyUsecase.getGuaranteeLimitCopy({
      userAddressId: userAddressId,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('GuaranteeLimitCopy GET API 오류:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userAddressNickname, guaranteeLimitJson } = body;

    // 필수 파라미터 검증
    if (!userAddressNickname) {
      return NextResponse.json(
        { success: false, error: 'userAddressNickname 파라미터가 필요합니다.' },
        { status: 400 }
      );
    }

    if (!guaranteeLimitJson) {
      return NextResponse.json(
        { success: false, error: 'guaranteeLimitJson 파라미터가 필요합니다.' },
        { status: 400 }
      );
    }

    // JSON 유효성 검증
    try {
      JSON.parse(guaranteeLimitJson);
    } catch (error) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 JSON 형식입니다.' },
        { status: 400 }
      );
    }

    const userAddressId = await getUserAddressId(userAddressNickname);
    if (!userAddressId) {
      return NextResponse.json(
        { success: false, error: '주소 닉네임을 찾을 수 없습니다.' },
        { status: 400 }
      );
    }

    const guaranteeLimitCopyRepository = new GuaranteeLimitCopyRepositoryImpl();
    const createGuaranteeLimitCopyUsecase = new CreateGuaranteeLimitCopyUsecase(
      guaranteeLimitCopyRepository
    );

    const result = await createGuaranteeLimitCopyUsecase.createGuaranteeLimitCopy({
      userAddressId: userAddressId,
      guaranteeLimitJson: JSON.parse(guaranteeLimitJson),
    });

    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('GuaranteeLimitCopy POST API 오류:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
