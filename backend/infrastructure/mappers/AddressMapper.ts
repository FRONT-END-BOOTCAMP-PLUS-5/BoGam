import {
  AddressInfo,
  AddressLocationParams,
} from '@be/applications/places/dtos/AddressDto';
import { UserAddressInfo } from '@be/applications/places/dtos/UserAddressDto';

/**
 * Address 엔티티를 AddressInfo DTO로 변환
 */
export function mapAddressToAddressInfo(address: {
  id: number;
  latitude: number | null;
  longitude: number | null;
  legalDistrictCode: string | null;
  dong: string | null;
  ho: string | null;
  lotAddress: string | null;
  roadAddress: string | null;
}): AddressInfo {
  return {
    id: address.id,
    latitude: address.latitude || undefined,
    longitude: address.longitude || undefined,
    legalDistrictCode: address.legalDistrictCode || undefined,
    dong: address.dong || undefined,
    ho: address.ho || undefined,
    lotAddress: address.lotAddress || undefined,
    roadAddress: address.roadAddress || undefined,
  };
}

/**
 * UserAddress 엔티티를 UserAddressInfo DTO로 변환
 */
export function mapUserAddressToUserAddressInfo(userAddress: {
  id: number;
  userId: string;
  addressId: number;
  nickname: string | null;
  createdAt: Date;
}): UserAddressInfo {
  return {
    id: userAddress.id,
    userId: userAddress.userId,
    addressId: userAddress.addressId,
    nickname: userAddress.nickname || undefined,
    createdAt: userAddress.createdAt,
  };
}

/**
 * 주소 검색 조건 생성
 */
export function createAddressWhereCondition(params: AddressLocationParams) {
  return {
    latitude: params.latitude || 0,
    longitude: params.longitude || 0,
    dong: params.dong,
    ho: params.ho,
  };
}

/**
 * 주소 생성 데이터 생성
 */
export function createAddressData(params: AddressLocationParams) {
  return {
    latitude: params.latitude || 0,
    longitude: params.longitude || 0,
    legalDistrictCode: params.legalDistrictCode || '',
    dong: params.dong,
    ho: params.ho,
    lotAddress: params.lotAddress || '', // Prisma 스키마에서 필수 필드
    roadAddress: params.roadAddress || null, // 선택적 필드
  };
}
