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
  // Step Result 관련 props 추가
  stepData?: {
    stepNumber: number;
    detail: number;
    userAddressId: number;
    currentDetails: Record<string, 'match' | 'mismatch' | 'uncheck'>;
    currentKey?: string; // 현재 뱃지의 키 추가
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
  // 아이콘 결정
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

  const Icon = getIcon();

  // Step Result 업데이트 핸들러
  const handleStepResultClick = async () => {
    console.log('🔍 handleStepResultClick 호출됨:', { type, stepData: !!stepData });
    console.log('🔍 stepData 내용:', stepData);
    
    if (!stepData || !stepData.currentKey) {
      console.log('❌ 조건 불만족:', { hasStepData: !!stepData, hasCurrentKey: !!stepData?.currentKey });
      return;
    }
    
    // 토글 기능: uncheck ↔ match
    const newDetails = { ...stepData.currentDetails };
    
    try {
      console.log('✅ Step Result 업데이트 시작');
      console.log('🔍 currentKey:', stepData.currentKey);
      console.log('📝 기존 details:', stepData.currentDetails);
      
      // 현재 뱃지의 키를 사용하여 토글
      const currentValue = stepData.currentDetails[stepData.currentKey];
      console.log(`🔍 현재 ${stepData.currentKey}의 값:`, currentValue);
      
      // 토글: uncheck → match, match → uncheck
      if (currentValue === 'uncheck') {
        newDetails[stepData.currentKey] = 'match';
        console.log(`🔍 ${stepData.currentKey}를 match로 변경`);
      } else if (currentValue === 'match') {
        newDetails[stepData.currentKey] = 'uncheck';
        console.log(`🔍 ${stepData.currentKey}를 uncheck로 변경`);
      } else {
        console.log('⚠️ 변경할 수 없는 상태입니다:', currentValue);
        return;
      }
      
      console.log('📝 변경된 details:', newDetails);

             // API 호출 - 헤더 제외 옵션 사용 (한글 인코딩 문제 해결)
       const stepResultsApi = (await import('@libs/api_front/stepResults.api')).default;
       const result = await stepResultsApi.createOrUpdateStepResult({
         userAddressId: stepData.userAddressId,
         stepNumber: stepData.stepNumber,
         detail: stepData.detail,
         jsonDetails: newDetails
       }, { excludeHeaders: true });
      
      console.log('✅ API 호출 성공:', result);

      // 부모 컴포넌트에 업데이트 알림
      stepData.onStepResultUpdate?.(newDetails);
      
      // 기본 onClick도 실행
      onClick?.();
    } catch (error) {
      console.error('❌ Step Result 업데이트 실패:', error);
      alert('Step Result 업데이트에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 아이콘 크기 클래스 결정
  const getIconSizeClass = () => {
    switch (size) {
      case 'xsm':
        return styles.iconXsm;
      case 'sm':
        return styles.iconSm;
      case 'md':
        return styles.iconMd;
      case 'lg':
        return styles.iconLg;
      default:
        return styles.iconMd;
    }
  };

  // 이모지 크기 클래스 결정 - SVG 아이콘과 정확히 동일한 크기로 설정
  const getEmojiSizeClass = () => {
    switch (size) {
      case 'xsm':
        return 'w-2 h-2 text-xs'; // SVG iconSm과 정확히 동일한 크기
      case 'sm':
        return 'w-3 h-3 text-xs'; // SVG iconSm과 정확히 동일한 크기
      case 'md':
        return 'w-4 h-4 text-sm'; // SVG iconMd와 정확히 동일한 크기
      case 'lg':
        return 'w-5 h-5 text-base'; // SVG iconLg와 정확히 동일한 크기
      default:
        return 'w-4 h-4 text-sm';
    }
  };

  // 이모지 뱃지 렌더링 - 일반 아이콘과 완전히 동일한 방식으로 렌더링
  if (type === 'mismatch-emoji') {
    return (
      <div 
        className={clsx(
          styles.badge,
          styles[size as keyof typeof styles], // 일반 아이콘과 동일한 size 클래스 사용
          styles[type as keyof typeof styles],
          clickable && styles.clickable,
          className
        )}
        onClick={onClick}
        role={clickable ? 'button' : undefined}
        tabIndex={clickable ? 0 : undefined}
      >
        <span className={clsx(getEmojiSizeClass(), 'leading-none flex items-center justify-center')}>😱</span>
      </div>
    );
  }

  return (
    <div 
      className={clsx(
        styles.badge,
        styles[size as keyof typeof styles],
        styles[type as keyof typeof styles],
        clickable && styles.clickable,
        className
      )}
                       onClick={() => {
           console.log('🔍 onClick 이벤트 발생:', { type, hasStepData: !!stepData, stepData });
           if (stepData && stepData.currentKey) {
             console.log('✅ handleStepResultClick 호출');
             handleStepResultClick();
           } else {
             console.log('✅ 기본 onClick 호출');
             onClick?.();
           }
         }}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
    >
      <Icon className={clsx(getIconSizeClass(), styles[weight])} />
    </div>
  );
};

export default CircularIconBadge;
