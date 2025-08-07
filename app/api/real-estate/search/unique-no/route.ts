import { NextRequest, NextResponse } from 'next/server';
import { RealEstateUseCase } from '@be/applications/realEstate/usecases/RealEstateUseCase';
import { encryptPassword } from '@libs/codefEncryption';
import { SummaryInquiryRequest } from '@be/applications/realEstate/dtos/RealEstateRequest';
import { RealEstateCopyUseCase } from '@be/applications/realEstateCopy/usecases/RealEstateCopyUseCase';
import { RealEstateCopyRepositoryImpl } from '@be/infrastructure/repository/RealEstateCopyRepositoryImpl';

const useCase = new RealEstateUseCase();

export async function POST(request: NextRequest) {
  try {
    const body: SummaryInquiryRequest & { userAddressId: number } = await request.json();

    // 필수 필드 검증
    if (!body.password) {
      return NextResponse.json(
        { success: false, message: '비밀번호는 필수입니다.' },
        { status: 400 }
      );
    }

    if (body.password.length !== 4 || !/^\d{4}$/.test(body.password)) {
      return NextResponse.json(
        { success: false, message: '비밀번호는 4자리 숫자여야 합니다.' },
        { status: 400 }
      );
    }

    if (body.inquiryType !== '0') {
      return NextResponse.json(
        { success: false, message: 'inquiryType은 0이어야 합니다.' },
        { status: 400 }
      );
    }

    if (!body.uniqueNo) {
      return NextResponse.json(
        { success: false, message: '부동산 고유번호는 필수입니다.' },
        { status: 400 }
      );
    }

    if (body.uniqueNo.length !== 14 || !/^\d{14}$/.test(body.uniqueNo)) {
      return NextResponse.json(
        {
          success: false,
          message: '부동산 고유번호는 14자리 숫자여야 합니다.',
        },
        { status: 400 }
      );
    }

    if (!body.userAddressId || typeof body.userAddressId !== 'number') {
      return NextResponse.json(
        { success: false, message: '사용자 주소 ID는 필수입니다.' },
        { status: 400 }
      );
    }

    // API 요청 데이터 구성 (body에서 직접 추출하여 기본값 적용)
    const apiRequest: SummaryInquiryRequest = {
      uniqueNo: body.uniqueNo,

      //------------------공통 필수 파라미터-------------------
      organization: body.organization || '0002',
      phoneNo: body.phoneNo || '01000000000',
      password: await encryptPassword(body.password), // RSA 암호화
      inquiryType: '0' as const,
      userAddressId: body.userAddressId,
      issueType: body.issueType || '1',
      ePrepayNo: body.ePrepayNo || undefined,
      ePrepayPass: body.ePrepayPass || undefined,

      //------------------공통 옵션 파라미터-------------------
      joinMortgageJeonseYN: body.joinMortgageJeonseYN || '0',
      tradingYN: body.tradingYN || '0',
      listNumber: body.listNumber,
      electronicClosedYN: body.electronicClosedYN || '0',

      originDataYN: body.originDataYN || '0',
      warningSkipYN: body.warningSkipYN || '0',
      registerSummaryYN: body.registerSummaryYN || '0',
      selectAddress: body.selectAddress || '0',
      isIdentityViewYn: body.isIdentityViewYn || '0',
      identityList: body.identityList,
    };

    // UseCase 호출
    const response = await useCase.getRealEstateRegistry(apiRequest);

    // 2-way 인증 필요 여부 확인
    if (useCase.requiresTwoWayAuth(response)) {
      return NextResponse.json({
        success: false,
        message: '추가인증이 필요합니다.',
        requiresTwoWayAuth: true,
        twoWayInfo: response.data,
      });
    }

    // CODEF API 성공 코드 확인 (CF-00000일 때만 성공으로 처리)
    const codefResultCode = response?.result?.code;
    const isCodefSuccess = codefResultCode === 'CF-00000';

    if (isCodefSuccess) {
      // CF-00000 (완전 성공) - DB에 저장
      try {
        const dbRepository = new RealEstateCopyRepositoryImpl();
        const dbUseCase = new RealEstateCopyUseCase(dbRepository);
        
        const isSuccess = await dbUseCase.upsertRealEstateCopy({
          userAddressId: body.userAddressId,
          realEstateJson: JSON.parse(JSON.stringify(response))
        });

        if (isSuccess) {
          console.log('✅ 등기부등본 DB upsert 완료:', {
            userAddressId: body.userAddressId
          });

          // 성공 응답 (DB 저장 포함)
          return NextResponse.json({
            success: true,
            message: '부동산등기부등본 조회가 성공적으로 완료되었습니다.',
            data: response
          }, { status: 200 });
        } else {
          console.error('❌ 등기부등본 DB upsert 실패');
          
          return NextResponse.json({
            success: true,
            message: '부동산등기부등본 조회가 완료되었지만 저장 중 문제가 발생했습니다.',
            data: response,
            warning: 'DB 저장 실패'
          }, { status: 200 });
        }
      } catch (dbError) {
        console.error('❌ 등기부등본 DB 저장 실패:', dbError);
        
        // DB 저장 실패해도 API 응답은 성공으로 처리 (발급 자체는 성공했으므로)
        return NextResponse.json({
          success: true,
          message: '부동산등기부등본 조회가 완료되었지만 저장 중 문제가 발생했습니다.',
          data: response,
          warning: 'DB 저장 실패'
        }, { status: 200 });
      }
    } else {
      // CF-00000이 아닌 모든 코드는 실패로 처리 (DB 저장하지 않음)
      return NextResponse.json({
        success: false,
        message: `부동산등기부등본 조회 실패: ${response?.result?.message || '알 수 없는 오류'}`,
        data: response,
        resultCode: codefResultCode
      }, { status: 400 });
    }
  } catch (error) {
    console.error('❌ 부동산등기부등본 조회 API 오류:', error);
    return NextResponse.json(
      {
        success: false,
        message: '부동산등기부등본 조회 중 오류가 발생했습니다.',
        error: error instanceof Error ? error.message : '알 수 없는 오류',
      },
      { status: 500 }
    );
  }
}
