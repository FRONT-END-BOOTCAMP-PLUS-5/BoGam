'use client';

import { useExpandable } from '../hooks/useExpandable';
import { styles } from '../StepDetail.styles';

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
          <svg
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M18 6L6 18M6 6L18 18'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </button>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <h2 className={styles.detailTitle}>{stepData.detailTitle}</h2>
          {stepData.isSafe && (
            <div className={styles.safetyBadge}>
              <svg
                width='16'
                height='16'
                viewBox='0 0 16 16'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M13 4L6 11L3 8'
                  stroke='white'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
              <span>안전</span>
            </div>
          )}
        </div>

        {/* Expandable Section */}
        <div className={styles.expandableSection}>
          <button className={styles.expandableHeader} onClick={toggleExpanded}>
            <svg
              className={`${styles.expandIcon} ${
                isExpanded ? 'rotate-90' : ''
              }`}
              viewBox='0 0 16 16'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M6 12L10 8L6 4'
                stroke='black'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
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
