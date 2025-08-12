# 백엔드 로그인 시스템

이 프로젝트는 Clean Architecture 패턴을 사용하여 구현된 로그인 시스템입니다.

## 구조

### Domain Layer

- `entities/User.ts`: 사용자 엔티티
- `repository/UserRepository.ts`: 사용자 저장소 인터페이스

### Application Layer

- `applications/auths/dtos/LoginDtos.ts`: 로그인 관련 DTO 클래스들
- `applications/auths/usecases/LoginUseCase.ts`: 로그인 비즈니스 로직

### Infrastructure Layer

- `infrastructure/repository/UserRepository.ts`: Prisma를 사용한 사용자 저장소 구현

## API 엔드포인트

### 1. 로그인

**POST** `/api/auth/login`

**요청 본문:**

```json
{
  "username": "사용자명",
  "password": "비밀번호"
}
```

또는

```json
{
  "phoneNumber": "전화번호",
  "pinNumber": "PIN번호"
}
```

또는

```json
{
  "residentId": "주민등록번호",
  "password": "비밀번호"
}
```

**응답:**

```json
{
  "success": true,
  "message": "로그인 성공",
  "user": {
    "id": "사용자ID",
    "name": "이름",
    "nickname": "닉네임",
    "username": "사용자명",
    "phoneNumber": "전화번호"
  },
  "token": "JWT토큰"
}
```

### 2. 회원가입

**POST** `/api/auth/register`

**요청 본문:**

```json
{
  "name": "이름",
  "nickname": "닉네임",
  "username": "사용자명",
  "password": "비밀번호",
  "phoneNumber": "전화번호"
}
```

**응답:**

```json
{
  "success": true,
  "message": "회원가입 성공",
  "user": {
    "id": "사용자ID",
    "name": "이름",
    "nickname": "닉네임",
    "username": "사용자명",
    "phoneNumber": "전화번호"
  }
}
```

### 3. 토큰 검증

**POST** `/api/auth/verify`

**요청 본문:**

```json
{
  "token": "JWT토큰"
}
```

**응답:**

```json
{
  "success": true,
  "message": "토큰이 유효합니다.",
  "user": {
    "id": "사용자ID",
    "name": "이름",
    "nickname": "닉네임",
    "username": "사용자명",
    "phoneNumber": "전화번호"
  }
}
```

## 환경 변수

`.env` 파일에 다음 환경 변수를 설정하세요:

```
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
JWT_SECRET="your-secret-key"
```

## 설치 및 실행

1. 의존성 설치:

```bash
npm install bcrypt jsonwebtoken
npm install --save-dev @types/bcrypt @types/jsonwebtoken
```

2. Prisma 클라이언트 생성:

```bash
npx prisma generate
```

3. 데이터베이스 마이그레이션:

```bash
npx prisma migrate dev
```

## 보안 기능

- 비밀번호는 bcrypt로 해싱되어 저장됩니다
- JWT 토큰은 24시간 후 만료됩니다
- 사용자명, 전화번호, 주민등록번호 중복 검사
- 입력 데이터 검증

## 사용 예시

### 프론트엔드에서 로그인 요청

```javascript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: 'testuser',
    password: 'password123',
  }),
});

const result = await response.json();
if (result.success) {
  // 로그인 성공
  localStorage.setItem('token', result.token);
  console.log('사용자 정보:', result.user);
} else {
  // 로그인 실패
  console.error('로그인 실패:', result.message);
}
```
