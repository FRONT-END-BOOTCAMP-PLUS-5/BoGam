import { NextRequest, NextResponse } from 'next/server';
import { GetRealEstateDataUseCase } from '../../../../../backend/realEstate/applications/usecases/GetRealEstateDataUseCase';
import { encryptPassword } from '../../../../../backend/utils/rsaEncryption';
import { IssueResultRequest } from '../../../../../backend/realEstate/applications/dtos/GetRealEstateRequest';

const useCase = new GetRealEstateDataUseCase();

export async function POST(request: NextRequest) {
  try {
    const body: IssueResultRequest = await request.json();
    const {
      organization,
      phoneNo,
      password,
      inquiryType,
      realtyType,
      addr_sido,
      addr_sigungu,
      addr_roadName,
      addr_buildingNumber,
      electronicClosedYN,
      originData,
      dong,
      ho,
      joinMortgageJeonseYN,
      tradingYN,
      listNumber,
      ePrepayNo,
      ePrepayPass,
      issueType,
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

    if (inquiryType !== '3') {
      return NextResponse.json(
        { success: false, message: 'inquiryType은 3이어야 합니다.' },
        { status: 400 }
      );
    }

    if (!addr_roadName) {
      return NextResponse.json(
        { success: false, message: '도로명은 필수입니다.' },
        { status: 400 }
      );
    }

    if (!addr_buildingNumber) {
      return NextResponse.json(
        { success: false, message: '건물번호는 필수입니다.' },
        { status: 400 }
      );
    }

    // API 요청 데이터 구성 (body를 직접 사용하되 password만 암호화)
    const apiRequest: IssueResultRequest = {
      organization: organization || '0002',
      phoneNo: phoneNo || '01000000000',
      password: encryptPassword(password), // RSA 암호화
      inquiryType: '3' as const,
      issueType: issueType || '1',
      addr_sido: addr_sido || '',
      addr_sigungu: addr_sigungu || '',
      addr_roadName: addr_roadName,
      addr_buildingNumber: addr_buildingNumber,
      originData: originData || '',
      dong: dong || '',
      ho: ho || '',
      realtyType: realtyType || '',
      ePrepayNo: ePrepayNo || '',
      ePrepayPass: ePrepayPass || '',
      originDataYN: originDataYN || '0',
    };

    // UseCase 호출
    const response = await useCase.getRealEstateRegistry(apiRequest);

    // 응답 검증
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
    console.error('도로명주소 검색 에러:', error);
    return NextResponse.json(
      { success: false, message: '서버 내부 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
