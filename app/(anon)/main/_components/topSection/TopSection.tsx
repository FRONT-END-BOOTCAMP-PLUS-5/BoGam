import React from 'react';
import { useSession } from 'next-auth/react';
import { styles } from './TopSection.styles';
import { AddressDropDown } from '@/(anon)/_components/common/addressDropDown/AddressDropDown';
import { useMainPageModule } from '@/hooks/main/useMainPageModule';
import { UserRound } from 'lucide-react';

export const TopSection: React.FC = () => {
  const { data: session } = useSession();
  const { userAddresses, handleAddressChangeWithTransaction } =
    useMainPageModule();

  // 주소 선택 핸들러
  const handleAddressSelect = (id: number) => {
    // 빈 주소 항목 선택 시 (id가 -1인 경우)
    if (id === -1) {
      // 선택된 주소를 초기화
      console.log('📍 TopSection - 빈 주소 항목 선택됨');
      return;
    }

    const selectedAddress = userAddresses.find((addr) => addr.id === id);
    if (selectedAddress) {
      handleAddressChangeWithTransaction(selectedAddress);
    } else {
      console.error('📍 TopSection - 주소를 찾을 수 없음:', id, userAddresses);
    }
  };

  return (
    <div className={styles.topSection}>
      <div className={styles.userInfo}>
        <UserRound className={styles.userIcon} />
        <span className={styles.userName}>
          {session?.user?.name || '사용자'} 님
        </span>
      </div>

      {/* props 전달 없이 Store에서 직접 데이터 사용 */}
      <AddressDropDown
        showFavoriteToggle={true}
        showDeleteButton={true}
        placeholder='주소를 선택해주세요'
        onSelect={handleAddressSelect}
      />
    </div>
  );
};
