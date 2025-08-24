'use client';

import { GetJeonseGuaranteeRequestDto } from '@be/applications/jeonseGuarantees/dtos/GetJeonseGuaranteeRequestDto';
import { useJeonseGuarantee } from '@/hooks/useJeonseGuarantee';
import JeonseGuaranteeForm from './JeonseGuaranteeForm';
import JeonseGuaranteeResult from './JeonseGuaranteeResult';
import { styles } from './JeonseGuarantee.styles';

export default function JeonseGuarantee() {
  const { mutate: submitJeonseGuarantee, data: result, isPending, error } = useJeonseGuarantee();

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
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="bg-brand hover:bg-brand text-brand-white font-bold py-3 px-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 transition-colors duration-200"
          >
            다시 조회하기
          </button>
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
