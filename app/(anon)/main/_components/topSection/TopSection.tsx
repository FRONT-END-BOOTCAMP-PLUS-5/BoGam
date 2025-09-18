import React from 'react';
import { styles } from './TopSection.styles';
import { AddressDropDown } from '@/(anon)/_components/common/addressDropDown/AddressDropDown';
import { useMainPageModule } from '@/hooks/main/useMainPageModule';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import { useUserStore } from '@libs/stores/userStore';
import { UserRound } from 'lucide-react';

export const TopSection = () => {
  const { userAddresses } = useMainPageModule();
  const { selectAddress } = useUserAddressStore();
  const { nickname } = useUserStore();

  // 주소 선택 핸들러
  const handleAddressSelect = (id: number) => {
    // 빈 주소 항목 선택 시 (id가 -1인 경우)
    if (id === -1) {
      // 선택된 주소를 초기화
      return;
    }

    const selectedAddress = userAddresses.find((addr) => addr.id === id);
    if (selectedAddress) {
      selectAddress(selectedAddress);
    } else {
      console.error('📍 TopSection - 주소를 찾을 수 없음:', id, userAddresses);
    }
  };

  return (
    <div className={styles.topSection}>
      <div className={styles.userInfo}>
        <UserRound className={styles.userIcon} />
        <span className={styles.userName}>
          <span className={styles.nickname}>{nickname || '사용자'}</span>
          <span className={styles.nim}> 님</span>
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
