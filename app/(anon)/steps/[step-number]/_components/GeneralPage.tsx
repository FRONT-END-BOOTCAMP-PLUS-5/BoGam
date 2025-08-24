'use client';

import { GeneralPageStyles } from './GeneralPage.styles';
import { useRouter } from 'next/navigation';
import { useState, RefObject } from 'react';

interface pageType {
  title: string;
  category: string;
  content: string;
  pageIdx: number;
  stepNumber: string;
  bookRef?: RefObject<any>;
}

export default function GeneralPage({ title, category, content, pageIdx, stepNumber, bookRef }: pageType) {
  const router = useRouter();
  const [stepNum, setStepNum] = useState<string>('');

  const handleClick = async () => {
    setStepNum(stepNumber);

    const newUrl = `/steps/${stepNumber}/${pageIdx}`;
    
    sessionStorage.setItem('programmatic-navigation', 'true');
    sessionStorage.setItem('navigation-timestamp', Date.now().toString());
    window.dispatchEvent(new PopStateEvent('popstate'));
    
    router.push(newUrl);
  };

  const handleRightCornerClick = () => {
    if (bookRef && bookRef.current) {
      const flipMethod = findFlipMethod(bookRef.current);
      if (flipMethod) {
        try {
          const nextPage = (pageIdx + 1) * 2; 
          flipMethod(nextPage);
        } catch (error) {
          console.error('Error flipping to next page:', error);
        }
      }
    }
  };

  const findFlipMethod = (obj: any, depth = 0): any => {
    if (depth > 3) return null; 
    if (!obj || typeof obj !== 'object') return null;
    
    const keys = Object.keys(obj);
    
    for (const key of keys) {
      const value = obj[key];
      
      if (typeof value === 'function' && (key.includes('flip') || key.includes('page') || key.includes('go'))) {
        return value;
      }
      
      if (typeof value === 'object' && value !== null) {
        const found = findFlipMethod(value, depth + 1);
        if (found) return found;
      }
    }
    return null;
  };

  return (
    <div className={GeneralPageStyles.generalWhitePage}>
      <div>
        <div className={GeneralPageStyles.smallFontDiv}>
          <h3 className={GeneralPageStyles.smallFont}> {title} </h3>
        </div>
        <div className={GeneralPageStyles.borderBottomDiv}>
          <h5 className={GeneralPageStyles.danger}> {category} </h5>
          <p
            className={GeneralPageStyles.content}
            style={{ whiteSpace: 'pre-line' }}
          >
            {content}
          </p>
        </div>
        <div className={GeneralPageStyles.goInsideDiv}>
          <button className={GeneralPageStyles.goInside} onClick={handleClick}>
            {' '}
            바로가기{' '}
          </button>
        </div>
      </div>
      
      <div 
        className="absolute right-0 top-0 w-[15%] h-full cursor-pointer z-10"
        onClick={handleRightCornerClick}
        title="다음 페이지로 이동"
      />
    </div>
  );
}
