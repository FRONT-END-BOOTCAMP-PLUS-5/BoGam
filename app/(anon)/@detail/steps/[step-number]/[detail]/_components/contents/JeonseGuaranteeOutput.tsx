'use client';

import { GetJeonseGuaranteeResponseDto } from '@libs/api_front/jeonseGuarantee.api';

interface JeonseGuaranteeOutputProps {
  data: GetJeonseGuaranteeResponseDto | undefined;
  isPending: boolean;
}

export default function JeonseGuaranteeOutput({
  data,
  isPending,
}: JeonseGuaranteeOutputProps) {
  console.log('JeonseGuaranteeOutput 렌더링:', {
    isPending,
    hasData: !!data,
    data,
  });

  return (
    <div className='p-6 bg-white'>
      <div className='mb-6'>
        <h3 className='text-xl font-bold text-gray-800 mb-2'>보증한도 확인</h3>
        <p className='text-sm text-gray-600'>
          조건에 맞는 전세자금보증한도를 확인해보세요.
        </p>
      </div>

      {isPending ? (
        <div className='text-center py-8'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4'></div>
          <p className='text-gray-600'>
            전세자금보증상품을 조회하고 있습니다...
          </p>
          <p className='text-sm text-gray-500 mt-2'>
            로딩 상태: {isPending ? '진행 중' : '완료'}
          </p>
        </div>
      ) : data && data.items && data.items.length > 0 ? (
        <div>
          <div className='space-y-4'>
            {data.items.map(
              (
                item: GetJeonseGuaranteeResponseDto['items'][0],
                index: number
              ) => (
                <div
                  key={index}
                  className='p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200 shadow-sm'
                >
                  <div className='text-center'>
                    <div className='mb-4'>
                      <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3'>
                        <span className='text-blue-600 text-2xl'>💰</span>
                      </div>
                      <h4 className='text-lg font-bold text-gray-800 mb-2'>
                        전세자금보증한도
                      </h4>
                    </div>

                    <div className='bg-white rounded-lg p-4 border border-blue-200'>
                      <div className='text-center'>
                        <div className='text-2xl font-bold text-blue-600 mb-1'>
                          {parseInt(item.grntLmtAmt).toLocaleString()}원
                        </div>
                        <div className='text-sm text-gray-600'>
                          최대 보증 가능 금액
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      ) : (
        <div className='text-center py-8'>
          <div className='mb-4'>
            <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <span className='text-gray-400 text-2xl'>📋</span>
            </div>
            <h4 className='font-semibold text-gray-800 mb-2'>
              조회된 상품이 없습니다
            </h4>
            <p className='text-gray-600'>
              입력하신 조건에 맞는 전세자금보증상품을 찾을 수 없습니다.
            </p>
            <p className='text-sm text-gray-500 mt-2'>
              다른 조건으로 다시 조회해보세요.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
