'use client';

import { generalPageStyles } from './generalPage.style';
import { useRouter } from 'next/navigation';

interface pageType {
    title: string,
    category: string,
    content: string,
    pageIdx: number,
    stepNumber: string
}

export default function GeneralPage({ title, category, content, pageIdx, stepNumber }: pageType) {
    const router = useRouter();

    const handleClick = async () => {
        try {
            // URL에서 step-number와 detail 파라미터 추출
            const urlParams = new URLSearchParams(window.location.search);
            const step = urlParams.get('step-number') || stepNumber;
            const detail = urlParams.get('detail') || pageIdx.toString();
            
            // 프로그래밍 라우팅 플래그와 타임스탬프 설정
            sessionStorage.setItem('programmatic-navigation', 'true');
            sessionStorage.setItem('navigation-timestamp', Date.now().toString());

            // 페이지 이동 없이 URL만 변경 (슬롯만 표시)
            const newUrl = `/steps/${step}/${detail}`;
            window.history.pushState({}, '', newUrl);

            // Next.js router의 pathname 업데이트를 위해 강제로 리렌더링 트리거
            window.dispatchEvent(new PopStateEvent('popstate'));
        } catch (error) {
            console.error('파라미터 추출 중 오류:', error);
            // 오류 발생 시 기본값으로 이동
            router.push(`/steps/${stepNumber}/${pageIdx}`);
        }
    };

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
