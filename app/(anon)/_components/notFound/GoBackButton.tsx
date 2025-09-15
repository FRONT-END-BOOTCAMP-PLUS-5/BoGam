'use client';

import { useRouter } from 'next/navigation';
import Button from '@/(anon)/_components/common/button/Button';

export default function GoBackButton() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <Button 
      onClick={handleGoBack}
      variant="primary"
    >
      이전 페이지로
    </Button>
  );
}