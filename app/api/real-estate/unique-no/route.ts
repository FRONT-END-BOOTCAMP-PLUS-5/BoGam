import { NextRequest, NextResponse } from 'next/server';
import { GetRealEstateDataUseCase } from '../../../../backend/realEstate/applications/usecases/GetRealEstateDataUseCase';
import { encryptPassword } from '../../../../libs/codefEncryption';
import { SummaryInquiryRequest } from '../../../../backend/realEstate/applications/dtos/GetRealEstateRequest';

const useCase = new GetRealEstateDataUseCase();

export async function POST(request: NextRequest) {
  try {
    const body: SummaryInquiryRequest = await request.json();
    const {
      organization,
      phoneNo,
      password,
      inquiryType,
      uniqueNo,
      issueType,
      jointMortgageJeonseYN,
      tradingYN,
      listNumber,
      electronicClosedYN,
      ePrepayNo,
      ePrepayPass,
      originDataYN,
      warningSkipYN,
      registerSummaryYN,
      selectAddress,
      isIdentityViewYn,
      identityList,
    } = body;

    // 요청 검증
    if (!password) {
      return NextResponse.json(
        { success: false, message: '비밀번호는 필수입니다.' },
        { status: 400 }
      );
    }

    if (password.length !== 4 || !/^\d{4}$/.test(password)) {
      return NextResponse.json(
        { success: false, message: '비밀번호는 4자리 숫자여야 합니다.' },
        { status: 400 }
      );
    }

    if (inquiryType !== '0') {
      return NextResponse.json(
        { success: false, message: 'inquiryType은 0이어야 합니다.' },
        { status: 400 }
      );
    }

    if (!uniqueNo) {
      return NextResponse.json(
        { success: false, message: '부동산 고유번호는 필수입니다.' },
        { status: 400 }
      );
    }

    if (uniqueNo.length !== 14 || !/^\d{14}$/.test(uniqueNo)) {
      return NextResponse.json(
        {
          success: false,
          message: '부동산 고유번호는 14자리 숫자여야 합니다.',
        },
        { status: 400 }
      );
    }

    // API 요청 데이터 구성 (body를 직접 사용하되 password만 암호화)
    const apiRequest: SummaryInquiryRequest = {
      organization: organization || '0002',
      phoneNo: phoneNo || '01000000000',
      password: await encryptPassword(password), // RSA 암호화
      inquiryType: '0' as const,
      issueType: issueType || '1',
      uniqueNo,

      jointMortgageJeonseYN: jointMortgageJeonseYN || '0',
      tradingYN: tradingYN || '0',
      listNumber: listNumber || undefined,
      electronicClosedYN: electronicClosedYN || '0',
      ePrepayNo: ePrepayNo || undefined,
      ePrepayPass: ePrepayPass || undefined,
      originDataYN: originDataYN || '0',
      warningSkipYN: warningSkipYN || '0',
      registerSummaryYN: registerSummaryYN || '0',
      selectAddress: selectAddress || '0',
      isIdentityViewYn: isIdentityViewYn || '0',
      identityList: identityList || undefined,
    };

    // UseCase 호출
    const response = await useCase.getRealEstateRegistry(apiRequest);

    // 응답 검증
    const validationResult = useCase.validateResponse(response);
    if (!validationResult.isValid) {
      if (validationResult.requiresTwoWayAuth) {
        return NextResponse.json({
          success: false,
          message: '추가인증이 필요합니다.',
          requiresTwoWayAuth: true,
          twoWayInfo: response.data,
        });
      }
      return NextResponse.json(
        { success: false, message: validationResult.message },
        { status: 400 }
      );
    }

    // 2-way 인증 필요 여부 확인
    if (useCase.requiresTwoWayAuth(response)) {
      return NextResponse.json({
        success: false,
        message: '추가인증이 필요합니다.',
        requiresTwoWayAuth: true,
        twoWayInfo: response.data,
      });
    }

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