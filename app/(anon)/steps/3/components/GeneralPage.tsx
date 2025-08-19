'use client';

import { styles } from '../pageStyles';

interface pageType {
    title: string,
    category: string,
    content: string
}

export default function GeneralPage({ title, category, content }: pageType) {
    return (
    <div className={styles.generalWhitePage}>
            <div>
                <div className={styles.smallFontDiv}>
                    <h3 className={styles.smallFont}> {title} </h3>
                </div>
                <div className={styles.borderBottomDiv}>
                    <h5 className={styles.danger}> {category} </h5>
                    <p className={styles.content}>
                        {content}
                    </p>
                </div>
                <div className={styles.goInsideDiv}>
                    <button className={styles.goInside}> 바로가기 </button>
                </div>
            </div>
        </div>
    )
}