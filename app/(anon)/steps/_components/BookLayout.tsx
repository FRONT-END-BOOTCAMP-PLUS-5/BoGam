'use client';

import { useState, useEffect } from 'react';
import BookCanvas from './BookCanvas';
import { styles, getTextBoxClass } from './BookLayout.styles';
import { stepSummaries } from './stepSummaries';

interface BookLayoutProps {
  onAllBooksLoaded?: () => void;
  onLoadingProgress?: (progress: number) => void;
}

export default function BookLayout({ onAllBooksLoaded, onLoadingProgress }: BookLayoutProps) {
  const [loadedBooks, setLoadedBooks] = useState<Set<number>>(new Set());
  const [ , setIsAllBooksLoaded] = useState(false);

  // 7개 책 데이터 정의 - stepSummaries에서 가져오기
  const books = stepSummaries;

  // 책 로딩 완료 핸들러
  const handleBookLoad = (bookId: number) => {
    setLoadedBooks(prev => {
      const newSet = new Set(prev);
      newSet.add(bookId);
      return newSet;
    });
  };

  // 진행률을 상위 컴포넌트로 전달하는 useEffect
  useEffect(() => {
    if (onLoadingProgress && loadedBooks.size > 0) {
      onLoadingProgress(loadedBooks.size);
    }
  }, [loadedBooks.size, onLoadingProgress]);

  // 모든 책이 로딩되었는지 확인
  useEffect(() => {
    if (loadedBooks.size === books.length) {
      setIsAllBooksLoaded(true);
      if (onAllBooksLoaded) {
        onAllBooksLoaded();
      }
    }
  }, [loadedBooks, books.length, onAllBooksLoaded]);

  // 고정된 크기 설정
  return (
    <div className={styles.container}>
      {/* 계약전 섹션 */}
      <div className={styles.sectionLabel}>계약전</div>
      
      {/* 7개 책을 array.map으로 렌더링 */}
      <div className={styles.grid}>
        {books.slice(0, 3).map((book) => {
          const isOdd = book.id % 2 === 1;
          
          return (
            <div key={book.id} className={styles.bookItem}>
              <div className={styles.bookBox}></div>
              <BookCanvas 
                bookId={book.id}
                onLoadingComplete={() => handleBookLoad(book.id)}
              />
              <div className={getTextBoxClass(isOdd)}>
                <div className={styles.bookTitle}>{book.title}</div>
                <div className={styles.bookSubtitle}>{book.subtitle}</div>
                {book.description && (
                  <div className={styles.bookDescription}>{book.description}</div>
                )}
              </div>
            </div>
          );
        })}
        
        {/* 구분선 */}
        <div className={styles.divider}></div>
      </div>
      
      {/* 계약후 섹션 */}
      <div className={styles.sectionLabel}>계약후</div>
      
      <div className={styles.grid}>
        {books.slice(3).map((book) => {
          const isOdd = book.id % 2 === 1;
          
          return (
            <div key={book.id} className={styles.bookItem}>
              <div className={styles.bookBox}></div>
              <BookCanvas 
                bookId={book.id}
                onLoadingComplete={() => handleBookLoad(book.id)}
              />
              <div className={getTextBoxClass(isOdd)}>
                <div className={styles.bookTitle}>{book.title}</div>
                <div className={styles.bookSubtitle}>{book.subtitle}</div>
                {book.description && (
                  <div className={styles.bookDescription}>{book.description}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
