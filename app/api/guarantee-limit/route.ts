import { NextRequest, NextResponse } from 'next/server';
import { GetGuaranteeLimitUsecase } from '@be/applications/guaranteeLimits/usecases/GetGuaranteeLimitUsecase';
import { GuaranteeLimitRepositoryImpl } from '@be/infrastructure/repository/GuaranteeLimitRepositoryImpl';
import { GetGuaranteeLimitRequestDto } from '@be/applications/guaranteeLimits/dtos/GetGuaranteeLimitRequestDto';
import { CreateGuaranteeLimitCopyUsecase } from '@be/applications/guaranteeLimitCopies/usecases/CreateGuaranteeLimitCopyUsecase';
import { GuaranteeLimitCopyRepositoryImpl } from '@be/infrastructure/repository/GuaranteeLimitCopyRepositoryImpl';
import { getUserAddressId } from '@utils/userAddress';

export async function POST(request: NextRequest) {
  const requestId = `guarantee-limit-api-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  console.log(`🚀 [${requestId}] 전세자금보증상품 조회 API 요청 시작`);
  
  try {
    const body: GetGuaranteeLimitRequestDto & { userAddressNickname?: string } = await request.json();
    console.log(`📝 [${requestId}] 요청 데이터:`, JSON.stringify(body, null, 2));

    // 필수 파라미터 검증
    const requiredFields = ['rentGrntAmt', 'trgtLwdgCd', 'age', 'weddStcd', 'myIncmAmt', 'myTotDebtAmt', 'ownHsCnt'];
    const missingFields = requiredFields.filter(field => {
      const value = body[field as keyof GetGuaranteeLimitRequestDto];
      // 숫자 필드는 0도 유효한 값으로 처리
      if (['myTotDebtAmt', 'ownHsCnt', 'mmrtAmt'].includes(field)) {
        return value === undefined || value === null;
      }
      // 다른 필드는 기존 로직 유지
      return !value;
    });
    
    if (missingFields.length > 0) {
      console.warn(`⚠️ [${requestId}] 필수 파라미터 누락:`, missingFields);
      return NextResponse.json(
        { error: `필수 파라미터가 누락되었습니다: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // userAddressNickname 검증 (DB 저장을 위해 필요)
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

    // UseCase 실행
    console.log(`🔍 [${requestId}] UseCase 실행 시작`);
    const repository = new GuaranteeLimitRepositoryImpl();
    const usecase = new GetGuaranteeLimitUsecase(repository);
    const result = await usecase.execute(body);
    
    console.log(`🎯 [${requestId}] API 응답 성공:`, {
      status: 200,
      header: result.header,
      totalCount: result.totalCount,
      itemsCount: result.items.length
    });

    // totalCount가 0이면 상품이 없다고 응답
    if (result.totalCount === 0) {
      console.log(`⚠️ [${requestId}] 조회된 상품이 없음 (totalCount: 0)`);
      return NextResponse.json({
        success: false,
        message: '해당 조건에 맞는 전세자금보증상품이 없습니다.',
        data: result,
      }, { status: 200 });
    }

    // totalCount가 1 이상일 때만 DB에 저장
    console.log(`💾 [${requestId}] 전세자금보증상품 DB 저장 시작 (totalCount: ${result.totalCount})`);
    try {
      const dbRepository = new GuaranteeLimitCopyRepositoryImpl();
      const dbUseCase = new CreateGuaranteeLimitCopyUsecase(dbRepository);

      const createResponse = await dbUseCase.createGuaranteeLimitCopy({
        userAddressId: userAddressId,
        guaranteeLimitJson: JSON.parse(JSON.stringify(result)),
      });

      if (createResponse.success) {
        console.log(`✅ [${requestId}] 전세자금보증상품 DB 저장 완료:`, {
          userAddressId: userAddressId,
          userAddressNickname: body.userAddressNickname,
          dbId: createResponse.data?.id
        });

        return NextResponse.json({
          success: true,
          message: '전세자금보증상품 조회가 성공적으로 완료되었습니다.',
          data: result,
        }, { status: 200 });
      } else {
        console.error(`❌ [${requestId}] 전세자금보증상품 DB 저장 실패:`, createResponse.error);

        return NextResponse.json({
          success: false,
          message: '전세자금보증상품 조회가 완료되었지만 저장 중 문제가 발생했습니다.',
          data: result,
          warning: 'DB 저장 실패',
        }, { status: 200 });
      }
    } catch (dbError) {
      console.error(`❌ [${requestId}] 전세자금보증상품 DB 저장 중 예외 발생:`, {
        error: dbError instanceof Error ? dbError.message : '알 수 없는 오류',
        stack: dbError instanceof Error ? dbError.stack : undefined
      });

      // DB 저장 실패해도 API 응답은 성공으로 처리 (조회 자체는 성공했으므로)
      return NextResponse.json({
        success: false,
        message: '전세자금보증상품 조회가 완료되었지만 저장 중 문제가 발생했습니다.',
        data: result,
        warning: 'DB 저장 실패',
      }, { status: 200 });
    }
  } catch (error) {
    console.error(`❌ [${requestId}] 전세자금보증상품 조회 API 오류:`, error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: '전세자금보증상품 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
