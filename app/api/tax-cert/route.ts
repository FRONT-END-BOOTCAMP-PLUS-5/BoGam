import { NextRequest, NextResponse } from 'next/server';
import { TaxCertUseCase } from '../../../backend/tax-cert/application/usecase/TaxCertUseCase';
import { TaxCertRepositoryImpl } from '../../../backend/tax-cert/infrastructure/repository/TaxCertRepositoryImpl';
import { encryptPassword } from '../../../libs/codefEncryption';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 입력 유효성 검사
    const errors: string[] = [];

    // 기본 필수 필드 검증
    if (!body.organization) {
      errors.push('기관코드는 필수입니다.');
    }
    if (!body.loginType) {
      errors.push('로그인 구분은 필수입니다.');
    }
    if (!body.isIdentityViewYN) {
      errors.push('주민등록번호 공개 여부는 필수입니다.');
    }
    if (!body.proofType) {
      errors.push('증명구분은 필수입니다.');
    }
    if (!body.submitTargets) {
      errors.push('제출처는 필수입니다.');
    }

    // 로그인 타입별 필수 필드 검증
    if (!body.is2Way) {
      const loginType = body.loginType;
      
      switch (loginType) {
        case '0': // 회원 인증서로그인
        case '2': // 비회원 인증서로그인
          if (!body.certType) {
            errors.push('인증서 구분은 필수입니다.');
          }
          if (body.certType === '1') {
            if (!body.certFile) errors.push('인증서 파일은 필수입니다.');
            if (!body.keyFile) errors.push('키 파일은 필수입니다.');
            if (!body.certPassword) errors.push('인증서 비밀번호는 필수입니다.');
          }
          break;
        case '1': // 회원 아이디로그인
          if (!body.userId) errors.push('아이디는 필수입니다.');
          if (!body.userPassword) errors.push('비밀번호는 필수입니다.');
          break;
        case '5': // 회원 간편인증
        case '6': // 비회원 간편인증
          if (!body.userName) errors.push('사용자 이름은 필수입니다.');
          if (!body.loginIdentity) errors.push('사용자 주민번호는 필수입니다.');
          if (!body.loginTypeLevel) errors.push('간편인증 로그인 구분은 필수입니다.');
          if (!body.phoneNo) errors.push('전화번호는 필수입니다.');
          if (body.loginTypeLevel === '5' && !body.telecom) {
            errors.push('통신사는 필수입니다.');
          }
          break;
      }
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

    // 비밀번호 필드들 암호화
    const encryptedBody = { ...body };

    // 비밀번호 필드들 암호화
    if (body.certPassword) {
      encryptedBody.certPassword = await encryptPassword(body.certPassword);
    }
    if (body.userPassword) {
      encryptedBody.userPassword = await encryptPassword(body.userPassword);
    }
    if (body.managePassword) {
      encryptedBody.managePassword = await encryptPassword(body.managePassword);
    }

    const repository = new TaxCertRepositoryImpl();
    const useCase = new TaxCertUseCase(repository);
    
    const result = await useCase.requestTaxCert(encryptedBody);

    if (!result.success) {
      // CODEF API 비즈니스 로직 실패 시 400 반환
      return NextResponse.json(
        { 
          success: false, 
          message: '납세증명서 API 호출 실패',
          error: result.error 
        },
        { status: 400 }
      );
    }

    // CODEF API 성공 코드 확인
    const codefResultCode = result.data?.result?.code;
    const isCodefSuccess = codefResultCode === 'CF-00000';

    // CODEF API 비즈니스 로직 성공 여부에 따라 HTTP 상태 코드 결정
    if (isCodefSuccess) {
      // 완전 성공 (발급 완료) - 200 OK
      return NextResponse.json({
        success: true,
        message: '납세증명서 발급이 성공적으로 완료되었습니다.',
        data: result.data
      }, { status: 200 });
    } else if (codefResultCode === 'CF-03002') {
      // 추가인증 필요 - 202 Accepted
      return NextResponse.json({
        success: false,
        message: '추가인증이 필요합니다.',
        data: result.data
      }, { status: 202 });
    } else {
      // 기타 성공 코드 - 200 OK
      return NextResponse.json({
        success: true,
        message: '납세증명서 발급이 완료되었습니다.',
        data: result.data
      }, { status: 200 });
    }
  } catch (error) {
    console.error('❌ 납세증명서 API 엔드포인트 오류:', {
      error: error instanceof Error ? error.message : '알 수 없는 오류',
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    return NextResponse.json(
      { 
        success: false, 
        message: '납세증명서 API 호출 중 오류가 발생했습니다.',
        error: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    );
  }
} 