'use client';

import { useState } from 'react';
import { ConfirmModal } from '@/(anon)/_components/common/modal/ConfirmModal';
import Button from '@/(anon)/_components/common/button/Button';
import Field from '@/(anon)/_components/common/forms/Field';
import TextInput from '@/(anon)/_components/common/forms/TextInput';

export default function ModalChildrenTestPage() {
  const [result, setResult] = useState<string>('');
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: '',
    isLoading: false,
  });

  // 에러 모달 상태
  const [errorModal, setErrorModal] = useState({
    isOpen: false,
    errorMessage: '',
    errorDetails: '',
  });

  // 모달 열기 함수들
  const openSimpleModal = () => {
    setModalState({ isOpen: true, type: 'simple', isLoading: false });
  };

  const openInputModal = () => {
    setModalState({ isOpen: true, type: 'input', isLoading: false });
  };

  const openComplexModal = () => {
    setModalState({ isOpen: true, type: 'complex', isLoading: false });
  };

  const openEmptyModal = () => {
    setModalState({ isOpen: true, type: 'empty', isLoading: false });
  };

  // 에러 발생 시뮬레이션 (페이지에서 직접 에러 발생)
  const simulateApiError = async () => {
    try {
      setResult('API 호출 중...');

      // API 호출 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // 의도적으로 에러 발생
      throw new Error(
        '서버에서 응답하지 않습니다. (500 Internal Server Error)'
      );
    } catch (error) {
      // 에러 발생 시 에러 모달 띄우기
      const errorMessage =
        error instanceof Error
          ? error.message
          : '알 수 없는 오류가 발생했습니다.';
      setErrorModal({
        isOpen: true,
        errorMessage: 'API 호출 실패',
        errorDetails: errorMessage,
      });
      setResult('❌ API 호출 실패');
    }
  };

  const simulateNetworkError = async () => {
    try {
      setResult('네트워크 연결 확인 중...');

      await new Promise((resolve) => setTimeout(resolve, 1000));

      throw new Error(
        '네트워크 연결을 확인할 수 없습니다. 인터넷 연결 상태를 확인해주세요.'
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '네트워크 오류';
      setErrorModal({
        isOpen: true,
        errorMessage: '네트워크 연결 오류',
        errorDetails: errorMessage,
      });
      setResult('❌ 네트워크 연결 실패');
    }
  };

  const simulateValidationError = async () => {
    try {
      setResult('데이터 검증 중...');

      await new Promise((resolve) => setTimeout(resolve, 800));

      throw new Error(
        '입력된 데이터가 올바르지 않습니다.\n- 이메일 형식이 잘못되었습니다.\n- 비밀번호는 8자 이상이어야 합니다.\n- 필수 항목이 누락되었습니다.'
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '검증 오류';
      setErrorModal({
        isOpen: true,
        errorMessage: '데이터 검증 실패',
        errorDetails: errorMessage,
      });
      setResult('❌ 데이터 검증 실패');
    }
  };

  // 모달 닫기
  const closeModal = () => {
    setModalState({ isOpen: false, type: '', isLoading: false });
  };

  // 에러 모달 닫기
  const closeErrorModal = () => {
    setErrorModal({
      isOpen: false,
      errorMessage: '',
      errorDetails: '',
    });
  };

  // 확인 처리
  const handleConfirm = async () => {
    try {
      setModalState((prev) => ({ ...prev, isLoading: true }));

      // 시뮬레이션 딜레이
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setResult(
        `✅ ${
          modalState.type
        } 모달에서 확인을 눌렀습니다. (${new Date().toLocaleTimeString()})`
      );
      closeModal();
    } catch (error) {
      // 혹시 모를 에러 처리
      setModalState((prev) => ({ ...prev, isLoading: false }));
      setResult(
        `❌ 에러 발생: ${
          error instanceof Error ? error.message : '알 수 없는 오류'
        }`
      );
    }
  };

  // 에러 시뮬레이션 (복잡한 모달용)
  const handleErrorConfirm = async () => {
    try {
      setModalState((prev) => ({ ...prev, isLoading: true }));

      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 의도적으로 에러 발생
      throw new Error('테스트 에러가 발생했습니다!');
    } catch (error) {
      // 에러 처리: 로딩 해제하고 에러 메시지 표시
      setModalState((prev) => ({ ...prev, isLoading: false }));
      setResult(
        `❌ 에러 발생: ${
          error instanceof Error ? error.message : '알 수 없는 오류'
        }`
      );
      // 모달은 열어두어서 사용자가 다시 시도하거나 취소할 수 있게 함
    }
  };

  // 에러 처리 전용 테스트
  const handleErrorTestConfirm = async () => {
    try {
      setModalState((prev) => ({ ...prev, isLoading: true }));

      await new Promise((resolve) => setTimeout(resolve, 800));

      // 다양한 에러 시나리오 랜덤 선택
      const errorTypes = [
        '네트워크 연결 오류가 발생했습니다.',
        '서버에서 응답하지 않습니다.',
        '권한이 없습니다.',
        '잘못된 요청입니다.',
        '데이터베이스 연결 실패',
      ];

      const randomError =
        errorTypes[Math.floor(Math.random() * errorTypes.length)];
      throw new Error(randomError);
    } catch (error) {
      // 에러 처리: 로딩 해제하고 에러 메시지 표시
      setModalState((prev) => ({ ...prev, isLoading: false }));
      setResult(
        `🚨 에러 테스트 결과: ${
          error instanceof Error ? error.message : '알 수 없는 오류'
        } (${new Date().toLocaleTimeString()})`
      );
      // 모달은 열어두어서 사용자가 에러를 확인하고 재시도하거나 취소할 수 있게 함
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-2xl mx-auto px-4'>
        <h1 className='text-3xl font-bold text-center mb-8 text-brand-black'>
          모달 Children 테스트
        </h1>

        <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
          <h2 className='text-xl font-semibold mb-4 text-brand-black'>
            일반 모달 테스트
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
            <Button onClick={openSimpleModal} variant='primary'>
              간단한 텍스트 모달
            </Button>

            <Button onClick={openInputModal} variant='primary'>
              입력 필드 모달
            </Button>

            <Button onClick={openComplexModal} variant='secondary'>
              복잡한 컴포넌트 모달
            </Button>

            <Button onClick={openEmptyModal} variant='ghost'>
              빈 모달 (버튼만)
            </Button>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
          <h2 className='text-xl font-semibold mb-4 text-brand-black'>
            🚨 에러 모달 테스트
          </h2>
          <p className='text-sm text-brand-dark-gray mb-4'>
            아래 버튼들을 클릭하면 다양한 에러 상황을 시뮬레이션하고, 에러 발생
            시 에러 전용 모달이 표시됩니다.
          </p>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
            <Button onClick={simulateApiError} variant='secondary'>
              API 호출 에러
            </Button>

            <Button onClick={simulateNetworkError} variant='secondary'>
              네트워크 에러
            </Button>

            <Button onClick={simulateValidationError} variant='secondary'>
              데이터 검증 에러
            </Button>
          </div>

          {result && (
            <div className='bg-brand-light-blue/20 border border-brand-light-blue rounded-lg p-4'>
              <h3 className='font-semibold text-brand-black mb-2'>결과:</h3>
              <p className='text-sm text-brand-dark-gray'>{result}</p>
            </div>
          )}
        </div>

        <div className='bg-white rounded-lg shadow-md p-6'>
          <h2 className='text-xl font-semibold mb-4 text-brand-black'>
            새로운 Children 방식의 장점
          </h2>

          <div className='space-y-4 text-sm text-brand-dark-gray'>
            <div>
              <h3 className='font-semibold text-brand-black'>
                ✅ 완전한 자유도:
              </h3>
              <p>어떤 컴포넌트든 children으로 전달 가능</p>
            </div>

            <div>
              <h3 className='font-semibold text-brand-black'>
                ✅ React 표준 패턴:
              </h3>
              <p>익숙한 React children 패턴 사용</p>
            </div>

            <div>
              <h3 className='font-semibold text-brand-black'>
                ✅ 조건부 렌더링:
              </h3>
              <p>children이 없으면 content 영역이 자동으로 숨겨짐</p>
            </div>

            <div>
              <h3 className='font-semibold text-brand-black'>
                ✅ 타입 안정성:
              </h3>
              <p>TypeScript에서 완벽한 타입 체크</p>
            </div>
          </div>
        </div>
      </div>

      {/* 간단한 텍스트 모달 */}
      <ConfirmModal
        isOpen={modalState.isOpen && modalState.type === 'simple'}
        title='간단한 확인'
        onConfirm={handleConfirm}
        onCancel={closeModal}
        isLoading={modalState.isLoading}
        icon='info'
      >
        <p>이것은 간단한 텍스트 모달입니다.</p>
        <p className='mt-2 text-brand-dark-gray text-sm'>
          children으로 전달된 내용이 표시됩니다.
        </p>
      </ConfirmModal>

      {/* 입력 필드 모달 */}
      <ConfirmModal
        isOpen={modalState.isOpen && modalState.type === 'input'}
        title='사용자 정보 입력'
        onConfirm={handleConfirm}
        onCancel={closeModal}
        isLoading={modalState.isLoading}
        icon='info'
      >
        <div className='space-y-4'>
          <Field id='name' label='이름'>
            <TextInput
              id='name'
              placeholder='이름을 입력하세요'
              disabled={modalState.isLoading}
            />
          </Field>

          <Field id='email' label='이메일'>
            <TextInput
              id='email'
              type='email'
              placeholder='example@email.com'
              disabled={modalState.isLoading}
            />
          </Field>

          <Field id='phone' label='전화번호'>
            <TextInput
              id='phone'
              type='tel'
              placeholder='010-1234-5678'
              disabled={modalState.isLoading}
            />
          </Field>
        </div>
      </ConfirmModal>

      {/* 복잡한 컴포넌트 모달 */}
      <ConfirmModal
        isOpen={modalState.isOpen && modalState.type === 'complex'}
        title='복잡한 컴포넌트'
        onConfirm={handleErrorConfirm}
        onCancel={closeModal}
        isLoading={modalState.isLoading}
        icon='warning'
      >
        <div className='space-y-4'>
          <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
            <h4 className='font-semibold text-yellow-800 mb-2'>⚠️ 주의사항</h4>
            <p className='text-yellow-700 text-sm'>
              이 작업은 되돌릴 수 없습니다. 신중하게 결정해주세요.
            </p>
          </div>

          <div className='flex items-center space-x-2'>
            <input type='checkbox' id='agree' className='rounded' />
            <label htmlFor='agree' className='text-sm text-brand-dark-gray'>
              위 내용을 확인했으며 동의합니다.
            </label>
          </div>

          <div className='bg-red-50 border border-red-200 rounded-lg p-3'>
            <p className='text-red-700 text-xs'>
              * 이 모달은 의도적으로 에러를 발생시킵니다.
            </p>
          </div>
        </div>
      </ConfirmModal>

      {/* 빈 모달 (버튼만) */}
      <ConfirmModal
        isOpen={modalState.isOpen && modalState.type === 'empty'}
        title='알림'
        onConfirm={handleConfirm}
        onCancel={closeModal}
        isLoading={modalState.isLoading}
        icon='success'
        confirmText='확인'
      >
        {/* children이 없으면 content 영역이 렌더링되지 않음 */}
      </ConfirmModal>

      {/* 에러 처리 테스트 모달 */}
      <ConfirmModal
        isOpen={modalState.isOpen && modalState.type === 'error-test'}
        title='에러 처리 테스트'
        onConfirm={handleErrorTestConfirm}
        onCancel={closeModal}
        isLoading={modalState.isLoading}
        icon='error'
        confirmText='에러 발생시키기'
        cancelText='취소'
      >
        <div className='space-y-4'>
          <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
            <h4 className='font-semibold text-red-800 mb-2'>🚨 에러 테스트</h4>
            <p className='text-red-700 text-sm mb-2'>
              이 버튼을 클릭하면 랜덤한 에러가 발생합니다.
            </p>
            <p className='text-red-600 text-xs'>
              에러 발생 시 모달은 열린 상태로 유지되며, 하단 결과 영역에 에러
              메시지가 표시됩니다.
            </p>
          </div>

          <div className='bg-blue-50 border border-blue-200 rounded-lg p-3'>
            <h5 className='font-semibold text-blue-800 text-sm mb-1'>
              💡 테스트 시나리오:
            </h5>
            <ul className='text-blue-700 text-xs space-y-1'>
              <li>• 네트워크 연결 오류</li>
              <li>• 서버 응답 없음</li>
              <li>• 권한 오류</li>
              <li>• 잘못된 요청</li>
              <li>• 데이터베이스 연결 실패</li>
            </ul>
          </div>

          <div className='bg-gray-50 border border-gray-200 rounded-lg p-3'>
            <p className='text-gray-600 text-xs'>
              <strong>현재 에러 처리 방식:</strong>
              <br />
              1. 에러 발생 → 로딩 해제
              <br />
              2. 에러 메시지를 결과 영역에 표시
              <br />
              3. 모달은 열린 상태 유지 (재시도 가능)
            </p>
          </div>
        </div>
      </ConfirmModal>

      {/* 에러 전용 모달 */}
      <ConfirmModal
        isOpen={errorModal.isOpen}
        title={errorModal.errorMessage}
        onConfirm={closeErrorModal}
        onCancel={closeErrorModal}
        icon='error'
        confirmText='확인'
        cancelText='닫기'
      >
        <div className='space-y-4'>
          <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
            <h4 className='font-semibold text-red-800 mb-2'>❌ 오류 발생</h4>
            <p className='text-red-700 text-sm whitespace-pre-line'>
              {errorModal.errorDetails}
            </p>
          </div>

          <div className='bg-gray-50 border border-gray-200 rounded-lg p-3'>
            <p className='text-gray-600 text-xs'>
              <strong>발생 시간:</strong> {new Date().toLocaleString()}
              <br />
              <strong>오류 유형:</strong> {errorModal.errorMessage}
            </p>
          </div>

          <div className='bg-blue-50 border border-blue-200 rounded-lg p-3'>
            <h5 className='font-semibold text-blue-800 text-sm mb-1'>
              💡 해결 방법:
            </h5>
            <ul className='text-blue-700 text-xs space-y-1'>
              <li>• 잠시 후 다시 시도해주세요</li>
              <li>• 네트워크 연결 상태를 확인해주세요</li>
              <li>• 문제가 지속되면 관리자에게 문의하세요</li>
            </ul>
          </div>
        </div>
      </ConfirmModal>
    </div>
  );
}
