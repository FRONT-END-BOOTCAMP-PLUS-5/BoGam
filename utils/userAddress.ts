import { prisma } from './prisma';

/**
 * userAddress 닉네임으로부터 ID를 가져오는 함수
 * @param nickname userAddress 닉네임
 * @returns userAddress ID 또는 null
 */
export async function getUserAddressIdByNickname(nickname: string): Promise<number | null> {
  try {
    const userAddress = await prisma.userAddress.findFirst({
      where: { nickname },
      select: { id: true }
    });

    return userAddress?.id || null;
  } catch (error) {
    console.error('❌ userAddress ID 조회 실패:', error);
    return null;
  }
}

/**
 * userAddress ID로부터 닉네임을 가져오는 함수
 * @param id userAddress ID
 * @returns userAddress 닉네임 또는 null
 */
export async function getUserAddressNicknameById(id: number): Promise<string | null> {
  try {
    const userAddress = await prisma.userAddress.findFirst({
      where: { id },
      select: { nickname: true }
    });

    return userAddress?.nickname || null;
  } catch (error) {
    console.error('❌ userAddress 닉네임 조회 실패:', error);
    return null;
  }
} 