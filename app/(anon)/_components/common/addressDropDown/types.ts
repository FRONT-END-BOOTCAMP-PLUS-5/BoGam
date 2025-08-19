import { UserAddress } from '@/(anon)/main/_components/types/mainPage.types';

export interface AddressItem {
  id: string;
  address: string;
  isFavorite: boolean;
  isExpanded?: boolean;
  isActive?: boolean;
}

export interface AddressDropDownProps {
  title?: string;
  addresses?: UserAddress[]; // UserAddress 타입으로 변경
  selectedAddress?: UserAddress | null;
  onDelete?: (id: number) => void; // number로 변경
  onToggleFavorite?: (id: number) => void; // number로 변경
  onSelect?: (id: number) => void; // number로 변경
  showFavoriteToggle?: boolean;
  showDeleteButton?: boolean;
  maxHeight?: string;
  placeholder?: string;
  className?: string;
}
