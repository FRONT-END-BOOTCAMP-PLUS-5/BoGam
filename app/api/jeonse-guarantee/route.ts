import { NextRequest, NextResponse } from 'next/server';
import { GetJeonseGuaranteeUsecase } from '@be/applications/jeonseGuarantees/usecases/GetJeonseGuaranteeUsecase';
import { JeonseGuaranteeRepositoryImpl } from '@be/infrastructure/repository/JeonseGuaranteeRepositoryImpl';
import { GetJeonseGuaranteeRequestDto } from '@be/applications/jeonseGuarantees/dtos/GetJeonseGuaranteeRequestDto';

export async function POST(request: NextRequest) {
  const requestId = `jeonse-guarantee-api-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  console.log(`🚀 [${requestId}] 전세자금보증상품 조회 API 요청 시작`);
  
  try {
    const body: GetJeonseGuaranteeRequestDto = await request.json();
    console.log(`📝 [${requestId}] 요청 데이터:`, JSON.stringify(body, null, 2));

    // 필수 파라미터 검증
    const requiredFields = ['rentGrntAmt', 'trgtLwdgCd', 'age', 'weddStcd', 'myIncmAmt', 'myTotDebtAmt', 'ownHsCnt'];
    const missingFields = requiredFields.filter(field => !body[field as keyof GetJeonseGuaranteeRequestDto]);
    
    // mmrtAmt는 0이 허용되는 값이므로 별도 검증
    if (body.mmrtAmt === undefined || body.mmrtAmt === null) {
      missingFields.push('mmrtAmt');
    }
    
    if (missingFields.length > 0) {
      console.warn(`⚠️ [${requestId}] 필수 파라미터 누락:`, missingFields);
      return NextResponse.json(
        { error: `필수 파라미터가 누락되었습니다: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    console.log(`✅ [${requestId}] 파라미터 검증 통과`);

    // UseCase 실행
    console.log(`🔍 [${requestId}] UseCase 실행 시작`);
    const repository = new JeonseGuaranteeRepositoryImpl();
    const usecase = new GetJeonseGuaranteeUsecase(repository);
    const result = await usecase.execute(body);
    
    console.log(`🎯 [${requestId}] API 응답 성공:`, {
      status: 200,
      header: result.header,
      totalCount: result.totalCount,
      itemsCount: result.items.length
    });

    return NextResponse.json(result, { status: 200 });
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
