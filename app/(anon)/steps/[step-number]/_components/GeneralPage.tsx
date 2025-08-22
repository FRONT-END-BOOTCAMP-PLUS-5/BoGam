'use client';

import { GeneralPageStyles } from './GeneralPage.styles';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface pageType {
  title: string;
  category: string;
  content: string;
  pageIdx: number;
  stepNumber: string;
}

export default function GeneralPage({
  title,
  category,
  content,
  pageIdx,
  stepNumber,
}: pageType) {
  const router = useRouter();
  const [, setStepNum] = useState<string>('');

  const handleClick = async () => {
    setStepNum(stepNumber);

    const newUrl = `/steps/${stepNumber}/${pageIdx}`;

    sessionStorage.setItem('programmatic-navigation', 'true');
    sessionStorage.setItem('navigation-timestamp', Date.now().toString());
    window.dispatchEvent(new PopStateEvent('popstate'));

    router.push(newUrl);
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
    </div>
  );
}
