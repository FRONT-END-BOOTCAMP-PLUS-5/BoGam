export interface AddressItem {
  id: string;
  address: string;
  isFavorite: boolean;
  isExpanded?: boolean;
  isActive?: boolean;
}

export interface AddressDropDownProps {
  title?: string;
  addresses: AddressItem[];
  selectedAddress?: AddressItem;
  onDelete?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  onSelect?: (id: string) => void;
  showFavoriteToggle?: boolean;
  showDeleteButton?: boolean;
  maxHeight?: string;
  placeholder?: string;
  className?: string;
}
