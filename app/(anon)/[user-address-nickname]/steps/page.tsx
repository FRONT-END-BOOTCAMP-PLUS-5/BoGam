'use client';

import { useState } from 'react';
import BookLayout from './_components/BookLayout';

export default function Steps() {
  const [isAllBooksLoaded, setIsAllBooksLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const handleBookClick = (bookId: number) => {
    console.log(`📚 ${bookId}단계 클릭됨!`);
  };

  const handleAllBooksLoaded = () => {
    setIsAllBooksLoaded(true);
  };

  const handleLoadingProgress = (progress: number) => {
    setLoadingProgress(progress);
  };

  return (
    <div className="w-full min-h-screen bg-transparent">
      {/* header */}

      {/* 메인 콘텐츠 */}
      <div className="p-4">
        <BookLayout 
          onBookClick={handleBookClick} 
          onAllBooksLoaded={handleAllBooksLoaded}
          onLoadingProgress={handleLoadingProgress}
        />
      </div>

      {/* 로딩 오버레이 */}
      {!isAllBooksLoaded && (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="mb-6">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">책을 불러오는 중...</h2>
              <p className="text-gray-600 mb-4">3D 모델과 텍스처를 준비하고 있습니다</p>
              
              {/* 진행률 바 */}
              <div className="w-64 bg-gray-200 rounded-full h-3 mx-auto mb-2">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${(loadingProgress / 7) * 100}%` }}
                ></div>
              </div>
              
              {/* 진행률 텍스트 */}
              <p className="text-sm text-gray-500">{loadingProgress}/7 완료</p>
            </div>
          </div>
        </div>
      )}

      {/* footer */}
    </div>
  );
}
