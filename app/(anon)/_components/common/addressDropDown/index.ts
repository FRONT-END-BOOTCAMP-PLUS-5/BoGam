// 메인 컴포넌트 export
export { AddressDropDown } from './AddressDropDown';
export { AddressDropDownList } from './AddressDropDownList';
export { AddressDropDownItem } from './AddressDropDownItem';

// 타입 exports
export type { AddressItem, AddressDropDownProps } from './types';

// 기본 props 상수 export (필요한 경우)
export const DEFAULT_ADDRESS_DROPDOWN_PROPS = {
  title: '최근 열람',
  showFavoriteToggle: true,
  showDeleteButton: true,
  maxHeight: '300px',
  placeholder: '선택된 주소가 없습니다.',
} as const;
