'use client';

import { useExpandable } from '../hooks/useExpandable';
import { styles } from '../StepDetail.styles';
import { X, ChevronRight } from 'lucide-react';
import TextBadge from './TextBadge';

interface StepData {
  detailTitle: string;
  isSafe: boolean;
  expandableTitle: string;
  details: Array<{
    key: string;
    value: string;
  }>;
}

interface ModalContentProps {
  stepData: StepData;
  onClose: () => void;
}

export default function ModalContent({ stepData, onClose }: ModalContentProps) {
  const { isExpanded, toggleExpanded } = useExpandable();

  return (
    <>
      {/* Modal Header */}
      <div className={styles.modalHeader}>
        <button className={styles.closeButton} onClick={onClose}>
          <X size={24} />
        </button>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <h2 className={styles.detailTitle}>{stepData.detailTitle}</h2>
          {stepData.isSafe && (
            <TextBadge type="match" size="md" />
          )}
        </div>

        {/* Expandable Section */}
        <div className={styles.expandableSection}>
          <button className={styles.expandableHeader} onClick={toggleExpanded}>
            <ChevronRight
              className={`${styles.expandIcon} ${
                isExpanded ? 'rotate-90' : ''
              }`}
              size={16}
            />
            <span className={styles.expandableTitle}>
              {stepData.expandableTitle}
            </span>
          </button>

          {isExpanded && (
            <div className={styles.detailsList}>
              {stepData.details.map((detailItem, index) => (
                <div key={index} className={styles.detailItem}>
                  <span className={styles.detailKey}>{detailItem.key} :</span>
                  <span className={styles.detailValue}>{detailItem.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
