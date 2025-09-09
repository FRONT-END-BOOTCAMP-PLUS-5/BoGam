'use client';

import { useToastStore } from '@libs/stores/toastStore';
import Button from '@/(anon)/_components/common/button/Button';

export default function ToastTest() {
  const { showSuccess, showError, showWarning, showInfo } = useToastStore();

  return (
    <div className='p-4 space-y-4'>
      <h2 className='text-xl font-bold'>Toast 테스트</h2>
      <div className='flex flex-wrap gap-2'>
        <Button
          variant='primary'
          onClick={() => showSuccess('주소가 성공적으로 저장되었습니다!')}
        >
          성공 Toast
        </Button>
        <Button
          variant='secondary'
          onClick={() => showError('주소 저장 중 오류가 발생했습니다.')}
        >
          에러 Toast
        </Button>
        <Button
          variant='secondary'
          onClick={() => showWarning('저장할 주소가 선택되지 않았습니다.')}
        >
          경고 Toast
        </Button>
        <Button
          variant='secondary'
          onClick={() => showInfo('주소 정보가 업데이트되었습니다!')}
        >
          정보 Toast
        </Button>
      </div>
    </div>
  );
}
