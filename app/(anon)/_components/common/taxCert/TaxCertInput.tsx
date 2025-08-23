'use client';

import { useState } from 'react';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import { FormContainer } from '@/(anon)/_components/common/forms/FormContainer';
import { FormField } from '@/(anon)/_components/common/forms/FormField';
import { FormInput } from '@/(anon)/_components/common/forms/FormInput';
import { FormSelect } from '@/(anon)/_components/common/forms/FormSelect';
import { ConfirmModal } from '@/(anon)/_components/common/modal/ConfirmModal';
import { useIssueTaxCert } from '@/hooks/useTaxCert';
import { styles } from './TaxCertInput.styles';
import Image from 'next/image';

// 간편인증 방법 데이터
const authMethods = [
  {
    id: '1',
    name: '카카오톡',
    image: '/images/KakaoTalk.png',
    alt: '카카오톡',
  },
  {
    id: '3',
    name: '삼성패스',
    image: '/images/SamsungPass.png',
    alt: '삼성패스',
  },
  {
    id: '4',
    name: '국민민인증서',
    image: '/images/KBMobileCertificate.png',
    alt: '국민인증서',
  },
  {
    id: '5',
    name: '통신사인증서',
    image: '/images/Pass.png',
    alt: '통신사PASS',
  },
  {
    id: '6',
    name: '네이버',
    image: '/images/Naver.png',
    alt: '네이버',
  },
  {
    id: '7',
    name: '신한인증서',
    image: '/images/ShinhanCertificate.png',
    alt: '신한인증서',
  },
  {
    id: '8',
    name: 'toss',
    image: '/images/Toss.png',
    alt: '토스',
  },
  {
    id: '9',
    name: '뱅크샐러드',
    image: '/images/Banksalad.png',
    alt: '뱅크샐러드',
  },
];

interface TaxCertInputProps {
  userAddressNickname: string;
  onSuccess?: () => void;
}

export const TaxCertInput = ({
  userAddressNickname,
  onSuccess,
}: TaxCertInputProps) => {
  const { selectedAddress } = useUserAddressStore();
  const [error, setError] = useState<string | null>(null);
  const [isAuthMethodModalOpen, setIsAuthMethodModalOpen] = useState(false);
  const [isTwoWayModalOpen, setIsTwoWayModalOpen] = useState(false);
  const [twoWayData, setTwoWayData] = useState<{
    method?: string;
    jobIndex?: number;
    threadIndex?: number;
    jti?: string;
    twoWayTimestamp?: number;
    result?: { code?: string };
  } | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // 폼 데이터 상태
  const [formData, setFormData] = useState({
    userName: '',
    loginIdentity: '',
    identityEncYn: 'N',
    loginBirthDate: '',
    loginTypeLevel: '',
    telecom: '',
    phoneNo: '',
    loginType: '6', // 비회원 간편인증 기본값
    proofType: 'B0006', // 대금수령 기본값
    submitTargets: '01', // 금융기관 기본값
    // CommonFields에서 추가된 필드들
    applicationType: '01', // 본인 기본값
    clientTypeLevel: '1', // 개인 기본값
    identity: '', // 사업자번호/주민등록번호
    birthDate: '', // 생년월일
  });

  const issueTaxCertMutation = useIssueTaxCert();

  // 입력 변경 핸들러
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 간편인증 방법 선택 핸들러
  const handleLoginTypeLevelChange = (level: string) => {
    setFormData((prev) => ({
      ...prev,
      loginTypeLevel: level,
    }));
  };

  // 모달 핸들러
  const handleOpenAuthMethodModal = () => {
    setIsAuthMethodModalOpen(true);
  };

  const handleCloseAuthMethodModal = () => {
    setIsAuthMethodModalOpen(false);
  };

  const handleSelectAuthMethod = (methodId: string) => {
    handleLoginTypeLevelChange(methodId);
    setIsAuthMethodModalOpen(false);
  };

  // 선택된 인증 방법 정보 가져오기
  const selectedMethod = authMethods.find(
    (method) => method.id === formData.loginTypeLevel
  );

  // 아코디언 토글
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const requestData = {
        organization: '0001', // 기본 기관코드
        loginType: '6',
        isIdentityViewYN: 'Y', // 주민등록번호 공개
        proofType: formData.proofType,
        submitTargets: formData.submitTargets,
        userAddressNickname: userAddressNickname,
        is2Way: false,
        // 간편인증 로그인 타입별 필수 필드
        userName: formData.userName,
        loginIdentity: formData.loginIdentity,
        loginTypeLevel: formData.loginTypeLevel,
        phoneNo: formData.phoneNo,
        // 통신사인증서(loginTypeLevel="5")인 경우에만 telecom 필수
        ...(formData.loginTypeLevel === '5' && { telecom: formData.telecom }),
        identityEncYn: formData.identityEncYn,
        loginBirthDate: formData.loginBirthDate,
        // CommonFields에서 추가된 필드들
        applicationType: formData.applicationType,
        clientTypeLevel: formData.clientTypeLevel,
        identity: formData.identity,
        birthDate: formData.birthDate,
        // API 공식문서 필수 필드들
        isAddrViewYn: '0', // 주소 공개여부 (0: 비공개)
        originDataYN: '0', // 원문 DATA 포함 여부 (0: 미포함)
        originDataYN1: '0', // PDF 원문 DATA 포함 여부 (0: 미포함)
        // 간편인증 선택 필드
        id: `${formData.userName}_${Date.now()}`, // 요청 식별 아이디
      };

      console.log('requestData', requestData);

      const result = await issueTaxCertMutation.mutateAsync(requestData);

      if (result && typeof result === 'object' && 'success' in result) {
        if (result.success) {
          // 성공 시 바로 결과 탭으로 이동
          if (onSuccess) {
            onSuccess();
          }
        } else {
          // 추가인증이 필요한 경우 (CF-03002)
          const responseData = result as {
            data?: {
              result?: { code?: string };
              data?: {
                method?: string;
                jobIndex?: number;
                threadIndex?: number;
                jti?: string;
                twoWayTimestamp?: number;
              };
            };
          };
          if (responseData.data?.result?.code === 'CF-03002') {
            // 2-way 인증 모달 표시
            console.log('2-way 인증 데이터:', responseData.data);
            console.log('2-way 인증 상세 데이터:', responseData.data.data);

            // 실제 2-way 인증 데이터는 data.data에 있음
            const twoWayInfo = responseData.data.data;
            setTwoWayData({
              method: twoWayInfo?.method,
              jobIndex: twoWayInfo?.jobIndex,
              threadIndex: twoWayInfo?.threadIndex,
              jti: twoWayInfo?.jti,
              twoWayTimestamp: twoWayInfo?.twoWayTimestamp,
              result: responseData.data.result,
            });
            setIsTwoWayModalOpen(true);
          } else {
            const message = (result as { message?: string }).message;
            setError(message || '납세증명서 발급에 실패했습니다.');
          }
        }
      }
    } catch (err: unknown) {
      console.error('납세증명서 발급 오류:', err);
      const errorMessage =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : err instanceof Error
          ? err.message
          : '납세증명서 발급 중 오류가 발생했습니다.';
      setError(errorMessage || '납세증명서 발급 중 오류가 발생했습니다.');
    }
  };

  // 2-way 인증 승인 처리
  const handleTwoWayConfirm = async () => {
    if (!twoWayData) return;

    try {
      const twoWayRequestData = {
        organization: '0001',
        loginType: '6',
        isIdentityViewYN: 'Y',
        proofType: formData.proofType,
        submitTargets: formData.submitTargets,
        userAddressNickname: userAddressNickname,
        is2Way: true,
        // 간편인증 로그인 타입별 필수 필드
        userName: formData.userName,
        loginIdentity: formData.loginIdentity,
        loginTypeLevel: formData.loginTypeLevel,
        phoneNo: formData.phoneNo,
        // 통신사인증서(loginTypeLevel="5")인 경우에만 telecom 필수
        ...(formData.loginTypeLevel === '5' && { telecom: formData.telecom }),
        identityEncYn: formData.identityEncYn,
        loginBirthDate: formData.loginBirthDate,
        // CommonFields에서 추가된 필드들
        applicationType: formData.applicationType,
        clientTypeLevel: formData.clientTypeLevel,
        identity: formData.identity,
        birthDate: formData.birthDate,
        // API 공식문서 필수 필드들
        isAddrViewYn: '0', // 주소 공개여부 (0: 비공개)
        originDataYN: '0', // 원문 DATA 포함 여부 (0: 미포함)
        originDataYN1: '0', // PDF 원문 DATA 포함 여부 (0: 미포함)
        // 간편인증 선택 필드
        id: `${formData.userName}_${Date.now()}`, // 요청 식별 아이디
        // 2-way 인증 정보
        twoWayInfo: {
          jobIndex: twoWayData.jobIndex,
          threadIndex: twoWayData.threadIndex,
          jti: twoWayData.jti,
          twoWayTimestamp: twoWayData.twoWayTimestamp,
        },
        // 간편인증 승인
        simpleAuth: '1',
      };

      console.log('2-way 인증 요청 데이터:', twoWayRequestData);
      console.log('2-way 인증 정보:', twoWayRequestData.twoWayInfo);

      const result = await issueTaxCertMutation.mutateAsync(twoWayRequestData);

      if (result && typeof result === 'object' && 'success' in result) {
        if (result.success) {
          setIsTwoWayModalOpen(false);
          if (onSuccess) {
            onSuccess();
          }
        } else {
          const message = (result as { message?: string }).message;
          setError(message || '2-way 인증 처리에 실패했습니다.');
        }
      }
    } catch (err: unknown) {
      console.error('2-way 인증 처리 오류:', err);
      const errorMessage =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : err instanceof Error
          ? err.message
          : '2-way 인증 처리 중 오류가 발생했습니다.';
      setError(errorMessage || '2-way 인증 처리 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
      <FormContainer
        onSubmit={handleSubmit}
        isLoading={issueTaxCertMutation.isPending}
        submitText='납세증명서 발급'
        disabled={
          !userAddressNickname ||
          !formData.userName ||
          !formData.loginIdentity ||
          !formData.loginTypeLevel ||
          !formData.phoneNo ||
          (formData.loginTypeLevel === '5' && !formData.telecom)
        }
      >
        <FormField label='사용자 이름' required>
          <FormInput
            type='text'
            name='userName'
            value={formData.userName}
            onChange={handleInputChange}
            placeholder='필수: 사용자 이름'
            required
          />
        </FormField>

        <FormField label='사용자 주민번호' required>
          <FormInput
            type='text'
            name='loginIdentity'
            value={formData.loginIdentity}
            onChange={handleInputChange}
            placeholder='필수: 사용자 주민번호'
            maxLength={13}
            required
          />
        </FormField>

        <FormField label='주민등록번호 뒷자리 암호화 여부'>
          <FormSelect
            name='identityEncYn'
            value={formData.identityEncYn}
            onChange={handleInputChange}
          >
            <option value='N'>비암호화</option>
            <option value='Y'>암호화</option>
          </FormSelect>
        </FormField>

        {formData.identityEncYn === 'Y' && (
          <FormField label='생년월일' required>
            <FormInput
              type='text'
              name='loginBirthDate'
              value={formData.loginBirthDate}
              onChange={handleInputChange}
              placeholder='960413'
              maxLength={6}
              required
            />
          </FormField>
        )}

        <FormField label='간편인증 로그인 구분' required>
          <button
            type='button'
            onClick={handleOpenAuthMethodModal}
            className={styles.authMethodButton}
          >
            {selectedMethod ? (
              <div className={styles.selectedAuthMethod}>
                <Image
                  src={selectedMethod.image}
                  alt={selectedMethod.alt}
                  width={24}
                  height={24}
                  className={styles.authIconSmall}
                />
                <span className={styles.selectedAuthText}>
                  {selectedMethod.name}
                </span>
              </div>
            ) : (
              <span className={styles.placeholderText}>
                간편인증 방법을 선택해주세요
              </span>
            )}
            <span className={styles.dropdownArrow}>▼</span>
          </button>
        </FormField>

        {formData.loginTypeLevel === '5' && (
          <FormField label='통신사' required>
            <FormSelect
              name='telecom'
              value={formData.telecom}
              onChange={handleInputChange}
              required
            >
              <option value=''>통신사 선택</option>
              <option value='0'>SKT</option>
              <option value='1'>KT</option>
              <option value='2'>LG U+</option>
            </FormSelect>
          </FormField>
        )}

        <FormField label='전화번호' required>
          <FormInput
            type='tel'
            name='phoneNo'
            value={formData.phoneNo}
            onChange={handleInputChange}
            placeholder='필수: 전화번호'
            required
          />
        </FormField>

        <FormField label='증명구분'>
          <FormSelect
            name='proofType'
            value={formData.proofType}
            onChange={handleInputChange}
          >
            <option value='B0006'>대금수령</option>
            <option value='B0007'>기타</option>
          </FormSelect>
        </FormField>

        <FormField label='제출처'>
          <FormSelect
            name='submitTargets'
            value={formData.submitTargets}
            onChange={handleInputChange}
          >
            <option value='01'>금융기관</option>
            <option value='02'>관공서</option>
            <option value='03'>조합/협회</option>
            <option value='04'>거래처</option>
            <option value='05'>학교</option>
            <option value='99'>기타</option>
          </FormSelect>
        </FormField>

        {/* 추가 설정 아코디언 */}
        <div className={styles.accordionContainer}>
          <button
            type='button'
            onClick={toggleExpanded}
            className={styles.accordionHeader}
            aria-expanded={isExpanded}
          >
            <span className={styles.accordionTitle}>📋 추가 설정</span>
            <span className={styles.accordionIcon}>
              {isExpanded ? '▼' : '▶'}
            </span>
          </button>

          {isExpanded && (
            <div className={styles.accordionContent}>
              {/* 신청구분 및 의뢰인구분 */}
              <div className={styles.gridTwo}>
                <FormField label='신청 구분'>
                  <FormSelect
                    name='applicationType'
                    value={formData.applicationType}
                    onChange={handleInputChange}
                  >
                    <option value='01'>본인</option>
                    <option value='02'>세무대리인</option>
                  </FormSelect>
                </FormField>

                <FormField label='의뢰인 구분'>
                  <FormSelect
                    name='clientTypeLevel'
                    value={formData.clientTypeLevel}
                    onChange={handleInputChange}
                  >
                    <option value='1'>개인</option>
                    <option value='2'>개인 단체</option>
                    <option value='3'>사업자</option>
                  </FormSelect>
                </FormField>
              </div>

              {/* 사업자번호/주민등록번호 및 생년월일 */}
              <div className={styles.gridTwo}>
                <FormField label='사업자번호/주민등록번호'>
                  <FormInput
                    type='text'
                    name='identity'
                    value={formData.identity}
                    onChange={handleInputChange}
                    placeholder='사업자번호 또는 주민등록번호'
                    maxLength={13}
                  />
                </FormField>

                <FormField label='생년월일'>
                  <FormInput
                    type='text'
                    name='birthDate'
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    placeholder='960413'
                    maxLength={6}
                  />
                </FormField>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className={styles.error}>
            <p>{error}</p>
          </div>
        )}
      </FormContainer>

      {/* 간편인증 방법 선택 모달 */}
      <ConfirmModal
        isOpen={isAuthMethodModalOpen}
        title='간편인증 로그인 구분 선택'
        onCancel={handleCloseAuthMethodModal}
        confirmText='닫기'
        cancelText='취소'
        icon='info'
        onConfirm={handleCloseAuthMethodModal}
      >
        <div className={styles.authGrid}>
          {authMethods.map((method) => (
            <div
              key={method.id}
              className={`${styles.authItem} ${
                formData.loginTypeLevel === method.id
                  ? styles.authItemSelected
                  : styles.authItemDefault
              }`}
              onClick={() => handleSelectAuthMethod(method.id)}
            >
              <div className={styles.authIconContainer}>
                <Image
                  src={method.image}
                  alt={method.alt}
                  width={48}
                  height={48}
                  className={styles.authIcon}
                />
                <span className={styles.authText}>{method.name}</span>
              </div>
            </div>
          ))}
        </div>
      </ConfirmModal>

      {/* 2-way 인증 모달 */}
      <ConfirmModal
        isOpen={isTwoWayModalOpen}
        title='추가 인증 필요'
        onCancel={() => setIsTwoWayModalOpen(false)}
        confirmText='승인 완료'
        cancelText='취소'
        icon='warning'
        onConfirm={handleTwoWayConfirm}
        isLoading={issueTaxCertMutation.isPending}
      >
        <div className={styles.twoWayContent}>
          <p className={styles.twoWayMessage}>
            선택하신 간편인증 방법으로 추가 인증이 필요합니다.
          </p>
          <div className={styles.twoWayInfo}>
            <p>
              <strong>인증 방법:</strong> {twoWayData?.method || '간편인증'}
            </p>
            <p>
              <strong>타임아웃:</strong> 4분 30초
            </p>
            <p className={styles.twoWayWarning}>
              ⚠️ 인증을 완료하지 않고 승인 버튼을 누르면 2번까지 재시도
              가능하며, 3번 시도 시 오류가 발생합니다.
            </p>
          </div>
        </div>
      </ConfirmModal>
    </>
  );
};
