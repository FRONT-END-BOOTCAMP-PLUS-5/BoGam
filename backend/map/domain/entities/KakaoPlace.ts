export class KakaoPlace {
  constructor(
    public readonly name: string,
    public readonly address: string,
    public readonly longitude: string,
    public readonly latitude: string
  ) {}

  // 선택적으로 도메인 로직 추가 가능 (예: 거리 계산, 정규화 등)
  //   get location(): string {
  //     return `${this.latitude},${this.longitude}`;
  //   }
}
