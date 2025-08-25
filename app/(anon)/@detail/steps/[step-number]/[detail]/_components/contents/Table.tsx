import React, { useState, useEffect } from 'react';
import { styles } from './Table.styles';

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

  // option 필드가 있는 데이터만 필터링
  const dataWithOptions = data.filter((item) => item.option);

  // 날짜 옵션 생성 (최신 날짜부터 정렬)
  const dateOptions = [
    ...new Set(dataWithOptions.map((item) => item.option)),
  ].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

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

  const handleDateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDate(event.target.value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  // option이 있는 데이터가 없으면 드롭다운을 표시하지 않음
  const shouldShowDropdown = dataWithOptions.length > 0;

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
          <label htmlFor='date-select' className={styles.dateLabel}>
            담보물건 설정일:
          </label>
          <select
            id='date-select'
            value={selectedDate}
            onChange={handleDateChange}
            className={styles.dateSelect}
          >
            <option value=''>전체</option>
            {dateOptions.map((date) => (
              <option key={date} value={date}>
                {formatDate(date)} 이후
              </option>
            ))}
          </select>
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

                return sortedDates.flatMap((date, dateIndex) => [
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
    </div>
  );
};

export default Table;
