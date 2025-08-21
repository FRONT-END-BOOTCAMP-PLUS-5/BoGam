'use client';

import { generalPageStyles } from './generalPage.style';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface pageType {
    title: string,
    category: string,
    content: string,
    pageIdx: number,
    stepNumber: string
}

export default function GeneralPage({ title, category, content, pageIdx, stepNumber }: pageType) {
    const router = useRouter();
    const [stepNum, setStepNum] = useState<string>('');

    const handleClick = async () => {
        setStepNum(stepNumber);

        const newUrl = `/steps/${stepNumber}/${pageIdx}`;
        
        sessionStorage.setItem('programmatic-navigation', 'true');
        sessionStorage.setItem('navigation-timestamp', Date.now().toString());
        window.dispatchEvent(new PopStateEvent('popstate'));
        
        router.push(newUrl);
    }

    return (
        <div className={generalPageStyles.generalWhitePage}>
            <div>
                <div className={generalPageStyles.smallFontDiv}>
                    <h3 className={generalPageStyles.smallFont}> {title} </h3>
                </div>
                <div className={generalPageStyles.borderBottomDiv}>
                    <h5 className={generalPageStyles.danger}> {category} </h5>
                    <p className={generalPageStyles.content} style={{ whiteSpace: 'pre-line' }}>
                        {content}
                    </p>
                </div>
                <div className={generalPageStyles.goInsideDiv}>
                    <button className={generalPageStyles.goInside} onClick={handleClick}> 바로가기 </button>
                </div>
            </div>
        </div>
    )
}