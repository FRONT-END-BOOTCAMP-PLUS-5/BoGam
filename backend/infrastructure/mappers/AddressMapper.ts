import {
  AddressInfo,
  AddressLocationParams,
} from '@be/applications/users/dtos/AddressDto';
import { UserAddressInfo } from '@be/applications/users/dtos/UserAddressDto';

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
    lotAddress: address.lotAddress || '',
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
  nickname: string;
  createdAt: Date;
  isPrimary: boolean;
  address: {
    id: number;
    latitude: number | null;
    longitude: number | null;
    legalDistrictCode: string | null;
    dong: string | null;
    ho: string | null;
    lotAddress: string | null;
    roadAddress: string | null;
  };
}): UserAddressInfo {
  return {
    id: userAddress.id,
    userId: userAddress.userId,
    addressId: userAddress.addressId,
    nickname: userAddress.nickname,
    createdAt: userAddress.createdAt,
    isPrimary: userAddress.isPrimary,
    address: {
      id: userAddress.address.id,
      latitude: userAddress.address.latitude || undefined,
      longitude: userAddress.address.longitude || undefined,
      legalDistrictCode: userAddress.address.legalDistrictCode || undefined,
      dong: userAddress.address.dong || undefined,
      ho: userAddress.address.ho || undefined,
      lotAddress: userAddress.address.lotAddress || '',
      roadAddress: userAddress.address.roadAddress || undefined,
    },
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
