/**
 * 중개사 복사본 생성/수정 요청 DTO
 */
export interface CreateBrokerCopyRequestDto {
  userAddressid: number;
  brokerJson: {
    [key: string]: unknown;
  };
}
