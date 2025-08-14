// 3D 모델 파일 경로 상수
export const MODEL_PATHS = {
  // 최적화된 모델 (Draco 압축, 텍스처는 외부에서 동적 로딩)
  BOOK: '/models/book/optimized/book-draco-no-textures.glb',
  BOOKSHELF: '/models/optimized/bookshelf-draco-ktx.glb',
} as const;

// 모델 타입 정의
export type ModelType = keyof typeof MODEL_PATHS;
