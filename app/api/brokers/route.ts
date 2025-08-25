import { NextRequest, NextResponse } from 'next/server';
import { GetBrokerUsecase } from '@be/applications/brokers/usecases/GetBrokerUsecase';
import { CreateBrokerCopyUsecase } from '@be/applications/brokerCopies/usecases/CreateBrokerCopyUsecase';
import { ApiBrokerRepository } from '@be/infrastructure/repository/ApiBrokerRepository';
import { BrokerCopyRepositoryImpl } from '@be/infrastructure/repository/BrokerCopyRepositoryImpl';
import { getUserAddressId } from '@utils/userAddress';

/**
 * 중개사 정보 조회 API
 *
 * @description
 * VWorld API를 통해 중개사 정보를 조회하고, 조회된 정보를 자동으로 BrokerCopy 테이블에 저장/수정합니다.
 *
 * @param req - NextRequest 객체
 * @returns 중개사 정보 또는 에러 응답
 *
 * @example
 * // 중개업자명만으로 조회 (10개, 1페이지)
 * GET /api/brokers?brkrNm=테스트
 *
 * // 페이지네이션과 함께 조회
 * GET /api/brokers?brkrNm=테스트&numOfRows=20&pageNo=2
 *
 * // 사업자상호와 함께 정확한 조회
 * GET /api/brokers?brkrNm=테스트&bsnmCmpnm=부동산중개
 *
 * // 파라미터 없이 조회 (에러)
 * GET /api/brokers
 *
 * @param {string} brkrNm - 중개업자명 (필수)
 * @param {string} [bsnmCmpnm] - 사업자상호 (선택)
 * @param {number} [numOfRows] - 검색건수, 기본값: 10, 최대: 1000
 * @param {number} [pageNo] - 페이지번호, 기본값: 1, 최소: 1
 * @param {string} userAddressNickname - 사용자 주소 닉네임 (필수, BrokerCopy 저장용)
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const brkrNm = searchParams.get('brkrNm');
    const bsnmCmpnm = searchParams.get('bsnmCmpnm');
    const numOfRows = searchParams.get('numOfRows');
    const pageNo = searchParams.get('pageNo');
    const userAddressNickname = searchParams.get('userAddressNickname');

    // 필수 파라미터 검증
    if (!brkrNm) {
      return NextResponse.json(
        {
          success: false,
          error: '중개업자명(brkrNm) 파라미터는 필수입니다.',
        },
        { status: 400 }
      );
    }

    if (!userAddressNickname) {
      return NextResponse.json(
        {
          success: false,
          error:
            '사용자 주소 닉네임(userAddressNickname) 파라미터는 BrokerCopy 저장을 위해 필수입니다.',
        },
        { status: 400 }
      );
    }

    // userAddressNickname을 userAddressId로 변환
    const userAddressId = await getUserAddressId(userAddressNickname);
    if (!userAddressId) {
      return NextResponse.json(
        {
          success: false,
          error:
            '유효하지 않은 사용자 주소 닉네임이거나 사용자를 찾을 수 없습니다.',
        },
        { status: 400 }
      );
    }

    // 페이지네이션 파라미터 검증 및 기본값 설정
    const validatedNumOfRows = numOfRows
      ? Math.min(parseInt(numOfRows), 1000)
      : 10; // 최대 1000
    const validatedPageNo = pageNo ? Math.max(parseInt(pageNo), 1) : 1; // 최소 1

    const usecase = new GetBrokerUsecase(new ApiBrokerRepository());
    const result = await usecase.execute({
      brkrNm,
      bsnmCmpnm: bsnmCmpnm || undefined,
      numOfRows: validatedNumOfRows,
      pageNo: validatedPageNo,
    });

    // 중개사 정보를 BrokerCopy에 저장/수정
    try {
      const createBrokerCopyUsecase = new CreateBrokerCopyUsecase(
        new BrokerCopyRepositoryImpl()
      );
      const brokerCopyResult = await createBrokerCopyUsecase.execute({
        userAddressId: userAddressId,
        brokerJson: JSON.stringify(
          Array.isArray(result)
            ? result.map((broker) => Object.assign({}, broker))
            : [Object.assign({}, result)]
        ),
      });

      if (!brokerCopyResult.success) {
        console.warn('⚠️ 중개업자 복사본 저장 실패:', brokerCopyResult.error);
      }
    } catch (error) {
      console.warn('⚠️ 중개업자 복사본 저장 중 오류:', error);
      // BrokerCopy 저장 실패는 전체 API 응답에 영향을 주지 않음
    }

    return NextResponse.json({
      success: true,
      data: result,
      pagination: {
        numOfRows: validatedNumOfRows,
        pageNo: validatedPageNo,
      },
      brokerCopy: {
        saved: true,
        userAddressId: userAddressId,
      },
      message: '중개업자 정보 조회가 완료되었습니다.',
    });
  } catch (error) {
    console.error('❌ 중개사 조회 API 오류:', error);
    return NextResponse.json(
      {
        success: false,
        error: '중개업자 조회 중 오류가 발생했습니다.',
        message: error instanceof Error ? error.message : '알 수 없는 오류',
      },
      { status: 500 }
    );
  }
}
