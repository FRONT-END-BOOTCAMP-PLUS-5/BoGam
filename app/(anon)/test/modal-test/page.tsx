'use client';

import React from 'react';
import { useModalStore } from '@libs/stores/modalStore';
import StateIcon from '../../_components/common/stateIcon/StateIcon';

export default function ModalTestPage() {
  // Zustand 방식
  const { openModal } = useModalStore();

  const handleDelete = () => {
    console.log('삭제 실행됨');
    alert('삭제되었습니다!');
  };

  const handleSuccess = () => {
    console.log('성공 처리됨');
    alert('성공적으로 처리되었습니다!');
  };

  // 에러를 발생시키는 함수들
  const handleErrorWithModalOpen = async () => {
    // 3초 후 에러 발생 (로딩 상태 확인용)
    await new Promise((resolve) => setTimeout(resolve, 3000));
    throw new Error('네트워크 연결에 실패했습니다. 다시 시도해주세요.');
  };

  const handleErrorWithModalClose = async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    throw new Error('서버 오류가 발생했습니다.');
  };

  const handleNetworkError = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    throw new Error('인터넷 연결을 확인해주세요.');
  };

  return (
    <div className='p-6 space-y-6'>
      <h1 className='text-2xl font-bold mb-6'>Zustand 모달 시스템 테스트</h1>

      {/* StateIcon 테스트 */}
      <section className='space-y-4'>
        <h2 className='text-xl font-semibold'>StateIcon 컴포넌트 테스트</h2>
        <div className='space-y-4'>
          <StateIcon completedCount={5} unconfirmedCount={2} warningCount={1} />
          <StateIcon completedCount={0} unconfirmedCount={0} warningCount={0} />
          <StateIcon
            completedCount={10}
            unconfirmedCount={3}
            warningCount={7}
          />
        </div>
      </section>

      {/* 기본 모달 */}
      <section className='space-y-4'>
        <h2 className='text-xl font-semibold'>기본 모달</h2>
        <div className='space-y-2'>
          <button
            onClick={() =>
              openModal({
                title: '주소 삭제하기',
                content: (
                  <div>
                    <p>주소를 삭제하면 검사 결과가 모두 지워집니다.</p>
                    <p className='mt-2'>저장한 주소를 정말 지우시겠습니까?</p>
                  </div>
                ),
                icon: 'warning',
                onConfirm: handleDelete,
              })
            }
            className='w-full px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors'
          >
            주소 삭제 확인
          </button>

          <button
            onClick={() =>
              openModal({
                title: '닉네임 변경하기',
                content: (
                  <div>
                    <p>새 닉네임을 입력해주세요.</p>
                    <input
                      type='text'
                      placeholder='새 닉네임'
                      className='mt-3 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                    <p className='mt-2 text-red-500 text-sm'>
                      이미 사용 중인 닉네임입니다. 다른 닉네임을 입력해주세요.
                    </p>
                  </div>
                ),
                icon: 'info',
                onConfirm: handleSuccess,
              })
            }
            className='w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'
          >
            닉네임 변경
          </button>
        </div>
      </section>

      {/* 에러 처리 테스트 */}
      <section className='space-y-4'>
        <h2 className='text-xl font-semibold'>에러 처리 테스트</h2>
        <div className='space-y-2'>
          <button
            onClick={() =>
              openModal({
                title: '데이터 저장하기',
                content: '서버에 데이터를 저장하시겠습니까?',
                icon: 'info',
                onConfirm: handleErrorWithModalOpen,
                // 기본값: closeOnError: false (에러 시 모달 열어둠)
              })
            }
            className='w-full px-4 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors'
          >
            에러 발생 (모달 열어둠) - 3초 후 에러
          </button>

          <button
            onClick={() =>
              openModal({
                title: '파일 업로드',
                content: '파일을 업로드하시겠습니까?',
                icon: 'info',
                onConfirm: handleErrorWithModalClose,
                closeOnError: true, // 에러 시 모달 닫기
              })
            }
            className='w-full px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors'
          >
            에러 발생 (모달 닫힘) - 2초 후 에러
          </button>

          <button
            onClick={() =>
              openModal({
                title: '네트워크 연결 확인',
                content: '네트워크 상태를 확인하시겠습니까?',
                icon: 'warning',
                onConfirm: handleNetworkError,
                confirmText: '확인',
                cancelText: '취소',
              })
            }
            className='w-full px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors'
          >
            네트워크 에러 - 1.5초 후 에러
          </button>
        </div>
      </section>

      {/* 성공 모달 */}
      <section className='space-y-4'>
        <h2 className='text-xl font-semibold'>성공 모달</h2>
        <div className='space-y-2'>
          <button
            onClick={() =>
              openModal({
                title: '성공',
                content: '작업이 성공적으로 완료되었습니다!',
                icon: 'success',
                confirmText: '확인',
                onConfirm: handleSuccess,
              })
            }
            className='w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors'
          >
            성공 모달
          </button>

          <button
            onClick={() =>
              openModal({
                title: '오류 발생',
                content: '작업 중 오류가 발생했습니다. 다시 시도해주세요.',
                icon: 'error',
                confirmText: '다시 시도',
                cancelText: '취소',
                onConfirm: handleSuccess,
              })
            }
            className='w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'
          >
            오류 모달
          </button>
        </div>
      </section>

      {/* 새로운 기능 설명 */}
      <section className='mt-8 p-4 bg-gray-100 rounded-lg'>
        <h2 className='text-xl font-semibold mb-4'>새로운 기능</h2>
        <div className='space-y-3 text-sm'>
          <div>
            <h3 className='font-semibold'>🚀 에러 처리 개선</h3>
            <p>• 에러 발생 시 기본적으로 모달을 열어둠</p>
            <p>• closeOnError: true 옵션으로 에러 시 모달 닫기 가능</p>
            <p>• 에러 메시지를 모달 내에서 표시</p>
          </div>
          <div>
            <h3 className='font-semibold'>⚡ 로딩 상태</h3>
            <p>• 확인 버튼 클릭 시 로딩 상태 표시</p>
            <p>• 로딩 중 중복 클릭 방지</p>
            <p>• 로딩 중 ESC 키 비활성화</p>
          </div>
          <div>
            <h3 className='font-semibold'>🎨 UX 개선</h3>
            <p>• 에러 발생 시 아이콘이 자동으로 에러 아이콘으로 변경</p>
            <p>• 에러 메시지가 빨간색 박스로 강조 표시</p>
            <p>• 로딩 중 버튼 텍스트가 처리중...으로 변경</p>
          </div>
        </div>
      </section>
    </div>
  );
}
