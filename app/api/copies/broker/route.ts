import { NextRequest, NextResponse } from 'next/server';
import { GetBrokerCopyUsecase } from '@be/applications/brokerCopies/usecases/GetBrokerCopyUsecase';
import { CreateBrokerCopyUsecase } from '@be/applications/brokerCopies/usecases/CreateBrokerCopyUsecase';
import { BrokerCopyRepositoryImpl } from '@be/infrastructure/repository/BrokerCopyRepositoryImpl';
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

    const brokerCopyRepository = new BrokerCopyRepositoryImpl();
    const getBrokerCopyUsecase = new GetBrokerCopyUsecase(brokerCopyRepository);

    const result = await getBrokerCopyUsecase.execute({
      userAddressId: userAddressId,
    });

    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('BrokerCopy GET API 오류:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userAddressNickname, brokerJson } = body;

    // 필수 파라미터 검증
    if (!userAddressNickname) {
      return NextResponse.json(
        { success: false, error: 'userAddressNickname 파라미터가 필요합니다.' },
        { status: 400 }
      );
    }

    if (!brokerJson) {
      return NextResponse.json(
        { success: false, error: 'brokerJson 파라미터가 필요합니다.' },
        { status: 400 }
      );
    }

    // JSON 유효성 검증
    try {
      JSON.parse(brokerJson);
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

    const brokerCopyRepository = new BrokerCopyRepositoryImpl();
    const createBrokerCopyUsecase = new CreateBrokerCopyUsecase(
      brokerCopyRepository
    );

    const result = await createBrokerCopyUsecase.execute({
      userAddressId: userAddressId,
      brokerJson: brokerJson,
    });

    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('BrokerCopy POST API 오류:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
