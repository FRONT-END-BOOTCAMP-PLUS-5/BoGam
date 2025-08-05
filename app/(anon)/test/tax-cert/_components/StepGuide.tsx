'use client';

import React from 'react';
import styles from '@/(anon)/test/tax-cert/_components/StepGuide.module.css';
import { CodefResponse } from '@be/applications/taxCert/dtos/TaxCertDto';
import { extractActualData } from '@libs/responseUtils';

interface StepGuideProps {
  currentStep: number;
  isLoading: boolean;
  response: CodefResponse | null;
}

export default function StepGuide({ currentStep, isLoading, response }: StepGuideProps) {
  // 실제 데이터 추출
  const actualData = response ? extractActualData(response) : undefined;

  // 단계별 가이드 메시지
  const getStepGuide = () => {
    switch (currentStep) {
      case 1:
        return {
          title: '📋 1단계: 기본 정보 입력',
          description: '납세증명서 발급에 필요한 기본 정보를 입력해주세요.',
          status: 'current'
        };
      case 2:
        return {
          title: '🔐 2단계: CODEF API 1차 요청',
          description: 'CODEF API에 1차 요청을 보내고 추가인증 필요 여부를 확인합니다.',
          status: isLoading ? 'loading' : 'current'
        };
      case 3:
        return {
          title: '✅ 3단계: 추가인증 진행',
          description: actualData?.continue2Way ? 
            `${actualData.method === 'simpleAuth' ? '간편인증' : '금융인증서'} 추가인증을 진행해주세요.` :
            '추가인증이 필요하지 않습니다.',
          status: actualData?.continue2Way ? 'current' : 'completed'
        };
      case 4:
        return {
          title: '📄 4단계: 결과 확인',
          description: '납세증명서 발급 결과를 확인합니다.',
          status: response ? 'completed' : 'waiting'
        };
      default:
        return {
          title: '시작',
          description: '납세증명서 발급을 시작합니다.',
          status: 'waiting'
        };
    }
  };

  return (
    <div className={styles.stepContainer}>
      <h3 className={styles.stepTitle}>📋 진행 단계</h3>
      <div className={styles.stepGrid}>
        {[1, 2, 3, 4].map((step) => {
          const isCurrent = currentStep === step;
          const isCompleted = currentStep > step;
          
          return (
            <div key={step} className={`${styles.stepItem} ${
              isCurrent ? styles.stepItemCurrent :
              isCompleted ? styles.stepItemCompleted :
              styles.stepItemWaiting
            }`}>
              <div className={`${styles.stepIcon} ${
                isCurrent ? styles.stepIconCurrent :
                isCompleted ? styles.stepIconCompleted :
                styles.stepIconWaiting
              }`}>
                {isCompleted ? '✅' : isCurrent ? '🔄' : '⏳'}
              </div>
              <div className={`${styles.stepText} ${
                isCurrent ? styles.stepTextCurrent :
                isCompleted ? styles.stepTextCompleted :
                styles.stepTextWaiting
              }`}>
                {step}단계
              </div>
            </div>
          );
        })}
      </div>
      
      {/* 현재 단계 가이드 */}
      <div className={styles.guideContainer}>
        {(() => {
          const guide = getStepGuide();
          return (
            <div>
              <h4 className={`${styles.guideTitle} ${
                guide.status === 'current' ? styles.guideTitleCurrent :
                guide.status === 'completed' ? styles.guideTitleCompleted :
                guide.status === 'loading' ? styles.guideTitleLoading :
                styles.guideTitleWaiting
              }`}>
                {guide.title}
              </h4>
              <p className={styles.guideDescription}>{guide.description}</p>
              {guide.status === 'loading' && (
                <div className={styles.loadingContainer}>
                  <div className={styles.loadingSpinner}></div>
                  처리 중...
                </div>
              )}
              
              {/* 단계별 액션 버튼 */}
              {currentStep === 1 && (
                <div className={styles.actionContainer}>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={styles.actionButton}
                  >
                    {isLoading ? '🔄 처리 중...' : '📋 2단계로 진행'}
                  </button>
                  <p className={styles.actionNote}>
                    * 모든 필수 정보를 입력한 후 클릭하세요.
                  </p>
                </div>
              )}
              
              {currentStep === 2 && isLoading && (
                <div className={styles.actionContainer}>
                  <div className={styles.loadingContainer}>
                    <div className={styles.loadingSpinner}></div>
                    CODEF API 요청 중...
                  </div>
                </div>
              )}
              
              {currentStep === 3 && actualData?.continue2Way && (
                <div className={styles.actionContainer}>
                  <p className={styles.guideDescription}>
                    추가인증이 필요합니다. 아래 버튼을 클릭하여 진행하세요.
                  </p>
                </div>
              )}
              
              {currentStep === 4 && response && (
                <div className={styles.actionContainer}>
                  <div className={styles.completedContainer}>
                    <h5 className={styles.completedTitle}>✅ 처리 완료</h5>
                    <p className={styles.completedDescription}>
                      납세증명서 발급이 완료되었습니다. 결과를 확인하세요.
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
} 