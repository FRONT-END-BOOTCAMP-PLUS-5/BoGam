import { NextRequest, NextResponse } from 'next/server';
import { CreateTransactionSearchUsecase } from '@be/applications/transactionSearches/usecases/CreateTransactionSearchUsecase';
import { TransactionSearchRepositoryImpl } from '@be/infrastructure/repository/TransactionSearchRepositoryImpl';
import { CreateTransactionSearchRequestDto } from '@be/applications/transactionSearches/dtos/CreateTransactionSearchRequestDto';
import { TransactionSearchData } from '@be/domain/entities/TransactionSearch';
import { getUserAddressId } from '@utils/userAddress';

export async function POST(request: NextRequest) {
  const requestId = `transaction-search-api-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  console.log(`🚀 [${requestId}] 실거래가 검색 데이터 저장 API 요청 시작`);
  
  try {
    const body: TransactionSearchData & { userAddressNickname?: string } = await request.json();
    console.log(`📝 [${requestId}] 요청 데이터:`, JSON.stringify(body, null, 2));

    // 필수 파라미터 검증
    const requiredFields = ['complexName', 'targetArea', 'targetPrice', 'searchResultCount'];
    const missingFields = requiredFields.filter(field => {
      const value = body[field as keyof TransactionSearchData];
      return value === undefined || value === null || value === '';
    });
    
    if (missingFields.length > 0) {
      console.warn(`⚠️ [${requestId}] 필수 파라미터 누락:`, missingFields);
      return NextResponse.json(
        { error: `필수 파라미터가 누락되었습니다: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // userAddressNickname 검증
    if (!body.userAddressNickname) {
      console.warn(`⚠️ [${requestId}] userAddressNickname 파라미터 누락`);
      return NextResponse.json(
        { error: 'userAddressNickname 파라미터가 필요합니다.' },
        { status: 400 }
      );
    }

    console.log(`✅ [${requestId}] 파라미터 검증 통과`);

    // userAddressNickname을 userAddressId로 변환
    console.log(`🔍 [${requestId}] 사용자 주소 ID 조회 시작: ${body.userAddressNickname}`);
    const userAddressId = await getUserAddressId(body.userAddressNickname);
    if (!userAddressId) {
      console.error(`❌ [${requestId}] 유효하지 않은 사용자 주소 닉네임: ${body.userAddressNickname}`);
      return NextResponse.json(
        {
          success: false,
          message: '유효하지 않은 사용자 주소 닉네임입니다.',
          error: 'INVALID_USER_ADDRESS_NICKNAME',
        },
        { status: 400 }
      );
    }
    console.log(`✅ [${requestId}] 사용자 주소 ID 조회 성공: ${userAddressId}`);

    // TransactionSearchData 객체 생성 (userAddressNickname 제외)
    const { userAddressNickname, ...transactionSearchData } = body;

    // UseCase 실행
    console.log(`🔍 [${requestId}] UseCase 실행 시작`);
    const repository = new TransactionSearchRepositoryImpl();
    const usecase = new CreateTransactionSearchUsecase(repository);
    
    const createRequest: CreateTransactionSearchRequestDto = {
      userAddressId: userAddressId,
      transactionSearchData: transactionSearchData,
    };

    const result = await usecase.createTransactionSearch(createRequest);
    
    if (result.success) {
      console.log(`✅ [${requestId}] 실거래가 검색 데이터 저장 성공:`, {
        userAddressId: userAddressId,
        userAddressNickname: body.userAddressNickname,
        dbId: result.data?.id
      });

      return NextResponse.json({
        success: true,
        message: '실거래가 검색 데이터가 성공적으로 저장되었습니다.',
        data: result.data,
      }, { status: 200 });
    } else {
      console.error(`❌ [${requestId}] 실거래가 검색 데이터 저장 실패:`, result.error);

      return NextResponse.json({
        success: false,
        message: '실거래가 검색 데이터 저장 중 문제가 발생했습니다.',
        error: result.error,
      }, { status: 500 });
    }
  } catch (error) {
    console.error(`❌ [${requestId}] 실거래가 검색 데이터 저장 API 오류:`, error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: '실거래가 검색 데이터 저장 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
