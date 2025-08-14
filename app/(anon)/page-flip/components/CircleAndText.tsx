'use client';

import styles from '../PageFlip.module.css';

interface numAndText {
    num: number,
    text: string
}

export default function CircleAndText({ num, text }:numAndText) {
    return (
        <div className={styles['circle-and-text']}>
            <p className={styles['num-circle']}> {num} </p>
            <p className={styles['small-text']}> {text} </p>
        </div>
    )
}