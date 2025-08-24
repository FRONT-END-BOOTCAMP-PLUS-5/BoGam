'use client';

import React from 'react';
import { TransactionList } from '../transactionList/TransactionList';

export const TransactionInquiryTab: React.FC = () => {
  return (
    <div className='w-full h-80'>
      <TransactionList />
    </div>
  );
};
