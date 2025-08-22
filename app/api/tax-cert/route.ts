import { NextRequest, NextResponse } from 'next/server';
import { GetTaxCertUsecase } from '@be/applications/taxCert/usecases/GetTaxCertUsecase';
import { TaxCertRepositoryImpl } from '@be/infrastructure/repository/TaxCertRepositoryImpl';
import { CreateTaxCertCopyUsecase } from '@be/applications/taxCertCopies/usecases/CreateTaxCertCopyUsecase';
import { TaxCertCopyRepositoryImpl } from '@be/infrastructure/repository/TaxCertCopyRepositoryImpl';
import { encryptPassword } from '@libs/codef/codefEncrypter';
import { getUserAddressId } from '@utils/userAddress';
import { TaxCertResponseData } from '@be/applications/taxCert/dtos/GetTaxCertResponseDto';

export async function POST(request: NextRequest) {
  const requestId = `tax-cert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  console.log(`🚀 [${requestId}] 납세증명서 API 요청 시작`);
  
  try {
    const body = await request.json();
    console.log(`📝 [${requestId}] 요청 데이터:`, body);

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
    if (!body.userAddressNickname) {
      errors.push('사용자 주소 닉네임은 필수입니다.');
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
            if (!body.certPassword)
              errors.push('인증서 비밀번호는 필수입니다.');
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
          if (!body.loginTypeLevel)
            errors.push('간편인증 로그인 구분은 필수입니다.');
          if (!body.phoneNo) errors.push('전화번호는 필수입니다.');
          if (body.loginTypeLevel === '5' && !body.telecom) {
            errors.push('통신사는 필수입니다.');
          }
          break;
      }
    }

    // 유효성 검사 실패 시 400 반환
    if (errors.length > 0) {
      console.warn(`⚠️ [${requestId}] 입력 데이터 검증 실패:`, errors);
      return NextResponse.json(
        {
          success: false,
          message: '입력 데이터 검증 실패',
          errors,
        },
        { status: 400 }
      );
    }

    console.log(`✅ [${requestId}] 입력 데이터 검증 통과`);

    // userAddress 닉네임으로부터 ID 가져오기
    console.log(`🔍 [${requestId}] 사용자 주소 ID 조회 시작: ${body.userAddressNickname}`);
    const userAddressId = await getUserAddressId(
      body.userAddressNickname
    );
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

    // 비밀번호 필드들 암호화
    console.log(`🔐 [${requestId}] 비밀번호 암호화 시작`);
    const encryptedBody = { ...body };

    // 비밀번호 필드들 암호화
    if (body.certPassword) {
      console.log(`🔐 [${requestId}] 인증서 비밀번호 암호화`);
      encryptedBody.certPassword = await encryptPassword(body.certPassword);
    }
    if (body.userPassword) {
      console.log(`🔐 [${requestId}] 사용자 비밀번호 암호화`);
      encryptedBody.userPassword = await encryptPassword(body.userPassword);
    }
    if (body.managePassword) {
      console.log(`🔐 [${requestId}] 관리 비밀번호 암호화`);
      encryptedBody.managePassword = await encryptPassword(body.managePassword);
    }
    console.log(`✅ [${requestId}] 비밀번호 암호화 완료`);

    // CODEF API 호출
    console.log(`🌐 [${requestId}] CODEF API 호출 시작`);
    const repository = new TaxCertRepositoryImpl();
    const usecase = new GetTaxCertUsecase(repository);

    const result = await usecase.getTaxCert(encryptedBody);
    console.log(`📡 [${requestId}] CODEF API 응답:`, result);
  
    
         // 추가인증 관련 데이터 상세 분석
     if (result.data) {
       console.log(`🔍 [${requestId}] 추가인증 데이터 분석:`, {
         hasData: !!result.data,
         dataType: typeof result.data,
         dataKeys: result.data ? Object.keys(result.data) : [],
         continue2Way: (result.data as TaxCertResponseData)?.continue2Way,
         method: (result.data as TaxCertResponseData)?.method,
         hasContinue2Way: 'continue2Way' in (result.data || {}),
         hasMethod: 'method' in (result.data || {}),
         fullData: JSON.stringify(result.data, null, 2)
       });
     } else {
       console.log(`⚠️ [${requestId}] result.data가 없습니다`);
     }

    if (!result.success) {
      // CODEF API 비즈니스 로직 실패 시 400 반환
      console.error(`❌ [${requestId}] CODEF API 호출 실패:`, result.error);
      return NextResponse.json(
        {
          success: false,
          message: '납세증명서 API 호출 실패',
          error: result.error,
        },
        { status: 400 }
      );
    }

    // CODEF API 성공 코드 확인
    const codefResultCode = result.data?.result?.code;
    const isCodefSuccess = codefResultCode === 'CF-00000';
    
    console.log(`📊 [${requestId}] CODEF 결과 코드 분석:`, {
      code: codefResultCode,
      isSuccess: isCodefSuccess,
      message: result.data?.result?.message
    });

    // CODEF API 비즈니스 로직 성공 여부에 따라 HTTP 상태 코드 결정
    if (isCodefSuccess) {
      // 완전 성공 (발급 완료) - DB에 저장
      console.log(`💾 [${requestId}] 납세증명서 DB 저장 시작`);
      try {
        const dbRepository = new TaxCertCopyRepositoryImpl();
        const dbUseCase = new CreateTaxCertCopyUsecase(dbRepository);

        if (!result.data) {
          throw new Error('발급된 납세증명서 데이터가 없습니다.');
        }

        const createResponse = await dbUseCase.createTaxCertCopy({
          userAddressId: userAddressId,
          taxCertJson: JSON.parse(JSON.stringify(result.data)),
        });

        if (createResponse.success) {
          console.log(`✅ [${requestId}] 납세증명서 DB 저장 완료:`, {
            userAddressId: userAddressId,
            userAddressNickname: body.userAddressNickname,
            dbId: createResponse.data?.id
          });

          return NextResponse.json(
            {
              success: true,
              message: '납세증명서 발급이 성공적으로 완료되었습니다.',
            },
            { status: 200 }
          );
        } else {
          console.error(`❌ [${requestId}] 납세증명서 DB 저장 실패:`, createResponse.error);

          return NextResponse.json(
            {
              success: true,
              message:
                '납세증명서 발급이 완료되었지만 저장 중 문제가 발생했습니다.',
              warning: 'DB 저장 실패',
            },
            { status: 200 }
          );
        }
      } catch (dbError) {
        console.error(`❌ [${requestId}] 납세증명서 DB 저장 중 예외 발생:`, {
          error: dbError instanceof Error ? dbError.message : '알 수 없는 오류',
          stack: dbError instanceof Error ? dbError.stack : undefined
        });

        // DB 저장 실패해도 API 응답은 성공으로 처리 (발급 자체는 성공했으므로)
        return NextResponse.json(
          {
            success: true,
            message:
              '납세증명서 발급이 완료되었지만 저장 중 문제가 발생했습니다.',
            warning: 'DB 저장 실패',
          },
          { status: 200 }
        );
      }
    } else if (codefResultCode === 'CF-03002') {
      // 추가인증 필요 - 202 Accepted
      console.log(`⏳ [${requestId}] 추가인증 필요 상태 반환`);
      return NextResponse.json(
        {
          success: false,
          message: '추가인증이 필요합니다.',
        },
        { status: 202 }
      );
    } else {
      // CF-00000이 아닌 모든 코드는 실패로 처리 (DB 저장하지 않음)
      console.error(`❌ [${requestId}] CODEF 비즈니스 로직 실패:`, {
        resultCode: codefResultCode,
        message: result.data?.result?.message
      });
      return NextResponse.json(
        {
          success: false,
          message: `납세증명서 발급 실패: ${
            result.data?.result?.message || '알 수 없는 오류'
          }`,
          resultCode: codefResultCode,
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error(`💥 [${requestId}] 납세증명서 API 엔드포인트 예외 발생:`, {
      error: error instanceof Error ? error.message : '알 수 없는 오류',
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      {
        success: false,
        message: '납세증명서 API 호출 중 오류가 발생했습니다.',
        error: error instanceof Error ? error.message : '알 수 없는 오류',
      },
      { status: 500 }
    );
  } finally {
    console.log(`🏁 [${requestId}] 납세증명서 API 요청 종료`);
  }
}
