'use client';

import { pageStyles } from '../pageStyles';

interface pageType {
    title: string,
    category: string,
    content: string
}

export default function GeneralPage({ title, category, content }: pageType) {
    return (
    <div className={pageStyles.generalWhitePage}>
            <div>
                <div className={pageStyles.smallFontDiv}>
                    <h3 className={pageStyles.smallFont}> {title} </h3>
                </div>
                <div className={pageStyles.borderBottomDiv}>
                    <h5 className={pageStyles.danger}> {category} </h5>
                    <p className={pageStyles.content}>
                        {content}
                    </p>
                </div>
                <div className={pageStyles.goInsideDiv}>
                    <button className={pageStyles.goInside}> 바로가기 </button>
                </div>
            </div>
        </div>
    )
}