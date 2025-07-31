import { NextRequest, NextResponse } from 'next/server';
import { TaxCertUseCase } from '../../../backend/tax-cert/application/usecase/TaxCertUseCase';
import { TaxCertRepositoryImpl } from '../../../backend/tax-cert/infrastructure/repository/TaxCertRepositoryImpl';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('🚀 납세증명서 API 엔드포인트 호출:', {
      method: 'POST',
      url: request.url,
      is2Way: body.is2Way,
      requestType: body.is2Way ? '추가인증 요청' : '기본 요청',
      requestDataKeys: Object.keys(body),
    });

    // 요청 데이터 상세 로깅
    console.log('📋 받은 요청 데이터:', {
      organization: body.organization,
      loginType: body.loginType,
      phoneNo: body.phoneNo,
      userName: body.userName,
      loginIdentity: body.loginIdentity,
      id: body.id,
      isIdentityViewYN: body.isIdentityViewYN,
      proofType: body.proofType,
      submitTargets: body.submitTargets,
      applicationType: body.applicationType,
      clientTypeLevel: body.clientTypeLevel,
      identity: body.identity,
      birthDate: body.birthDate,
      originDataYN: body.originDataYN,
      originDataYN1: body.originDataYN1,
    });

    // Clean Architecture 적용
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
    
    console.log('✅ 납세증명서 API 엔드포인트 성공:', {
      duration: `${result.duration}ms`,
      resultCode: codefResultCode,
      resultMessage: result.data?.result?.message,
      continue2Way: result.data?.data?.continue2Way,
      hasResIssueNo: !!result.data?.data?.resIssueNo,
      transactionId: result.data?.result?.transactionId,
      httpStatus: isCodefSuccess ? 200 : 202, // 성공이면 200, 추가인증 필요하면 202
    });

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