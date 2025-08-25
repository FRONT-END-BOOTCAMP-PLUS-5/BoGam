'use client';

import React from 'react';

import { styles } from './DanjiSerialNumberContent.styles';
import { useDanjiSerialNumber, ActualDanjiInfo } from './useDanjiSerialNumber';

interface DanjiSerialNumberContentProps {
  searchParams: {
    addrSido: string;
    addrSigungu: string;
    addrDong: string;
  };
  onSelect?: (danji: ActualDanjiInfo) => void;
}

export function DanjiSerialNumberContent({
  searchParams,
  onSelect,
}: DanjiSerialNumberContentProps) {
  // React Query 훅을 사용하여 단지 목록 조회
  const {
    data: danjiList = [],
    isLoading,
    error,
  } = useDanjiSerialNumber(searchParams);
  console.log('🔍 단지 목록:', searchParams);
  const handleDanjiSelect = (danji: ActualDanjiInfo) => {
    onSelect?.(danji);
  };

  return (
    <div className={styles.container}>
      {/* 단지 목록 */}
      <div className={styles.header}>
        <h3 className={styles.title}>단지 일련번호 목록</h3>
        <p className={styles.subtitle}>
          아래 목록에서 원하는 단지를 선택하세요.
        </p>
      </div>

      {/* 결과 목록 */}
      <div className={styles.contentContainer}>
        {isLoading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>단지 목록을 조회하고 있습니다...</p>
          </div>
        ) : error ? (
          <div className={styles.error}>
            <p>
              {error instanceof Error
                ? error.message
                : '단지 목록 조회 중 오류가 발생했습니다.'}
            </p>
          </div>
        ) : danjiList.length === 0 ? (
          <div className={styles.empty}>
            <p>조회된 단지가 없습니다.</p>
          </div>
        ) : (
          <div className={styles.danjiList}>
            {danjiList &&
              danjiList.map((danji, index) => (
                <div
                  key={`${danji.commBuildingCode}-${index}`}
                  className={styles.danjiItem}
                  onClick={() => handleDanjiSelect(danji)}
                >
                  <div className={styles.danjiName}>
                    {danji.resBuildingName}
                  </div>
                  <div className={styles.danjiInfo}>
                    <span className={styles.address}>
                      {danji.commAddrLotNumber} {danji.resBunji} •{' '}
                      {danji.commAddrRoadName}
                    </span>
                    <span className={styles.buildingCode}>
                      건물코드: {danji.commBuildingCode}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
