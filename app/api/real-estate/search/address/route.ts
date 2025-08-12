import { NextRequest, NextResponse } from 'next/server';
import { encryptPassword } from '@libs/codef/codefEncrypter';
import { DetailInquiryRequest } from '@be/applications/realEstate/dtos/GetRealEstatesRequestDto';
import { GetRealEstatesUsecase } from '@be/applications/realEstate/usecases/GetRealEstatesUsecase';
import { CreateRealEstateCopyUsecase } from '@be/applications/realEstateCopies/usecases/CreateRealEstateCopyUsecase';
import { RealEstateCopyRepositoryImpl } from '@be/infrastructure/repository/RealEstateCopyRepositoryImpl';
import { GetRealEstatesResponseDto } from '@be/applications/realEstate/dtos/GetRealEstatesResponseDto';
import { getUserAddressIdByNickname } from '@utils/userAddress';

const usecase = new GetRealEstatesUsecase();

export async function POST(request: NextRequest) {
  try {
    const body: DetailInquiryRequest & { userAddressNickname: string } & {
      // 2-way 인증 관련 필드
      uniqueNo?: string;
      jobIndex?: number;
      threadIndex?: number;
      jti?: string;
      twoWayTimestamp?: number;
      isTwoWayAuth?: boolean;
    } = await request.json();

    // 필수 필드 검증
    if (!body.password) {
      return NextResponse.json(
        { success: false, message: '비밀번호는 필수입니다.' },
        { status: 400 }
      );
    }

    // realtyType "1" (집합건물)에서 dong 또는 ho 필수 검증
    if (body.realtyType === '1' && !body.dong && !body.ho) {
      return NextResponse.json(
        { success: false, message: '집합건물의 경우 동 또는 호는 필수입니다.' },
        { status: 400 }
      );
    }

    // if (body.password.length !== 4 || !/^\d{4}$/.test(body.password)) {
    //   return NextResponse.json(
    //     { success: false, message: '비밀번호는 4자리 숫자여야 합니다.' },
    //     { status: 400 }
    //   );
    // }

    // if (!body.address) {
    //   return NextResponse.json(
    //     { success: false, message: '검색 주소는 필수입니다.' },
    //     { status: 400 }
    //   );
    // }

    // if (body.address.length < 3) {
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       message: '검색 주소는 최소 3자리 이상이어야 합니다.',
    //     },
    //     { status: 400 }
    //   );
    // }

    // if (!body.userAddressId || typeof body.userAddressId !== 'number') {
    //   return NextResponse.json(
    //     { success: false, message: '사용자 주소 ID는 필수입니다.' },
    //     { status: 400 }
    //   );
    // }

    // 2-way 인증 요청인지 확인
    const isTwoWayAuth = body.isTwoWayAuth === true;

    // API 요청 데이터 구성
    const apiRequest: DetailInquiryRequest & {
      uniqueNo?: string;
      is2Way?: boolean;
      twoWayInfo?: {
        jobIndex: number;
        threadIndex: number;
        jti: string;
        twoWayTimestamp: number;
      };
    } = {
      address: body.address,
      realtyType: body.realtyType,
      addr_sido: body.addr_sido || '',
      recordStatus: body.recordStatus || '0',
      dong: body.dong || '',
      ho: body.ho || '',
      startPageNo: body.startPageNo || '1',
      pageCount: body.pageCount || '100',
      applicationType:
        body.realtyType === '1'
          ? body.applicationType || '0'
          : body.applicationType,

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
      ePrepayNo: 'B58346230711',
      ePrepayPass: 'qwe123',
      originDataYN: body.originDataYN || '0',
      warningSkipYN: body.warningSkipYN || '0',
      registerSummaryYN: body.registerSummaryYN || '0',
      selectAddress: body.selectAddress || '0',
      isIdentityViewYn: body.isIdentityViewYn || '0',
      identityList: body.identityList,
    };

    // 2-way 인증 요청인 경우 추가 파라미터 설정
    if (
      isTwoWayAuth &&
      body.uniqueNo &&
      body.jobIndex !== undefined &&
      body.threadIndex !== undefined &&
      body.jti &&
      body.twoWayTimestamp !== undefined
    ) {
      apiRequest.uniqueNo = body.uniqueNo;
      apiRequest.is2Way = true;
      apiRequest.twoWayInfo = {
        jobIndex: body.jobIndex,
        threadIndex: body.threadIndex,
        jti: body.jti,
        twoWayTimestamp: body.twoWayTimestamp,
      };
    }

    // UseCase 호출
    let response: GetRealEstatesResponseDto;

    if (isTwoWayAuth) {
      // 2-way 인증 요청
      response = await usecase.handleTwoWayAuth(
        apiRequest as unknown as Record<string, unknown>
      );
    } else {
      // 일반 요청
      response = await usecase.getRealEstate(apiRequest);
    }

    // CODEF API 성공 코드 확인
    const codefResultCode = response?.result?.code;
    const isCodefSuccess = codefResultCode === 'CF-00000';

    if (isCodefSuccess) {
      // CF-00000 (완전 성공) - DB에 저장
      try {
        const dbRepository = new RealEstateCopyRepositoryImpl();
        const dbUseCase = new CreateRealEstateCopyUsecase(dbRepository);

        const userAddressId = await getUserAddressIdByNickname(
          body.userAddressNickname
        );

        if (!userAddressId) {
          return NextResponse.json({
            success: false,
            message: '사용자 주소 ID를 찾을 수 없습니다.',
          });
        }

        const createResponse = await dbUseCase.createRealEstateCopy({
          userAddressId: userAddressId,
          realEstateJson: JSON.parse(JSON.stringify(response)),
        });

        if (createResponse.success) {
          console.log('✅ 등기부등본 DB upsert 완료:', {
            userAddressNickname: body.userAddressNickname,
          });

          // 성공 응답 (DB 저장 포함)
          return NextResponse.json({
            success: true,
            message: '부동산등기부등본 조회가 성공적으로 완료되었습니다.',
            data: response,
          });
        } else {
          console.error('❌ 등기부등본 DB upsert 실패');

          return NextResponse.json({
            success: true,
            message:
              '부동산등기부등본 조회가 완료되었지만 저장 중 문제가 발생했습니다.',
            data: response,
            warning: 'DB 저장 실패',
          });
        }
      } catch (dbError) {
        console.error('❌ 등기부등본 DB 저장 실패:', dbError);

        // DB 저장 실패해도 API 응답은 성공으로 처리 (발급 자체는 성공했으므로)
        return NextResponse.json({
          success: true,
          message:
            '부동산등기부등본 조회가 완료되었지만 저장 중 문제가 발생했습니다.',
          data: response,
          warning: 'DB 저장 실패',
        });
      }
    } else if (codefResultCode === 'CF-03002') {
      // 추가인증 필요 - 202 Accepted
      const twoWayInfo = usecase.extractTwoWayInfo(response);

      return NextResponse.json(
        {
          success: false,
          message: '추가인증이 필요합니다.',
          requiresTwoWayAuth: true,
          twoWayInfo: twoWayInfo,
          resAddrList:
            (response.data as { extraInfo?: { resAddrList?: unknown[] } })
              ?.extraInfo?.resAddrList || [],
          data: response,
          resultCode: codefResultCode,
        },
        { status: 202 }
      );
    } else if (codefResultCode === 'CF-00001') {
      // 필수 파라미터 누락 - 400 Bad Request
      return NextResponse.json(
        {
          success: false,
          message: `필수 파라미터 누락: ${
            response?.result?.extraMessage || '알 수 없는 파라미터'
          }`,
          data: response,
          resultCode: codefResultCode,
        },
        { status: 400 }
      );
    } else {
      // CF-00000, CF-03002가 아닌 모든 코드는 실패로 처리 (DB 저장하지 않음)
      return NextResponse.json(
        {
          success: false,
          message: `부동산등기부등본 조회 실패: ${
            response?.result?.message || '알 수 없는 오류'
          }`,
          data: response,
          resultCode: codefResultCode,
        },
        { status: 400 }
      );
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
