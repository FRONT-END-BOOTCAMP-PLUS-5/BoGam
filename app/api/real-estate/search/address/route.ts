import { NextRequest, NextResponse } from 'next/server';
import { encryptPassword } from '@libs/codef/codefEncrypter';
import { DetailInquiryRequest } from '@be/applications/realEstate/dtos/GetRealEstatesRequestDto';
import { GetRealEstatesUsecase } from '@be/applications/realEstate/usecases/GetRealEstatesUsecase';
import { CreateRealEstateCopyUsecase } from '@be/applications/realEstateCopies/usecases/CreateRealEstateCopyUsecase';
import { RealEstateCopyRepositoryImpl } from '@be/infrastructure/repository/RealEstateCopyRepositoryImpl';
import { getUserAddressId } from '@utils/userAddress';

const useCase = new GetRealEstatesUsecase();

export async function POST(request: NextRequest) {
  try {
    const body: DetailInquiryRequest & { userAddressNickname: string } = await request.json();

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

    if (body.inquiryType !== '1') {
      return NextResponse.json(
        { success: false, message: 'inquiryType은 1이어야 합니다.' },
        { status: 400 }
      );
    }

    if (!body.address) {
      return NextResponse.json(
        { success: false, message: '검색 주소는 필수입니다.' },
        { status: 400 }
      );
    }

    if (body.address.length < 3) {
      return NextResponse.json(
        {
          success: false,
          message: '검색 주소는 최소 3자리 이상이어야 합니다.',
        },
        { status: 400 }
      );
    }

    if (!body.userAddressNickname) {
      return NextResponse.json(
        { success: false, message: '사용자 주소 닉네임은 필수입니다.' },
        { status: 400 }
      );
    }

    // userAddressNickname으로부터 userAddressId 가져오기
    const userAddressId = await getUserAddressId(
      body.userAddressNickname
    );
    if (!userAddressId) {
      return NextResponse.json(
        { success: false, message: '유효하지 않은 사용자 주소 닉네임입니다.' },
        { status: 400 }
      );
    }

    // API 요청 데이터 구성 (body에서 직접 추출하여 기본값 적용)
    const apiRequest: DetailInquiryRequest = {
      address: body.address,
      realtyType: body.realtyType,
      addr_sido: body.addr_sido || '',
      recordStatus: body.recordStatus || '0',
      dong: body.dong || '',
      ho: body.ho || '',
      startPageNo: body.startPageNo || '1',
      pageCount: body.pageCount || '100',
      applicationType: body.applicationType || '0',

      //------------------공통 필수 파라미터-------------------
      organization: body.organization || '0002',
      phoneNo: body.phoneNo || '01000000000',
      password: await encryptPassword(body.password), // RSA 암호화
      inquiryType: '1' as const,
      issueType: body.issueType || '1',

      //------------------공통 옵션 파라미터-------------------
      joinMortgageJeonseYN: body.joinMortgageJeonseYN || '0',
      tradingYN: body.tradingYN || '0',
      listNumber: body.listNumber,
      electronicClosedYN: body.electronicClosedYN || '0',
      ePrepayNo: body.ePrepayNo,
      ePrepayPass: body.ePrepayPass,
      originDataYN: body.originDataYN || '0',
      warningSkipYN: body.warningSkipYN || '0',
      registerSummaryYN: body.registerSummaryYN || '0',
      selectAddress: body.selectAddress || '0',
      isIdentityViewYn: body.isIdentityViewYn || '0',
      identityList: body.identityList,
    };

    // UseCase 호출
    const response = await useCase.getRealEstate(apiRequest);

    // CODEF API 성공 코드 확인 (CF-00000일 때만 성공으로 처리)
    const codefResultCode = response?.result?.code;
    const isCodefSuccess = codefResultCode === 'CF-00000';

    if (isCodefSuccess) {
      // CF-00000 (완전 성공) - DB에 저장
      try {
        const dbRepository = new RealEstateCopyRepositoryImpl();
        const dbUseCase = new CreateRealEstateCopyUsecase(dbRepository);
        
        const isSuccess = await dbUseCase.createRealEstateCopy({
          userAddressId: userAddressId,
          realEstateJson: JSON.parse(JSON.stringify(response))
        });

        if (isSuccess) {
          console.log('✅ 등기부등본 DB upsert 완료:', {
            userAddressId: userAddressId
          });

          // 성공 응답 (DB 저장 포함)
          return NextResponse.json({
            success: true,
            message: '부동산등기부등본 조회가 성공적으로 완료되었습니다.',
            data: response
          });
        } else {
          console.error('❌ 등기부등본 DB upsert 실패');
          
          return NextResponse.json({
            success: true,
            message: '부동산등기부등본 조회가 완료되었지만 저장 중 문제가 발생했습니다.',
            data: response,
            warning: 'DB 저장 실패'
          });
        }
      } catch (dbError) {
        console.error('❌ 등기부등본 DB 저장 실패:', dbError);
        
        // DB 저장 실패해도 API 응답은 성공으로 처리 (발급 자체는 성공했으므로)
        return NextResponse.json({
          success: true,
          message: '부동산등기부등본 조회가 완료되었지만 저장 중 문제가 발생했습니다.',
          data: response,
          warning: 'DB 저장 실패'
        });
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
