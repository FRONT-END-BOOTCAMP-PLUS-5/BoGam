'use client';

import Link from 'next/link';
import Scene3D from './components/Scene3D';

export default function BigStepPage() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-between py-8">
      {/* 상단 제목 및 링크 */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">📚 대단계 - 단일 책</h1>
        <p className="text-lg mb-4">카메라 고정 상태</p>
        <p className="text-base mb-4">💡 <strong>책을 클릭하면 애니메이션이 재생됩니다!</strong></p>
        
        {/* 링크들 */}
        <div className="flex justify-center">
          <Link 
            href="/" 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            🏠 메인으로
          </Link>
        </div>
      </div>
      
      {/* 3D 씬 */}
      <div className="flex-1 flex items-center justify-center">
        <Scene3D className="w-72 h-72" />
      </div>
      
      {/* 하단 크레딧 정보 */}
      <div className="text-center text-sm text-gray-600 max-w-md">
        <h3 className="text-base font-bold mb-2">📄 3D 모델 크레딧</h3>
        <p className="text-center">
          This work is based on "Book" (
          <a 
            href="https://sketchfab.com/3d-models/book-616e0dd72bf04503a350d774f48a6e6c" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            https://sketchfab.com/3d-models/book-616e0dd72bf04503a350d774f48a6e6c
          </a>)
        </p>
      </div>
    </div>
  );
}
