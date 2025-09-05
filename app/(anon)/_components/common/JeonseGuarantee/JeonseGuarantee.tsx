'use client';

import { GetJeonseGuaranteeRequestDto } from '@libs/api_front/jeonseGuarantee.api';
import { useGetJeonseGuarantee } from '@/hooks/useJeonseGuarantee';
import JeonseGuaranteeForm from './JeonseGuaranteeForm';
import JeonseGuaranteeResult from './JeonseGuaranteeResult';
import Button from '@/(anon)/_components/common/button/Button';
import { styles } from './JeonseGuarantee.styles';

export default function JeonseGuarantee() {
  const { mutate: submitJeonseGuarantee, data: result, isPending, error } = useGetJeonseGuarantee();

  const handleSubmit = (data: GetJeonseGuaranteeRequestDto) => {
    submitJeonseGuarantee(data);
  };

  // 결과가 있거나 로딩 중이거나 에러가 있으면 결과 컴포넌트를, 없으면 폼을 보여줌
  if (result || isPending || error) {
    return (
      <div className={styles.container}>
        <JeonseGuaranteeResult 
          result={result || null} 
          isLoading={isPending} 
          error={error?.message || null} 
        />
        {/* 다시 조회하기 버튼 */}
        <div className="flex justify-center mt-6">
          <Button
            type="button"
            variant="primary"
            onClick={() => window.location.reload()}
          >
            다시 조회하기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <JeonseGuaranteeForm onSubmit={handleSubmit} />
    </div>
  );
}
