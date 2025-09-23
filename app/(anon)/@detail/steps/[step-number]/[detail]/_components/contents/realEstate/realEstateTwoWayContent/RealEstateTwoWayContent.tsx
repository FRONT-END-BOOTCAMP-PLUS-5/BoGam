'use client';

import React from 'react';
import { AddressListItem } from '@/(anon)/@detail/steps/[step-number]/[detail]/_components/contents/realEstate/types';
import { styles } from './RealEstateTwoWayContent.styles';

interface RealEstateTwoWayContentProps {
  resAddrList: AddressListItem[];
  selectedAddress: AddressListItem | null;
  onAddressSelect: (address: AddressListItem) => void;
}

export const RealEstateTwoWayContent: React.FC<
  RealEstateTwoWayContentProps
> = ({ resAddrList, selectedAddress, onAddressSelect }) => {
  return (
    <div className={styles.container}>
      <p className={styles.description}>
        아래 부동산 목록에서 조회하고자 하는 부동산을 클릭하세요.
      </p>

      {/* 부동산 목록 */}
      <div className={styles.addressListContainer}>
        {resAddrList.map((addr, index) => (
          <div
            key={index}
            className={`${styles.addressItem} ${
              selectedAddress?.commUniqueNo === addr.commUniqueNo
                ? styles.addressItemSelected
                : styles.addressItemDefault
            }`}
            onClick={() => onAddressSelect(addr)}
          >
            <div className={styles.addressItemContent}>
              <div className={styles.addressLocation}>
                📍 {addr.commAddrLotNumber?.replace(/\+/g, ' ')}
              </div>
              <div className={styles.addressUniqueNo}>
                🔑 {addr.commUniqueNo}
              </div>
              {addr.resUserNm && (
                <div className={styles.addressOwner}>👤 {addr.resUserNm}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
