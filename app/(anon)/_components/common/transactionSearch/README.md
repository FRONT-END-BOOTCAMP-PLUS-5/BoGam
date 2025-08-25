# TransactionSearchComponent

실거래가를 조회하고 결과를 보여주는 공통 컴포넌트입니다.

## 🚀 주요 기능

- **주소 기반 검색**: 선택된 주소를 기반으로 실거래가 조회
- **건물 타입별 검색**: 아파트, 연립/다세대, 오피스텔 등 건물 타입 선택
- **단지명 검색**: 단지 일련번호를 통한 정확한 건물 검색
- **년도별 조회**: 2020-2025년 실거래가 데이터 조회
- **실시간 결과 표시**: 검색 결과를 카드 형태로 즉시 표시

## 📦 Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `''` | 추가 CSS 클래스 |

## 🎯 사용 예시

### 기본 사용법
```tsx
import { TransactionSearchComponent } from '@/(anon)/_components/common/transactionSearch/TransactionSearchComponent';

function MyPage() {
  return (
    <TransactionSearchComponent />
  );
}
```

### 커스텀 스타일 적용
```tsx
<TransactionSearchComponent className="my-custom-class" />
```

## 🔧 의존성

### 필수 Hook
- `useTransactionManagement`: 실거래가 데이터 관리
- `useMainPageState`: 메인 페이지 상태 관리
- `useUserAddressStore`: 사용자 주소 정보 관리

### 필수 컴포넌트
- `ConfirmModal`: 단지 검색 모달
- `DanjiSerialNumberContent`: 단지 일련번호 검색 내용
- `Button`: 버튼 컴포넌트

### 필수 유틸리티
- `parseAddressString`: 주소 문자열 파싱

## 📊 데이터 구조

### TransactionData 인터페이스
```typescript
interface TransactionData {
  id: string;
  아파트: string;
  거래금액: string;
  전용면적: string;
  층: string;
  건축년도: string;
  년: string;
  월: string;
  일: string;
  법정동: string;
  지번: string;
  location: MapLocation | null;
}
```

## 🎨 스타일링

컴포넌트는 Tailwind CSS 클래스를 사용하며, `TransactionSearchComponent.styles.ts`에서 모든 스타일을 관리합니다.

### 주요 스타일 클래스
- `transaction-search-component`: 메인 컨테이너
- `search-form`: 검색 폼 영역
- `search-results`: 검색 결과 영역
- `result-card`: 개별 결과 카드

## 🔄 동작 흐름

1. **주소 선택**: `useUserAddressStore`에서 선택된 주소 정보 가져오기
2. **주소 파싱**: 주소를 시/도, 시/군/구, 동으로 분리
3. **검색 조건 설정**: 년도, 건물 타입, 단지명 설정
4. **API 호출**: `useTransactionManagement`를 통한 실거래가 데이터 조회
5. **결과 표시**: 조회된 데이터를 카드 형태로 표시
6. **결과 표시**: 조회된 데이터를 전용면적별 평균가로 그룹화하여 표시

## ⚠️ 주의사항

- 주소가 선택되지 않은 경우 검색 버튼이 비활성화됩니다
- 단지명은 선택사항이지만, 정확한 검색을 위해 권장됩니다
- API 호출 중에는 로딩 상태가 표시됩니다
- 검색 결과는 `useTransactionDataStore`에 저장되어 다른 컴포넌트에서도 사용 가능합니다
- 매매 거래만 처리하며, 전월세 거래는 자동으로 제외됩니다
