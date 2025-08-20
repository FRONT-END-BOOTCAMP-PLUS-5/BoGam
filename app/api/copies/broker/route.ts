import { NextRequest, NextResponse } from 'next/server';
import { GetBrokerCopyUsecase } from '@be/applications/brokerCopies/usecases/GetBrokerCopyUsecase';
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
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid userAddressNickname or user not found' 
      }, { status: 400 });
    }

    const brokerCopyRepository = new BrokerCopyRepositoryImpl();
    const getBrokerCopyUsecase = new GetBrokerCopyUsecase(brokerCopyRepository);
    
    const result = await getBrokerCopyUsecase.execute({ 
      userAddressId: userAddressId
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userAddressId = searchParams.get('userAddressId');

    if (!userAddressId) {
      return NextResponse.json(
        { success: false, error: 'userAddressId 파라미터가 필요합니다.' },
        { status: 400 }
      );
    }

    const brokerCopyRepository = new BrokerCopyRepositoryImpl();
    const getBrokerCopyUsecase = new GetBrokerCopyUsecase(brokerCopyRepository);
    
    const result = await getBrokerCopyUsecase.execute({ 
      userAddressId: parseInt(userAddressId, 10) 
    });
    
    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 404 });
    }
  } catch (error) {
    console.error('BrokerCopy GET API 오류:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
