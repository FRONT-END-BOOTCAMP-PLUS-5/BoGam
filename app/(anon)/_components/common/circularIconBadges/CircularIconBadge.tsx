'use client';

import { Check, X, Link } from 'lucide-react';
import clsx from 'clsx';
import { styles } from './CircularIconBadge.styles';

type CircularIconBadgeProps = {
  type: 'match' | 'match-blue' | 'mismatch' | 'unchecked' | 'uncheck' | 'unchecked-white' | 'link' | 'match-light-green' | 'mismatch-emoji';
  size?: 'xsm' | 'sm' | 'md' | 'lg';
  weight?: 'thin' | 'normal' | 'thick';
  className?: string;
  onClick?: () => void;
  clickable?: boolean;
  stepData?: {
    stepNumber: number;
    detail: number;
    userAddressId: number;
    currentDetails: Record<string, 'match' | 'mismatch' | 'uncheck'>;
    currentKey?: string;
    onStepResultUpdate?: (newDetails: Record<string, 'match' | 'mismatch' | 'uncheck'>) => void;
  };
};

const CircularIconBadge = ({ 
  type, 
  size = 'md', 
  weight = 'normal', 
  className, 
  onClick, 
  clickable = false,
  stepData 
}: CircularIconBadgeProps) => {
  
  // ===== 아이콘 관련 함수들 =====
  const getIcon = () => {
    switch (type) {
      case 'match':
      case 'match-blue':
      case 'match-light-green':
        return Check;
      case 'mismatch':
      case 'mismatch-emoji':
        return X;
      case 'unchecked':
      case 'uncheck':
      case 'unchecked-white':
        return X;
      case 'link':
        return Link;
      default:
        return X;
    }
  };

  const getIconSizeClass = () => {
    switch (size) {
      case 'xsm': return styles.iconXsm;
      case 'sm': return styles.iconSm;
      case 'md': return styles.iconMd;
      case 'lg': return styles.iconLg;
      default: return styles.iconMd;
    }
  };

  const getEmojiSizeClass = () => {
    switch (size) {
      case 'xsm': return 'w-2 h-2 text-xs';
      case 'sm': return 'w-3 h-3 text-xs';
      case 'md': return 'w-4 h-4 text-sm';
      case 'lg': return 'w-5 h-5 text-base';
      default: return 'w-4 h-4 text-sm';
    }
  };

  // ===== Step Result 업데이트 핸들러 =====
  const handleStepResultClick = async () => {
    if (!stepData?.currentKey) {
      console.log('❌ Step Result 업데이트 조건 불만족:', { hasStepData: !!stepData, hasCurrentKey: !!stepData?.currentKey });
      return;
    }

    const newDetails = { ...stepData.currentDetails };
    const currentValue = stepData.currentDetails[stepData.currentKey];
    
    try {
      // 토글: uncheck ↔ match
      if (currentValue === 'uncheck') {
        newDetails[stepData.currentKey] = 'match';
      } else if (currentValue === 'match') {
        newDetails[stepData.currentKey] = 'uncheck';
      } else {
        console.log('⚠️ 변경할 수 없는 상태:', currentValue);
        return;
      }

      // API 호출
      const stepResultsApi = (await import('@libs/api_front/stepResults.api')).default;
      const result = await stepResultsApi.createOrUpdateStepResult({
        userAddressId: stepData.userAddressId,
        stepNumber: stepData.stepNumber,
        detail: stepData.detail,
        jsonDetails: newDetails
      }, { excludeHeaders: true });
      
      console.log('✅ Step Result 업데이트 성공:', result);

      // 부모 컴포넌트에 업데이트 알림
      stepData.onStepResultUpdate?.(newDetails);
      onClick?.();
      
    } catch (error) {
      console.error('❌ Step Result 업데이트 실패:', error);
      alert('Step Result 업데이트에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // ===== 클릭 핸들러 =====
  const handleClick = () => {
    if (stepData?.currentKey) {
      handleStepResultClick();
    } else {
      onClick?.();
    }
  };

  // ===== 렌더링 =====
  const Icon = getIcon();
  
  // 이모지 뱃지 렌더링
  if (type === 'mismatch-emoji') {
    return (
      <div 
        className={clsx(
          styles.badge,
          styles[size],
          styles[type],
          className
        )}
      >
        <span className={clsx(getEmojiSizeClass(), 'leading-none flex items-center justify-center')}>
          😱
        </span>
      </div>
    );
  }

  // 일반 아이콘 뱃지 렌더링
  return (
    <div 
      className={clsx(
        styles.badge,
        styles[size],
        styles[type],
        clickable && styles.clickable,
        className
      )}
      onClick={clickable ? handleClick : undefined}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
    >
      <Icon className={clsx(getIconSizeClass(), styles[weight])} />
    </div>
  );
};

export default CircularIconBadge;
