'use client';

import styles from '../PageFlip.module.css';

interface numAndText {
    title: string,
    children: React.ReactNode
}

export default function GeneralPage({ title, children }: numAndText) {
    return (
        <div className={`${styles['general-page']}`}>
            <h1 className={styles['general-page-title']}> {title} </h1>
            <div className={styles['inside-box']}>
                <div className={styles['danger-div']}>
                    <p className={styles.danger}> 위험 요소 </p>
                </div>
                <div className={styles.text}>
                    <p> {children} </p>
                </div>
                <div className={styles['go-div']}>
                    <button className={styles.go}> 바로가기 </button>
                </div>
            </div>
            <div className={styles.blue}></div>
        </div>
    )
}