import React from 'react';
import { useSession } from 'next-auth/react';
import { UserAddress } from '@/(anon)/main/_components/types/mainPage.types';
import { styles } from './TopSection.styles';
import { AddressDropDown } from '@/(anon)/_components/common/addressDropDown';

interface TopSectionProps {
  userAddresses: UserAddress[];
  selectedAddress: UserAddress | null;
  onAddressChange: (address: UserAddress) => void;
}

export const TopSection: React.FC<TopSectionProps> = ({
  userAddresses,
  selectedAddress,
  onAddressChange,
}) => {
  const { data: session } = useSession();

  return (
    <div className={styles.topSection}>
      <div className={styles.userInfo}>
        <span className={styles.userIcon}>👤</span>
        <span className={styles.userName}>
          {session?.user?.name || '사용자'} 님
        </span>
      </div>

      <AddressDropDown
        title='과거의 집'
        addresses={userAddresses.map((addr) => ({
          id: addr.id.toString(),
          address: addr.address,
          isFavorite: addr.isPrimary || false,
        }))}
        selectedAddress={
          selectedAddress
            ? {
                id: selectedAddress.id.toString(),
                address: selectedAddress.address,
                isFavorite: selectedAddress.isPrimary || false,
              }
            : undefined
        }
        onSelect={(id) => {
          const address = userAddresses?.find(
            (addr) => addr.id.toString() === id
          );
          if (address) {
            onAddressChange(address);
          }
        }}
        onToggleFavorite={(id) => {
          // 즐겨찾기 토글 로직 (필요시 구현)
          console.log('즐겨찾기 토글:', id);
        }}
        onDelete={(id) => {
          // 삭제 로직 (필요시 구현)
          console.log('주소 삭제:', id);
        }}
        showFavoriteToggle={true}
        showDeleteButton={true}
        placeholder='주소를 선택해주세요'
      />
    </div>
  );
};
