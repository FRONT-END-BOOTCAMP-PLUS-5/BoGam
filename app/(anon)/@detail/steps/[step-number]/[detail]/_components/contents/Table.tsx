import React, { useState, useEffect, useRef } from 'react';
import { styles } from './Table.styles';
import { DropDown } from '@/(anon)/_components/common/dropdown/DropDown';
import { formatDate } from '@utils/dateUtils';
import { useGetStepResult } from '@/hooks/useStepResultQueries';
import { useStepResultMutations } from '@/hooks/useStepResultMutations';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import { parseStepUrl } from '@utils/stepUrlParser';
import CircularIconBadge from '@/(anon)/_components/common/circularIconBadges/CircularIconBadge';
import LoadingOverlay from '@/(anon)/_components/common/loading/LoadingOverlay';

interface RegionData {
  region: string;
  depositRange: string;
  priorityAmount: string;
  option: string;
}

interface TableProps {
  title?: string;
  columnTitles?: string[];
  description?: string[];
  data: RegionData[];
}

const Table = ({
  title = '소액보증금 최우선변제 기준 변천사',
  columnTitles = [],
  description,
  data,
}: TableProps) => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [currentData, setCurrentData] = useState<RegionData[]>([]);

  // 전역 store에서 선택된 주소 가져오기
  const selectedAddress = useUserAddressStore((state) => state.selectedAddress);

  // URL에서 stepNumber와 detail 가져오기
  const pathname = window.location.pathname;
  const stepInfo = parseStepUrl(pathname);

  // 초기화 여부를 추적하는 ref
  const hasInitialized = useRef(false);

  // useStepResultMutations 훅 사용
  const { upsertStepResult, removeQueries } = useStepResultMutations();

  // useGetStepResult 훅 사용
  const {
    data: stepData,
    isLoading,
    isError,
  } = useGetStepResult({
    userAddressNickname: selectedAddress?.nickname || '',
    stepNumber: stepInfo?.stepNumber?.toString() || '',
    detail: stepInfo?.detail?.toString() || '',
  });

  // stepData가 배열인지 단일 객체인지 확인하고 jsonDetails 추출
  const stepResultData = Array.isArray(stepData) ? stepData[0] : stepData;
  const jsonDetails =
    stepResultData && 'jsonDetails' in stepResultData
      ? stepResultData.jsonDetails
      : undefined;

  // DB에서 가져온 값에서 열람 상태를 match로 업데이트
  useEffect(() => {
    if (data.length === 0 || hasInitialized.current || !jsonDetails) {
      return;
    }

    // DB에서 가져온 값이 있고, 아직 초기화되지 않았을 때
    const shouldInitialize = !hasInitialized.current && jsonDetails;

    if (
      shouldInitialize &&
      selectedAddress?.id &&
      stepInfo?.stepNumber &&
      stepInfo?.detail
    ) {
      // 기존 jsonDetails에서 열람 상태만 match로 변경
      const updatedDetails = {
        ...jsonDetails,
        열람: 'match' as const,
      };

      // DB 저장
      upsertStepResult.mutate({
        userAddressNickname: selectedAddress.nickname,
        stepNumber: stepInfo.stepNumber,
        detail: stepInfo.detail,
        jsonDetails: updatedDetails,
      });

      // 쿼리 완전 중단
      removeQueries(
        selectedAddress.nickname,
        stepInfo.stepNumber,
        stepInfo.detail
      );

      hasInitialized.current = true;
    }
  }, [
    stepData,
    isError,
    data,
    jsonDetails,
    selectedAddress?.id,
    selectedAddress?.nickname,
    stepInfo?.stepNumber,
    stepInfo?.detail,
    upsertStepResult,
    removeQueries,
  ]);

  // option 필드가 있는 데이터만 필터링
  const dataWithOptions = data.filter((item) => item.option);

  // 날짜 옵션 생성 (최신 날짜부터 정렬)
  const dateOptions = [
    ...new Set(dataWithOptions.map((item) => item.option)),
  ].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  // DropDown 컴포넌트용 옵션 데이터 변환
  const dropdownOptions = [
    { value: '', label: '전체' },
    ...dateOptions.map((date) => ({
      value: date,
      label: `${formatDate(date)} 이후`
    }))
  ];

  // 선택된 날짜에 따른 데이터 설정
  useEffect(() => {
    if (selectedDate) {
      const filteredData = dataWithOptions.filter(
        (item) => item.option === selectedDate
      );
      setCurrentData(filteredData);
    } else {
      // 날짜를 선택하지 않았을 때는 모든 데이터 표시
      setCurrentData(dataWithOptions);
    }
  }, [selectedDate]); // dataWithOptions 제거

  const handleDateChange = (value: string) => {
    setSelectedDate(value);
  };

  // option이 있는 데이터가 없으면 드롭다운을 표시하지 않음
  const shouldShowDropdown = dataWithOptions.length > 0;

  // 로딩 상태
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <LoadingOverlay
            isVisible={true}
            title="데이터를 불러오고 있습니다..."
            currentStep={1}
            totalSteps={1}
            variant="inline"
            spinnerSize="small"
          />
        </div>
      </div>
    );
  }

  // 에러 상태 (400 에러 시 데이터를 찾을 수 없다고 표시)
  if (isError && !hasInitialized.current) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>데이터를 찾을 수 없습니다.</div>
      </div>
    );
  }

  // stepData 표시 함수 - jsonDetails의 값들을 CircularIconBadge로 표시
  const renderStepData = () => (
    <div className={styles.stepDataSection}>
      <div className={styles.badgeContainer}>
        {Object.entries(jsonDetails || {})
          .filter(([key]) => key === '열람')
          .map(([key, value]) => (
            <CircularIconBadge
              key={key}
              type={value as 'match' | 'mismatch' | 'unchecked'}
              size='sm'
            />
          ))}
        <span className={styles.stepDataTitle}>읽음</span>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.title}>{title}</div>
      {/* 참고사항 */}
      <div className={styles.note}>
        {description
          ? description.map((text, index) => (
              <p key={index} className={styles.noteText}>
                * {text}
              </p>
            ))
          : null}
      </div>
      {/* 옵션 드롭다운 컨테이너 */}
      {/* 날짜 선택 드롭다운 - option이 있는 경우에만 표시 */}
      {shouldShowDropdown && (
        <div className={styles.dateSelector}>
          <DropDown
            options={dropdownOptions}
            value={selectedDate}
            onChange={handleDateChange}
            placeholder="전체"
            label="담보물건 설정일:"
            id="date-select"
          />
        </div>
      )}

      {/* 선택된 날짜 표시 */}
      {selectedDate && (
        <div className={styles.selectedDate}>
          <span className={styles.dateText}>
            {formatDate(selectedDate)} 이후 적용되는 기준
          </span>
        </div>
      )}

      {/* 테이블 */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          {columnTitles && columnTitles.length > 0 && (
            <thead>
              <tr className={styles.tableHeader}>
                {columnTitles.map((title, index) => (
                  <th key={index} className={styles.tableHeaderCell}>
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {(() => {
              if (selectedDate) {
                // 특정 날짜 선택 시: 해당 날짜의 데이터만 표시
                return currentData.map((item, index) => (
                  <tr key={index} className={styles.tableRow}>
                    <td
                      className={`${styles.tableCell} ${styles.tableCellLeft}`}
                    >
                      {item.region}
                    </td>
                    <td
                      className={`${styles.tableCell} ${styles.tableCellCenter}`}
                    >
                      {item.depositRange}
                    </td>
                    <td
                      className={`${styles.tableCell} ${styles.tableCellRight}`}
                    >
                      {item.priorityAmount}
                    </td>
                  </tr>
                ));
              } else {
                // 날짜 미선택 시: 날짜별로 그룹화하여 표시
                const groupedData = dataWithOptions.reduce((acc, item) => {
                  if (!acc[item.option]) {
                    acc[item.option] = [];
                  }
                  acc[item.option].push(item);
                  return acc;
                }, {} as Record<string, RegionData[]>);

                const sortedDates = Object.keys(groupedData).sort(
                  (a, b) => new Date(b).getTime() - new Date(a).getTime()
                );

                return sortedDates.flatMap((date) => [
                  // 날짜 헤더 행
                  <tr key={`date-${date}`} className={styles.dateHeaderRow}>
                    <td colSpan={3} className={styles.dateHeaderCell}>
                      {formatDate(date)} 이후
                    </td>
                  </tr>,
                  // 해당 날짜의 데이터 행들
                  ...groupedData[date].map((item, itemIndex) => (
                    <tr
                      key={`${date}-${itemIndex}`}
                      className={styles.tableRow}
                    >
                      <td
                        className={`${styles.tableCell} ${styles.tableCellLeft}`}
                      >
                        {item.region}
                      </td>
                      <td
                        className={`${styles.tableCell} ${styles.tableCellCenter}`}
                      >
                        {item.depositRange}
                      </td>
                      <td
                        className={`${styles.tableCell} ${styles.tableCellRight}`}
                      >
                        {item.priorityAmount}
                      </td>
                    </tr>
                  )),
                ]);
              }
            })()}
          </tbody>
        </table>
      </div>

      {/* 읽음 표시 */}
      {renderStepData()}
    </div>
  );
};

export default Table;
