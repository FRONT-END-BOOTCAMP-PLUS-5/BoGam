import { GuaranteeLimitCopyEntity } from '@be/domain/entities/GuaranteeLimitCopy';
import { CheckGuaranteeLimitCopyExistsResponseDto } from '@be/applications/guaranteeLimitCopies/dtos/CheckGuaranteeLimitCopyExistsResponseDto';

export interface GuaranteeLimitCopyRepository {
  findByUserAddressId(userAddressId: number): Promise<GuaranteeLimitCopyEntity | null>;
  upsertByUserAddressId(
    userAddressId: number,
    data: { guaranteeLimitData: string }
  ): Promise<GuaranteeLimitCopyEntity>;
  existsByUserAddressId(
    userAddressId: number
  ): Promise<Pick<CheckGuaranteeLimitCopyExistsResponseDto, 'exists' | 'updatedAt'>>;
}
