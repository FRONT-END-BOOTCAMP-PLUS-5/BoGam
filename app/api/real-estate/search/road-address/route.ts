import { NextRequest, NextResponse } from 'next/server';
import { GetRealEstateDataUseCase } from '@be/applications/realEstate/usecases/RealEstateDataUseCase';
import { encryptPassword } from '@libs/codefEncryption';
import { IssueResultRequest } from '@be/applications/realEstate/dtos/RealEstateRequest';
import { RealEstateCopyUseCase } from '@be/applications/realEstateCopy/usecases/RealEstateCopyUseCase';
import { RealEstateCopyRepositoryImpl } from '@be/infrastructure/repository/RealEstateCopyRepositoryImpl';

const useCase = new GetRealEstateDataUseCase();

export async function POST(request: NextRequest) {
  try {
    const body: IssueResultRequest & { userAddressId: number } = await request.json();

    // 요청 검증
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

    if (body.inquiryType !== '3') {
      return NextResponse.json(
        { success: false, message: 'inquiryType은 3이어야 합니다.' },
        { status: 400 }
      );
    }

    if (!body.addr_roadName) {
      return NextResponse.json(
        { success: false, message: '도로명은 필수입니다.' },
        { status: 400 }
      );
    }

    if (!body.addr_buildingNumber) {
      return NextResponse.json(
        { success: false, message: '건물번호는 필수입니다.' },
        { status: 400 }
      );
    }

    if (!body.userAddressId || typeof body.userAddressId !== 'number') {
      return NextResponse.json(
        { success: false, message: '사용자 주소 ID는 필수입니다.' },
        { status: 400 }
      );
    }

    // API 요청 데이터 구성 (body를 직접 사용하되 password만 암호화)
    const apiRequest: IssueResultRequest = {
      addr_sido: body.addr_sido || '',
      addr_sigungu: body.addr_sigungu || '',
      addr_roadName: body.addr_roadName,
      addr_buildingNumber: body.addr_buildingNumber,
      originData: body.originData || '',
      dong: body.dong || '',
      ho: body.ho || '',

      //------------------공통 필수 파라미터-------------------
      organization: body.organization || '0002',
      phoneNo: body.phoneNo || '01000000000',
      password: await encryptPassword(body.password), // RSA 암호화
      inquiryType: '3' as const,
      userAddressId: body.userAddressId,
      issueType: body.issueType || '1',
      ePrepayNo: body.ePrepayNo || '',
      ePrepayPass: body.ePrepayPass || '',
      realtyType: body.realtyType || '',

      //------------------공통 옵션 파라미터-------------------
      joinMortgageJeonseYN: body.joinMortgageJeonseYN || '0',
      tradingYN: body.tradingYN || '0',
      listNumber: body.listNumber,
      electronicClosedYN: body.electronicClosedYN || '0',
      warningSkipYN: body.warningSkipYN || '0',
      registerSummaryYN: body.registerSummaryYN || '0',
      selectAddress: body.selectAddress || '0',
      isIdentityViewYn: body.isIdentityViewYn || '0',
      identityList: body.identityList,
    };

    // UseCase 호출
    const response = await useCase.getRealEstateRegistry(apiRequest);

    // CODEF API 성공 코드 확인 (CF-00000일 때만 성공으로 처리)
    const codefResultCode = response?.result?.code;
    const isCodefSuccess = codefResultCode === 'CF-00000';

    if (isCodefSuccess) {
      // CF-00000 (완전 성공) - DB에 저장
      let savedRealEstateCopy = null;
      try {
        const dbRepository = new RealEstateCopyRepositoryImpl();
        const dbUseCase = new RealEstateCopyUseCase(dbRepository);
        
        savedRealEstateCopy = await dbUseCase.upsertRealEstateCopy({
          userAddressId: body.userAddressId,
          realEstateJson: JSON.parse(JSON.stringify(response))
        });

        console.log('✅ 등기부등본 DB upsert 완료:', {
          realEstateCopyId: savedRealEstateCopy.id,
          userAddressId: savedRealEstateCopy.userAddressId
        });

        // 성공 응답 (DB 저장 포함)
        return NextResponse.json({
          success: true,
          message: '부동산등기부등본 조회가 성공적으로 완료되었습니다.',
          data: response,
          savedRealEstateCopy: {
            id: savedRealEstateCopy.id,
            userAddressId: savedRealEstateCopy.userAddressId
          }
        }, { status: 200 });
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
