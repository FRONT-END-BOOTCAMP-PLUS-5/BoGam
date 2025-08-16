'use client';

import BookLayout from './_components/BookLayout';

export default function Steps() {
  const handleBookClick = (bookId: number) => {
    console.log(`📚 ${bookId}단계 클릭됨!`);
  };

  return (
    <div className="w-full min-h-screen bg-transparent">
      {/* header */}

      {/* 메인 콘텐츠 */}
      <div className="p-4">
        <BookLayout onBookClick={handleBookClick} />
      </div>

      {/* footer */}
    </div>
  );
}
