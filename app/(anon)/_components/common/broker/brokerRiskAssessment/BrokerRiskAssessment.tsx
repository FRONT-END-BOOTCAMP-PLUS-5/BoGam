'use client';

import { styles } from './BrokerRiskAssessment.styles';

interface BrokerRiskAssessmentProps {
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  riskDetails: string[];
}

export const BrokerRiskAssessment = ({
  riskScore,
  riskLevel,
  riskDetails,
}: BrokerRiskAssessmentProps) => {
  const getRiskLevelColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low':
        return styles.riskLow;
      case 'medium':
        return styles.riskMedium;
      case 'high':
        return styles.riskHigh;
      default:
        return styles.riskMedium;
    }
  };

  const getRiskLevelText = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low':
        return '안전';
      case 'medium':
        return '보통';
      case 'high':
        return '주의';
      default:
        return '보통';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>안전도 검사 결과</h3>
        <div className={`${styles.riskBadge} ${getRiskLevelColor(riskLevel)}`}>
          {getRiskLevelText(riskLevel)}
        </div>
      </div>

      <div className={styles.scoreSection}>
        <div className={styles.scoreCircle}>
          <span className={styles.scoreNumber}>{riskScore}</span>
          <span className={styles.scoreLabel}>점</span>
        </div>
        <div className={styles.scoreDescription}>
          <p className={styles.scoreText}>
            이 중개업자의 안전도 점수는 <strong>{riskScore}점</strong>입니다.
          </p>
          <p className={styles.scoreText}>
            위험도 레벨: <strong>{getRiskLevelText(riskLevel)}</strong>
          </p>
        </div>
      </div>

      <div className={styles.detailsSection}>
        <h4 className={styles.detailsTitle}>검사 상세 내용</h4>
        <ul className={styles.detailsList}>
          {riskDetails.map((detail, index) => (
            <li key={index} className={styles.detailItem}>
              {detail}
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.recommendationSection}>
        <h4 className={styles.recommendationTitle}>권장사항</h4>
        {riskLevel === 'low' && (
          <p className={styles.recommendationText}>
            이 중개업자는 안전도가 높습니다. 안심하고 거래하실 수 있습니다.
          </p>
        )}
        {riskLevel === 'medium' && (
          <p className={styles.recommendationText}>
            이 중개업자는 일반적인 수준입니다. 기본적인 주의사항을 지켜
            거래하시기 바랍니다.
          </p>
        )}
        {riskLevel === 'high' && (
          <p className={styles.recommendationText}>
            이 중개업자는 추가적인 확인이 필요합니다. 신중하게 거래하시고,
            필요시 전문가의 조언을 구하시기 바랍니다.
          </p>
        )}
      </div>
    </div>
  );
};
