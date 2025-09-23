'use client';

import React, { forwardRef, useImperativeHandle } from 'react';
import { TransactionSearchContainer, TransactionSearchContainerRef } from '@/(anon)/_components/common/transactionSearch/transactionSearchContainer/TransactionSearchContainer';

interface TransactionSearchWrapperProps {
  sectionIndex: number;
  section: {
    type: string;
  };
}

export interface TransactionSearchWrapperRef {
  handleTransactionSearch: () => void;
}

const TransactionSearchWrapper = forwardRef<TransactionSearchWrapperRef, TransactionSearchWrapperProps>(({
  sectionIndex,
  section,
}, ref) => {
  const transactionSearchContainerRef = React.useRef<TransactionSearchContainerRef | null>(null);

  // ref를 통해 외부에서 접근할 수 있는 메서드 노출
  useImperativeHandle(ref, () => ({
    handleTransactionSearch: () => {
      if (transactionSearchContainerRef.current) {
        transactionSearchContainerRef.current.handleTransactionSearch();
      }
    },
  }));

  // 슬라이드별 렌더링
  switch (sectionIndex) {
    case 0:
      return (
        <TransactionSearchContainer
          ref={transactionSearchContainerRef}
        />
      );

    default:
      return null;
  }
});

TransactionSearchWrapper.displayName = 'TransactionSearchWrapper';

export default TransactionSearchWrapper;
