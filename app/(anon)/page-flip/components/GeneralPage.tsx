'use client';

import styles from '../PageFlip.module.css';

interface pageType {
    title: string,
    category: string,
    content: string
}

export default function GeneralPage({ title, category, content }: pageType) {
    return (
        <div className={`${styles['general-white-page']}`}>
            <div>
                <div className={styles['small-font-div']}>
                    <h3 className={styles['small-font']}> {title} </h3>
                </div>
                <div className={styles['border-bottom-div']}>
                    <h5 className={styles.danger}> {category} </h5>
                    <p className={styles.content}>
                        {content}
                    </p>
                </div>
                <div className={styles['go-inside-div']}>
                    <button className={styles['go-inside']}> 바로가기 </button>
                </div>
            </div>
        </div>
    )
}