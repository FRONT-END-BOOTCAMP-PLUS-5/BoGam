export const modalDragHandleStyles = {
  // 드래그 핸들
  dragHandle: 'flex justify-center py-2 cursor-grab active:cursor-grabbing',
  dragIndicator: 'w-8 h-[3px] bg-brand-dark-gray rounded-[2px]',

  // 모달 헤더
  modalHeader: 'flex justify-end p-4 pt-2',
  closeButton:
    'p-2 rounded-full text-brand-dark-gray transition-colors hover:bg-brand-light-gray',

  // 구분선
  divider: 'w-full h-[1px] bg-brand-dark-gray my-2 mx-auto',
} as const;
