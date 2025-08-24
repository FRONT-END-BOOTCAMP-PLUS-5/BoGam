'use client';

import React from 'react';
import { TaxCertChecklistItem } from '@/hooks/useTaxCertRiskAssessment';
import { styles } from './TaxCertChecklist.styles';

interface TaxCertChecklistProps {
  checklistItems: TaxCertChecklistItem[];
  checkedItems: number;
  totalChecklistItems: number;
  onItemChange: (itemId: string, checked: boolean) => void;
}

export const TaxCertChecklist: React.FC<TaxCertChecklistProps> = ({
  checklistItems,
  checkedItems,
  totalChecklistItems,
  onItemChange,
}) => {
  return (
    <div className={styles.checklistSection}>
      <div className={styles.checklistHeader}>
        <h4 className={styles.checklistTitle}>체크리스트 확인</h4>
        <div className={styles.checklistSummary}>
          체크 완료: {checkedItems}/{totalChecklistItems} (
          {Math.round((checkedItems / totalChecklistItems) * 100)}%)
        </div>
      </div>

      <div className={styles.checklistGrid}>
        {checklistItems.map((item) => (
          <div
            key={item.id}
            className={`${styles.checklistItem} ${
              item.checked
                ? styles.checklistItemChecked
                : styles.checklistItemUnchecked
            }`}
          >
            <div className={styles.checklistItemHeader}>
              <div className={styles.checklistItemControls}>
                <label className={styles.radioLabel}>
                  <input
                    type='radio'
                    name={`checklist-${item.id}`}
                    value='pass'
                    checked={item.checked}
                    onChange={() => onItemChange(item.id, true)}
                    className={styles.radioInput}
                  />
                  <span className={styles.radioText}>통과</span>
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type='radio'
                    name={`checklist-${item.id}`}
                    value='fail'
                    checked={!item.checked}
                    onChange={() => onItemChange(item.id, false)}
                    className={styles.radioInput}
                  />
                  <span className={styles.radioText}>실패</span>
                </label>
              </div>
              <span className={styles.checklistItemLabel}>{item.label}</span>
            </div>
            <div className={styles.checklistItemDescription}>
              {item.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
