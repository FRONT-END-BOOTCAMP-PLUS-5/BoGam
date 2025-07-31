import { NextRequest, NextResponse } from 'next/server';
import { TaxCertUseCase } from '../../../backend/tax-cert/application/usecase/TaxCertUseCase';
import { TaxCertRepositoryImpl } from '../../../backend/tax-cert/infrastructure/repository/TaxCertRepositoryImpl';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const repository = new TaxCertRepositoryImpl();
    const useCase = new TaxCertUseCase(repository);
    
    const result = await useCase.requestTaxCert(body);

    if (!result.success) {
      // CODEF API 비즈니스 로직 실패 시 400 반환
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    // CODEF API 성공 코드 확인
    const codefResultCode = result.data?.result?.code;
    const isCodefSuccess = codefResultCode === 'CF-00000';

    // CODEF API 비즈니스 로직 성공 여부에 따라 HTTP 상태 코드 결정
    if (isCodefSuccess) {
      // 완전 성공 (발급 완료) - 200 OK
      return NextResponse.json(result.data, { status: 200 });
    } else if (codefResultCode === 'CF-03002') {
      // 추가인증 필요 - 202 Accepted
      return NextResponse.json(result.data, { status: 202 });
    } else {
      // 기타 성공 코드 - 200 OK
      return NextResponse.json(result.data, { status: 200 });
    }
  } catch (error) {
    console.error('❌ 납세증명서 API 엔드포인트 오류:', {
      error: error instanceof Error ? error.message : '알 수 없는 오류',
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    return NextResponse.json(
      { error: '납세증명서 API 호출 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 