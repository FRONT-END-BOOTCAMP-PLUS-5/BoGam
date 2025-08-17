import React from 'react';
import { styles } from '@/(anon)/main/_components/daumPostcodeModal/DaumPostcodeModal.styles';

interface DaumPostcodeModalProps {
  showPostcode: boolean;
  postcodeRef: React.RefObject<HTMLDivElement | null>;
  onClose: () => void;
}

export const DaumPostcodeModal: React.FC<DaumPostcodeModalProps> = ({
  showPostcode,
  postcodeRef,
  onClose,
}) => {
  if (!showPostcode) {
    return null;
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>주소 검색</h3>
          <button onClick={onClose} className={styles.closeButton}>
            ✕
          </button>
        </div>
        <div className={styles.modalBody}>
          <div ref={postcodeRef} className={styles.postcodeFrame} />
        </div>
      </div>
    </div>
  );
};
