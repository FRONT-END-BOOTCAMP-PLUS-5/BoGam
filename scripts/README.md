# 📚 책 모델 최적화 스크립트

## 🎯 목적
7개 책에 각각 다른 베이스컬러 텍스처를 적용하고 Draco + KTX2 압축을 자동으로 수행합니다. (normal과 metallicRoughness는 공통 사용)

## 📁 파일 구조
```
public/models/book/
├── scene.gltf          # 원본 GLTF 파일
├── textures/           # 텍스처 폴더
│   ├── book1_baseColor.png      # 책1 베이스컬러
│   ├── book2_baseColor.png      # 책2 베이스컬러
│   ├── book3_baseColor.png      # 책3 베이스컬러
│   ├── book4_baseColor.png      # 책4 베이스컬러
│   ├── book5_baseColor.png      # 책5 베이스컬러
│   ├── book6_baseColor.png      # 책6 베이스컬러
│   ├── book7_baseColor.png      # 책7 베이스컬러
│   ├── book_normal.png          # 공통 법선 맵
│   └── book_metallicRoughness.png  # 공통 금속성/거칠기
└── scene-draco-ktx.glb # 최종 최적화된 파일
```

## 🚀 실행 방법

### 방법 1: 수동 실행
#### 1. 텍스처 파일 준비
각 책마다 1개의 베이스컬러 텍스처 파일이 필요합니다:
- `book1_baseColor.png` - 책1 기본 색상
- `book2_baseColor.png` - 책2 기본 색상
- `book3_baseColor.png` - 책3 기본 색상
- `book4_baseColor.png` - 책4 기본 색상
- `book5_baseColor.png` - 책5 기본 색상
- `book6_baseColor.png` - 책6 기본 색상
- `book7_baseColor.png` - 책7 기본 색상

**공통 텍스처 파일:**
- `book_normal.png` - 모든 책이 공통으로 사용하는 법선 맵
- `book_metallicRoughness.png` - 모든 책이 공통으로 사용하는 금속성/거칠기

### 2. 스크립트 실행
```bash
cd scripts
node optimize-book-models.js
```

### 3. 결과 확인
- `public/models/books-optimized/books-draco-ktx.glb` 파일이 생성됩니다
- 이 파일을 `public/models/book/` 폴더로 복사하여 사용

### 방법 2: 빌드 시 자동 실행 (권장)
빌드 시 자동으로 3D 모델 최적화가 실행됩니다:

```bash
npm run build
```

**자동 실행 과정:**
1. `npm run check:models` - 필수 파일 및 의존성 확인
2. `npm run optimize:models` - Draco + KTX2 압축 적용
3. `npm run copy:models` - 최적화된 파일을 올바른 위치로 복사
4. `next build` - Next.js 빌드 실행

## 🔧 스크립트 동작 과정

1. **GLTF 파일 생성**: 7개 책 모델을 포함하는 새로운 GLTF 생성
2. **Draco 압축**: geometry 데이터 압축
3. **KTX2 압축**: 텍스처 데이터 압축
4. **파일 정리**: 중간 파일들 자동 삭제

## 📊 최적화 효과

- **파일 크기**: 기존 대비 70-90% 감소
- **로딩 속도**: 단일 파일로 7개 책 동시 로딩
- **메모리 효율성**: 공통 geometry 재사용
- **네트워크 효율성**: HTTP 요청 1번

## ⚠️ 주의사항

1. **텍스처 파일명**: 반드시 `book1_`, `book2_` 형식으로 명명
2. **파일 형식**: PNG 파일만 지원
3. **의존성**: `gltf-transform` 패키지 필요
4. **백업**: 실행 전 원본 파일 백업 권장

## 🛠️ 문제 해결

### gltf-transform 설치
```bash
npm install -g @gltf-transform/cli
```

### 권한 오류
```bash
# Windows
npm install -g @gltf-transform/cli --force

# macOS/Linux
sudo npm install -g @gltf-transform/cli
```

## 📝 커스터마이징

`BOOK_TEXTURES` 배열을 수정하여 책 개수나 텍스처 파일명을 변경할 수 있습니다:

```javascript
const BOOK_TEXTURES = [
  {
    name: 'custom_book',
    baseColor: 'custom_baseColor.png',
    normal: 'custom_normal.png',
    metallicRoughness: 'custom_metallicRoughness.png'
  }
  // ... 추가 책들
];
```
