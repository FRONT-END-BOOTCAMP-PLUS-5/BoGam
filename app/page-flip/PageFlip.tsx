"use client";

import { useState } from "react";
import styles from "./PageFlip.module.css";

const PageFlip = () => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flippingPageIndex, setFlippingPageIndex] = useState<number | null>(null);
  const [flippingDirection, setFlippingDirection] = useState<'next' | 'prev' | null>(null);

  const defaultPages = [
    <div className={styles['page-div']} id={styles['first-page-div']}>
      <h2 className={styles['page-h2']}>페이지 1</h2>
      <p className={styles['page-p']}>첫 번째 페이지 내용입니다.</p>
    </div>,
    <div className={styles['page-div']} id={styles['second-page-div']}>
      <h2 className={styles['page-h2']}>페이지 2</h2>
      <p className={styles['page-p']}>두 번째 페이지 내용입니다.</p>
    </div>,
    <div className={styles['page-div']} id={styles['third-page-div']}>
      <h2 className={styles['page-h2']}>페이지 3</h2>
      <p className={styles['page-p']}>세 번째 페이지 내용입니다.</p>
    </div>,
    <div className={styles['page-div']} id={styles['fourth-page-div']}>
      <h2 className={styles['page-h2']}>페이지 4</h2>
      <p className={styles['page-p']}>네 번째 페이지 내용입니다.</p>
    </div>,
    <div className={styles['page-div']} id={styles['fifth-page-div']}>
      <h2 className={styles['page-h2']}>페이지 5</h2>
      <p className={styles['page-p']}>다섯 번째 페이지 내용입니다.</p>
    </div>
  ];

  const triggerPageFlip = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setFlippingDirection('next');
    setFlippingPageIndex(currentPageIndex);
    setTimeout(() => {
      setCurrentPageIndex((prev) => (prev + 1) % defaultPages.length);
      setFlippingPageIndex(null);
      setIsFlipping(false);
      setFlippingDirection(null);
    }, 1500);
  };


  const handleNextPage = () => {
    if (isFlipping) return;
    triggerPageFlip();
  };

  const handlePrevPage = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setFlippingDirection('prev');
    setFlippingPageIndex((currentPageIndex - 1 + defaultPages.length) % defaultPages.length);
    setTimeout(() => {
      setCurrentPageIndex((prev) => (prev - 1 + defaultPages.length) % defaultPages.length);
      setFlippingPageIndex(null);
      setIsFlipping(false);
      setFlippingDirection(null);
    }, 1500);
  };

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.book}>
          <div className={styles.pageContainer}>
            <div className={`${styles.page} ${styles.nextPage}`}>
              <div className={styles.pageContent}>
                {flippingDirection === 'prev' && isFlipping
                  ? defaultPages[(currentPageIndex - 1 + defaultPages.length) % defaultPages.length]
                  : defaultPages[(currentPageIndex + 1) % defaultPages.length]}
              </div>
            </div>
            <div
              className={
                `${styles.page} ${styles.currentPage} ` +
                (flippingPageIndex === currentPageIndex && flippingDirection === 'next'
                  ? styles.flippingPage + ' animating-next'
                  : '') +
                (flippingPageIndex !== null && flippingDirection === 'prev' && flippingPageIndex === (currentPageIndex - 1 + defaultPages.length) % defaultPages.length
                  ? styles.flippingPage + ' animating-prev'
                  : '')
              }
            >
              <div className={styles.pageContent}>
                {defaultPages[currentPageIndex]}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.controls}>
        <button
          onClick={handlePrevPage}
          className={styles.controlButton}
          disabled={isFlipping || currentPageIndex === 0}
        >
          이전
        </button>
        <span className={styles.pageIndicator}>
          {currentPageIndex + 1} / {defaultPages.length}
        </span>
        <button
          onClick={handleNextPage}
          className={styles.controlButton}
          disabled={isFlipping || currentPageIndex === defaultPages.length - 1}
        >
          다음
        </button>
      </div>
    </div>
  );
}

export default PageFlip;