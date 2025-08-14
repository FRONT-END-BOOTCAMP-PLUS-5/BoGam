// 책 번호에 따른 텍스처 매핑 유틸리티

export interface TextureMapping {
  bookId: string;
  texturePath: string;
  displayName: string;
}

// 책 번호별 KTX2 텍스처 매핑 정보
export const BOOK_TEXTURE_MAPPINGS: TextureMapping[] = [
  {
    bookId: 'book1',
    texturePath: '/models/book/textures_ktx2/book1_baseColor.ktx2',
    displayName: '책 1'
  },
  {
    bookId: 'book2',
    texturePath: '/models/book/textures_ktx2/book2_baseColor.ktx2',
    displayName: '책 2'
  },
  {
    bookId: 'book3',
    texturePath: '/models/book/textures_ktx2/book3_baseColor.ktx2',
    displayName: '책 3'
  },
  {
    bookId: 'book4',
    texturePath: '/models/book/textures_ktx2/book4_baseColor.ktx2',
    displayName: '책 4'
  },
  {
    bookId: 'book5',
    texturePath: '/models/book/textures_ktx2/book5_baseColor.ktx2',
    displayName: '책 5'
  },
  {
    bookId: 'book6',
    texturePath: '/models/book/textures_ktx2/book6_baseColor.ktx2',
    displayName: '책 6'
  },
  {
    bookId: 'book7',
    texturePath: '/models/book/textures_ktx2/book7_baseColor.ktx2',
    displayName: '책 7'
  }
];

/**
 * 책 ID에 따른 텍스처 경로를 반환합니다.
 * @param bookId - 책 ID (book1, book2, ...)
 * @returns 해당 책의 baseColor KTX2 텍스처 경로
 */
export function getBookTexturePath(bookId: string): string {
  const mapping = BOOK_TEXTURE_MAPPINGS.find(m => m.bookId === bookId);
  if (!mapping) {
    console.warn(`알 수 없는 책 ID: ${bookId}, 기본 텍스처 사용`);
    return '/models/book/textures_ktx2/book_baseColor.ktx2';
  }
  return mapping.texturePath;
}

/**
 * 책 ID에 따른 표시 이름을 반환합니다.
 * @param bookId - 책 ID (book1, book2, ...)
 * @returns 해당 책의 표시 이름
 */
export function getBookDisplayName(bookId: string): string {
  const mapping = BOOK_TEXTURE_MAPPINGS.find(m => m.bookId === bookId);
  return mapping ? mapping.displayName : '알 수 없는 책';
}

/**
 * 모든 책 텍스처 매핑 정보를 반환합니다.
 * @returns 모든 책의 텍스처 매핑 정보
 */
export function getAllBookTextureMappings(): TextureMapping[] {
  return [...BOOK_TEXTURE_MAPPINGS];
}

/**
 * 텍스처 경로가 유효한지 확인합니다.
 * @param texturePath - 확인할 텍스처 경로
 * @returns 유효한 텍스처 경로인지 여부
 */
export function isValidTexturePath(texturePath: string): boolean {
  return texturePath.endsWith('.ktx2') && texturePath.includes('baseColor');
}
