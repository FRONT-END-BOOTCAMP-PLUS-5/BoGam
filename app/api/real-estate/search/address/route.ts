import { NextRequest, NextResponse } from 'next/server';
import { encryptPassword } from '@/libs/codefEncryption';
import { DetailInquiryRequest } from '@/backend/realEstate/applications/dtos/RealEstateRequest';
import { GetRealEstateDataUseCase } from '@/backend/realEstate/applications/usecases/RealEstateDataUseCase';

const useCase = new GetRealEstateDataUseCase();

export async function POST(request: NextRequest) {
  try {
    const body: DetailInquiryRequest = await request.json();

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
    const response = await useCase.getRealEstateRegistry(apiRequest);

    // 응답 검증은 주석 처리 (개발 중)
    // const validationResult = useCase.validateResponse(response);
    // if (!validationResult.isValid) {
    //   if (validationResult.requiresTwoWayAuth) {
    //     return NextResponse.json({
    //       success: false,
    //       message: '추가인증이 필요합니다.',
    //       requiresTwoWayAuth: true,
    //       twoWayInfo: response.data,
    //     });
    //   }
    //   return NextResponse.json(
    //     { success: false, message: validationResult.message },
    //     { status: 400 }
    //   );
    // }

    // // 2-way 인증 필요 여부 확인
    // if (useCase.requiresTwoWayAuth(response)) {
    //   return NextResponse.json({
    //     success: false,
    //     message: '추가인증이 필요합니다.',
    //     requiresTwoWayAuth: true,
    //     twoWayInfo: response.data,
    //   });
    // }

    // 성공 응답
    return NextResponse.json({
      success: true,
      message: '부동산등기부등본 조회가 성공적으로 완료되었습니다.',
      data: response,
    });
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
