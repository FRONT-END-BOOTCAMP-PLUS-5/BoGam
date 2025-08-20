'use client';

import { generalPageStyles } from './generalPage.style';

interface pageType {
    title: string,
    category: string,
    content: string
}

export default function GeneralPage({ title, category, content }: pageType) {
    return (
    <div className={generalPageStyles.generalWhitePage}>
            <div>
                <div className={generalPageStyles.smallFontDiv}>
                    <h3 className={generalPageStyles.smallFont}> {title} </h3>
                </div>
                <div className={generalPageStyles.borderBottomDiv}>
                    <h5 className={generalPageStyles.danger}> {category} </h5>
                    <p className={generalPageStyles.content}>
                        {content}
                    </p>
                </div>
                <div className={generalPageStyles.goInsideDiv}>
                    <button className={generalPageStyles.goInside}> 바로가기 </button>
                </div>
            </div>
        </div>
    )
}