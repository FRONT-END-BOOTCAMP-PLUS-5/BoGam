import { prisma } from '@utils/prisma';
import { AddUserAddressRepository } from '@be/domain/repository/AddUserAddressRepository';
import { UserAddressInfo } from '@be/applications/users/dtos/UserAddressDto';
import {
  AddressInfo,
  AddressLocationParams,
} from '@be/applications/users/dtos/AddressDto';
import {
  mapAddressToAddressInfo,
  mapUserAddressToUserAddressInfo,
  createAddressWhereCondition,
  createAddressData,
} from '@be/infrastructure/mappers/AddressMapper';

export class AddUserAddressRepositoryImpl implements AddUserAddressRepository {
  async findAddressByLocation(
    params: AddressLocationParams
  ): Promise<AddressInfo | null> {
    const address = await prisma.address.findFirst({
      where: createAddressWhereCondition(params),
    });

    return address ? mapAddressToAddressInfo(address) : null;
  }

  async createAddressIfNotExists(
    params: AddressLocationParams
  ): Promise<AddressInfo> {
    // 기존 주소가 있는지 확인
    const existingAddress = await prisma.address.findFirst({
      where: createAddressWhereCondition(params),
    });

    if (existingAddress) {
      return mapAddressToAddressInfo(existingAddress);
    }

    // 새 주소 생성
    const address = await prisma.address.create({
      data: createAddressData(params),
    });

    return mapAddressToAddressInfo(address);
  }

  async findUserAddressByUserIdAndAddressId(
    userId: string,
    addressId: number
  ): Promise<UserAddressInfo | null> {
    const userAddress = await prisma.userAddress.findFirst({
      where: {
        userId,
        addressId,
      },
      include: {
        address: true,
      },
    });

    return userAddress ? mapUserAddressToUserAddressInfo(userAddress) : null;
  }

  async createUserAddressIfNotExists(
    userId: string,
    addressId: number,
    addressNickname?: string
  ): Promise<{ userAddress: UserAddressInfo; isNew: boolean }> {
    // 기존 사용자 주소가 있는지 확인
    const existingUserAddress = await prisma.userAddress.findFirst({
      where: {
        userId,
        addressId,
      },
      include: {
        address: true,
      },
    });

    if (existingUserAddress) {
      return {
        userAddress: mapUserAddressToUserAddressInfo(existingUserAddress),
        isNew: false,
      };
    }

    // 자동 생성된 닉네임 생성
    const userAddressCount = await prisma.userAddress.count({
      where: { userId },
    });
    const autoNickname = `주소_${userAddressCount + 1}`;

    // 새 사용자 주소 생성 (새로 추가된 주소를 선택된 주소로 설정)
    const userAddress = await prisma.userAddress.create({
      data: {
        userId,
        addressId,
        nickname: addressNickname || autoNickname,
        isPrimary: false,
        isSelected: true, // 새로 추가된 주소를 선택된 주소로 설정
      },
      include: {
        address: true,
      },
    });

    // 기존 선택된 주소들을 모두 false로 변경 (새 주소만 true로 유지)
    await prisma.userAddress.updateMany({
      where: {
        userId,
        id: { not: userAddress.id }, // 새로 생성된 주소 제외
      },
      data: {
        isSelected: false,
      },
    });

    // 새 사용자 주소가 생성된 경우에만 stepResult 레코드들 생성
    // createMany를 사용하되 각 단계별로 다른 details 설정
    await prisma.stepResult.createMany({
      data: [
        {
          userAddressId: userAddress.id,
          stepId: 1,
          details: {
            "열람": "unchecked"
          },
        },
        {
          userAddressId: userAddress.id,
          stepId: 2,
          details: {
            "깡통주택": "unchecked"
          },
        },
        {
          userAddressId: userAddress.id,
          stepId: 3,
          details: {
            "열람": "unchecked"
          },
        },
        {
          userAddressId: userAddress.id,
          stepId: 4, // 1-4단계: 등기부등본 발급 오류 해결시 수정
          details: {},
        },
        {
          userAddressId: userAddress.id,
          stepId: 5,
          details: {
            "경매": "unchecked",
            "미납": "unchecked",
            "부도": "unchecked",
            "신탁": "unchecked",
            "압류": "unchecked",
            "체납": "unchecked",
            "취소": "unchecked",
            "파산": "unchecked",
            "해지": "unchecked",
            "가압류": "unchecked",
            "임차권": "unchecked",
            "강제집행": "unchecked",
            "근저당권": "unchecked",
            "미납 내역 없음": "unchecked",
            "서류와 임대인의 이름 일치 여부": "unchecked"
          },
        },
        {
          userAddressId: userAddress.id,
          stepId: 6,
          details: {
            "보증신청인(1)": "unchecked",
            "보증신청인(2)": "unchecked",
            "보증신청인(3)": "unchecked",
            "보증신청인(4)": "unchecked",
            "임대차계약기간": "unchecked",
            "전세보증금 금액": "unchecked",
            "전세권 설정 여부": "unchecked",
            "타세대 전입 여부": "unchecked",
            "보증신청주택 종류": "unchecked",
            "전세목적물 소유권": "unchecked",
            "역전세 반환대출 여부": "unchecked",
            "공인 중개사 계약 여부": "unchecked",
            "전세금 전액 지불 여부": "unchecked",
            "전세목적물 권리 침해 여부": "unchecked",
            "전입신고 및 확정일자 여부": "unchecked",
            "위반건축물 여부(아파트 제외)": "unchecked",
            "타 기관 보증부 전세 대출 여부": "unchecked"
          },
        },
        {
          userAddressId: userAddress.id,
          stepId: 7,
          details: {
            "owner_id_check": "unchecked",
            "registry_check": "unchecked",
            "deposit_account": "unchecked",
            "phone_confirmation": "unchecked",
            "proxy_verification": "unchecked",
            "stamp_verification": "unchecked",
            "proxy_account_agreement": "unchecked"
          },
        },
        {
          userAddressId: userAddress.id,
          stepId: 8,
          details: {
            "registry_check": "unchecked",
            "trust_register_check": "unchecked"
          },
        },
        {
          userAddressId: userAddress.id,
          stepId: 9, // 2-3단계: 등기부등본 발급 오류 해결시 수정
          details: {},
        },
        {
          userAddressId: userAddress.id,
          stepId: 10,
          details: {
            "열람": "unchecked"
          },
        },
        {
          userAddressId: userAddress.id,
          stepId: 11, // 3-1단계: 이슈 해결시 수정
          details: {},
        },
        {
          userAddressId: userAddress.id,
          stepId: 12, // 3-2단계: 이슈 해결시 수정
          details: {},
        },
        {
          userAddressId: userAddress.id,
          stepId: 13,
          details: {
            "열람": "unchecked"
          },
        },
        {
          userAddressId: userAddress.id,
          stepId: 14, // 4-1단계: 등기부등본 발급 오류 해결시 수정
          details: {},
        },
        {
          userAddressId: userAddress.id,
          stepId: 15,
          details: {
            "열람": "unchecked"
          },
        },
        {
          userAddressId: userAddress.id,
          stepId: 16,
          details: {
            "열람": "unchecked"
          },
        },
        {
          userAddressId: userAddress.id,
          stepId: 17,
          details: {
            "열람": "unchecked"
          },
        },
        {
          userAddressId: userAddress.id,
          stepId: 18,
          details: {
            "경매": "unchecked",
            "대표": "unchecked",
            "미납": "unchecked",
            "부도": "unchecked",
            "신탁": "unchecked",
            "압류": "unchecked",
            "체납": "unchecked",
            "취소": "unchecked",
            "파산": "unchecked",
            "해지": "unchecked",
            "가압류": "unchecked",
            "임차권": "unchecked",
            "강제집행": "unchecked",
            "근저당권": "unchecked",
            "등록번호": "unchecked",
            "공인중개사": "unchecked",
            "사업자 상호": "unchecked",
            "자격증 번호": "unchecked",
            "중개업자 등록": "unchecked",
            "미납 내역 없음": "unchecked",
            "체납 내역 확인": "unchecked",
            "납세상태 해당없음": "unchecked",
            "발급일자 최신성 확인": "unchecked",
            "유효기간 만료일 확인": "unchecked",
            "납세자명과 임대인 명 일치 여부": "unchecked",
            "서류와 임대인의 이름 일치 여부": "unchecked"
          },
        },
        {
          userAddressId: userAddress.id,
          stepId: 19, // 5-2단계: 등기부등본 발급 오류 해결시 수정
          details: {},
        },
        {
          userAddressId: userAddress.id,
          stepId: 20,
          details: {
            "보증신청인(1)": "unchecked",
            "보증신청인(2)": "unchecked",
            "보증신청인(3)": "unchecked",
            "보증신청인(4)": "unchecked",
            "임대차계약기간": "unchecked",
            "전세보증금 금액": "unchecked",
            "전세권 설정 여부": "unchecked",
            "타세대 전입 여부": "unchecked",
            "보증신청주택 종류": "unchecked",
            "전세목적물 소유권": "unchecked",
            "역전세 반환대출 여부": "unchecked",
            "공인 중개사 계약 여부": "unchecked",
            "전세금 전액 지불 여부": "unchecked",
            "전세목적물 권리 침해 여부": "unchecked",
            "전입신고 및 확정일자 여부": "unchecked",
            "위반건축물 여부(아파트 제외)": "unchecked",
            "타 기관 보증부 전세 대출 여부": "unchecked"
          },
        },
        {
          userAddressId: userAddress.id,
          stepId: 21,
          details: {
            "열람": "unchecked"
          },
        },
        {
          userAddressId: userAddress.id,
          stepId: 22,
          details: {
            "열람": "unchecked"
          },
        },
        {
          userAddressId: userAddress.id,
          stepId: 23,
          details: {
            "열람": "unchecked"
          },
        },
        {
          userAddressId: userAddress.id,
          stepId: 24, // 6-3단계: 등기부등본 발급 오류 해결시 수정
          details: {},
        },
        {
          userAddressId: userAddress.id,
          stepId: 25,
          details: {
            "열람": "unchecked"
          },
        },
        {
          userAddressId: userAddress.id,
          stepId: 26,
          details: {
            "이면계약 작성하지 않기": "unchecked",
            "신분증, 인감 빌려주지 않기": "unchecked",
            "적법한 계약 절차가 아니면 거절하기": "unchecked"
          },
        },
      ],
    });

    return {
      userAddress: mapUserAddressToUserAddressInfo(userAddress),
      isNew: true,
    };
  }

  // 기존 메서드들도 유지 (하위 호환성을 위해)
  async createAddress(params: AddressLocationParams): Promise<AddressInfo> {
    return this.createAddressIfNotExists(params);
  }

  async createUserAddress(
    userId: string,
    addressId: number,
    addressNickname?: string
  ): Promise<UserAddressInfo> {
    const result = await this.createUserAddressIfNotExists(
      userId,
      addressId,
      addressNickname
    );
    return result.userAddress;
  }
}
