'use client';

import JeonseGuaranteeSummary from './JeonseGuaranteeSummary';

export default function JeonseGuaranteeExample() {
  const handleDetailClick = () => {
    console.log('상세 정보 보기 클릭');
  };

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-6'>전세보증 요약 컴포넌트 예시</h1>

      <JeonseGuaranteeSummary
        address='서울특별시 송파구 위례광장로 121'
        buildingCode='1171010900120277764'
        housingType='APT'
        typeForAPI='0'
        unitArea={59.63}
        deposit={200_000_000}
        monthly={500_000}
        priorDebtC={150_000_000}
        priorDepositD={0}
        isCapitalRegion={true}
        isSpecialRefundGuarantee={false}
        isLowestFloorOrResidenceOfficetel={false}
        ntsOfficetelStdPrice={undefined}
        onClickDetail={handleDetailClick}
      />
    </div>
  );
}
