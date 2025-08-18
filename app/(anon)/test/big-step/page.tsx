'use client';

import Link from 'next/link';
import Scene3D from './components/Scene3D';

export default function BigStepPage() {
  return (
    <div className="w-screen h-screen overflow-hidden">
      {/* 3D 씬 - 브라우저 전체 화면 */}
      <Scene3D className="w-full h-full" />
      
      {/* 상단 오버레이 - 절대 위치로 배치 */}
      <div className="absolute top-4 left-4 z-50 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg shadow-lg p-4 max-w-sm">
        <h1 className="text-xl font-bold mb-2">📚 대단계 - 단일 책</h1>
        <p className="text-sm mb-3">카메라 고정 상태 + 시점 이동 기능</p>
        <p className="text-xs mb-3">💡 <strong>책을 클릭하면 애니메이션이 재생됩니다!</strong></p>
        
        {/* HDR 환경맵 기능 설명 */}
        <div className="mb-3 p-2 bg-purple-50 border border-purple-200 rounded text-xs">
          <p className="font-semibold text-purple-800 mb-1">🌟 HDR 환경맵</p>
          <p className="text-purple-700">
            fireplace_4k.hdr 환경맵을 사용하여 사실적인 조명과 반사를 구현했습니다.
          </p>
        </div>
        
        {/* OrbitControls 사용법 */}
        <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded text-xs">
          <p className="font-semibold text-green-800 mb-1">🖱️ 마우스 컨트롤</p>
          <ul className="text-green-700 space-y-1">
            <li>• 좌클릭 드래그: 화면 회전</li>
            <li>• 우클릭 드래그: 화면 이동</li>
            <li>• 마우스 휠: 줌 인/아웃</li>
          </ul>
        </div>
        
        {/* 링크 */}
        <Link 
          href="/" 
          className="inline-block px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
        >
          🏠 메인으로
        </Link>
      </div>
      
      {/* 우측 상단 오버레이 - 카메라 시점 이동 기능 설명 */}
      <div className="absolute top-4 right-4 z-50 bg-blue-50 border border-blue-200 rounded-lg p-3 max-w-xs">
        <h3 className="text-sm font-semibold text-blue-800 mb-2">🎯 카메라 시점 이동 기능</h3>
        <p className="text-xs text-blue-700 mb-2">
          <strong>camera.setViewOffset()</strong>을 사용하여 카메라를 움직이지 않고도 렌즈의 중심점을 이동시킬 수 있습니다.
        </p>
        <ul className="text-xs text-blue-600 space-y-1">
          <li>• 책 클릭 시 자동으로 해당 책에 초점 맞추기</li>
          <li>• 카메라 위치는 고정된 상태로 시점만 이동</li>
          <li>• 렌즈의 중심점(Principal Point) 이동으로 구현</li>
        </ul>
      </div>
      
      {/* 하단 오버레이 - 크레딧 정보 */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg shadow-lg p-3 text-center">
        <h3 className="text-sm font-bold mb-1">📄 3D 모델 크레딧</h3>
        <p className="text-xs text-gray-600">
          This work is based on &quot;Book&quot; (
          <a 
            href="https://sketchfab.com/3d-models/book-616e0dd72bf04503a350d774f48a6e6c" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Sketchfab
          </a>)
        </p>
      </div>
    </div>
  );
}
