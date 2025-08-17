'use client';

import BookCanvas from './BookCanvas';
import { styles, getTextBoxClass } from './BookLayout.styles';

interface BookLayoutProps {
  onBookClick?: (bookId: number) => void;
}

export default function BookLayout({ onBookClick }: BookLayoutProps) {
  // 7개 책 데이터 정의 - 모든 책을 medium 크기로 고정
  const books = [
    {
      id: 1,
      title: '1단계',
      subtitle: '클릭하면 뜨는 말',
      description: '예쁜 책 파라다이스'
    },
    {
      id: 2,
      title: '2단계',
      subtitle: '두 번째 책 정보',
      description: '추가 설명 텍스트'
    },
    {
      id: 3,
      title: '3단계',
      subtitle: '세 번째 책 정보',
      description: '마지막 설명 텍스트'
    },
    {
      id: 4,
      title: '4단계',
      subtitle: '네 번째 책 정보',
      description: '관련 정보'
    },
    {
      id: 5,
      title: '5단계',
      subtitle: '다섯 번째 책 정보',
      description: '관련 정보'
    },
    {
      id: 6,
      title: '6단계',
      subtitle: '여섯 번째 책 정보',
      description: '관련 정보'
    },
    {
      id: 7,
      title: '7단계',
      subtitle: '일곱 번째 책 정보',
      description: '관련 정보'
    }
  ];

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
              <BookCanvas 
                bookId={book.id}
                onBookClick={onBookClick}
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
              <BookCanvas 
                bookId={book.id}
                onBookClick={onBookClick}
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
