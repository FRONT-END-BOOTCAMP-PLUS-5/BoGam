import { useState, useEffect } from 'react';
import {
  RealEstateFormData,
  ApiResponse,
  AddressListItem,
} from '@/(anon)/_components/common/realEstate/types';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import {
  useCheckRealEstateExists,
  useCreateRealEstate,
  useTwoWayAuth,
} from '@/hooks/useRealEstate';

export const useRealEstateContainer = () => {
  const [activeTab, setActiveTab] = useState<'input' | 'output'>('input');
  const [formData] = useState<RealEstateFormData>({
    userAddressNickname: '',
    password: '1234',
    address: '',
    realtyType: '1',
    recordStatus: '0',
    startPageNo: '1',
    pageCount: '5',
    applicationType: '1',
    organization: '0002',
    phoneNo: '01011111111',
    inquiryType: '1', // 간편검색으로 고정
    issueType: '1',
    jointMortgageJeonseYN: '0',
    tradingYN: '0',
    electronicClosedYN: '0',
    originDataYN: '1', // 원문 데이터 항상 포함
    warningSkipYN: '0',
    registerSummaryYN: '0',
    selectAddress: '0',
    isIdentityViewYn: '0',
    // 누락된 필드들 초기값
    uniqueNo: '',
    addr_sido: '',
    addr_dong: '',
    addr_lotNumber: '',
    inputSelect: '',
    buildingName: '',
    dong: '101',
    ho: '101',
    addr_sigungu: '',
    addr_roadName: '',
    addr_buildingNumber: '',
    listNumber: '',
    ePrepayNo: '',
    ePrepayPass: '',
    originData: '',
    reqIdentity: '',
    identityList: [{ reqIdentity: '' }],
  });

  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [twoWaySelectedAddress, setTwoWaySelectedAddress] =
    useState<AddressListItem | null>(null);
  const [showTwoWayModal, setShowTwoWayModal] = useState(false);

  // selectedAddress 변경 시 데이터 존재 여부 확인
  const { selectedAddress } = useUserAddressStore();

  // 데이터 존재 여부 확인
  const { data: existsData } = useCheckRealEstateExists(
    selectedAddress?.nickname
  );

  // 데이터 생성 mutation
  const createRealEstateMutation = useCreateRealEstate((data) => {
    // 일반 API 요청 성공 후 탭 전환 (2-way 인증이 필요 없는 경우)
    if (!data.requiresTwoWayAuth) {
      // exists 데이터를 다시 확인하여 데이터가 있을 때만 Output 탭으로 이동
      setTimeout(() => {
        if (existsData?.success && existsData.exists) {
          setActiveTab('output');
        }
      }, 100);
    }
  });

  const twoWayAuthMutation = useTwoWayAuth(() => {
    // 2-way 인증 성공 후 탭 전환
    // exists 데이터를 다시 확인하여 데이터가 있을 때만 Output 탭으로 이동
    setTimeout(() => {
      if (existsData?.success && existsData.exists) {
        setActiveTab('output');
      }
    }, 100);
  });

  // 데이터 존재 여부에 따라 탭 설정
  useEffect(() => {
    if (existsData?.success && existsData.exists) {
      setActiveTab('output');
    } else if (existsData?.success && !existsData.exists) {
      setActiveTab('input');
    }
  }, [existsData]);

  // exists 데이터가 없으면 Output 탭으로 이동하지 못하도록 방지
  useEffect(() => {
    if (activeTab === 'output' && existsData?.success && !existsData.exists) {
      setActiveTab('input');
    }
  }, [activeTab, existsData]);

  const handleAddressSelect = async (address: AddressListItem) => {
    setTwoWaySelectedAddress(address);

    // 모달 즉시 닫기
    setShowTwoWayModal(false);

    // 주소 선택 즉시 2-way 인증 요청 실행
    await handleTwoWayAuthWithAddress(address);
  };

  const handleTwoWayAuthWithAddress = async (address: AddressListItem) => {
    if (!response?.twoWayInfo) {
      alert('2-way 인증 정보가 없습니다.');
      return;
    }

    if (!selectedAddress?.nickname) {
      alert('선택된 주소 정보가 없습니다.');
      return;
    }

    try {
      // 2-way 인증 요청 데이터 준비
      const twoWayRequestData = Object.fromEntries(
        Object.entries(formData).filter(([key]) => key !== 'uniqueNo')
      );

      // 필수 컬럼 dong, ho 추가
      twoWayRequestData.dong = formData.dong || '101';
      twoWayRequestData.ho = formData.ho || '101';
      twoWayRequestData.userAddressNickname = selectedAddress.nickname;

      const twoWayRequest = {
        // 2-way 인증 필수 파라미터
        uniqueNo: address.commUniqueNo,
        jobIndex: response.twoWayInfo.jobIndex,
        threadIndex: response.twoWayInfo.threadIndex,
        jti: response.twoWayInfo.jti,
        twoWayTimestamp: response.twoWayInfo.twoWayTimestamp,
        isTwoWayAuth: true,

        // 원본 요청 파라미터들
        ...twoWayRequestData,
      };

      const data = await twoWayAuthMutation.mutateAsync(twoWayRequest);
      setResponse(data);
    } catch (error) {
      setResponse({
        success: false,
        message: '2-way 인증 API 호출 중 오류가 발생했습니다.',
        error: error instanceof Error ? error.message : '알 수 없는 오류',
        userAddressNickname: selectedAddress.nickname,
      });
    }
  };

  const handleCloseTwoWayModal = () => {
    setShowTwoWayModal(false);
    setTwoWaySelectedAddress(null);
  };

  const handleSubmit = async (data: RealEstateFormData) => {
    if (!selectedAddress) {
      alert('주소를 선택해주세요.');
      return;
    }

    const requestData = {
      ...data,
      userAddressNickname: selectedAddress.nickname,
      userAddressId: selectedAddress.id, // userAddressId도 함께 전달
    };

    // userAddressNickname이 없으면 명시적으로 추가
    if (!requestData.userAddressNickname) {
      requestData.userAddressNickname = selectedAddress.nickname;
    }

    try {
      const responseData = await createRealEstateMutation.mutateAsync(
        requestData
      );

      setResponse(responseData);

      // 2-way 인증이 필요한 경우 모달 표시
      if (responseData.requiresTwoWayAuth && responseData.resAddrList) {
        setShowTwoWayModal(true);
      }
    } catch (error) {
      setResponse({
        success: false,
        message: 'API 호출 중 오류가 발생했습니다.',
        error: error instanceof Error ? error.message : '알 수 없는 오류',
        userAddressNickname: selectedAddress.nickname,
      });
    }
  };

  return {
    activeTab,
    setActiveTab,
    formData,
    response,
    twoWaySelectedAddress,
    showTwoWayModal,
    selectedAddress,
    existsData,
    createRealEstateMutation,
    twoWayAuthMutation,
    handleAddressSelect,
    handleCloseTwoWayModal,
    handleSubmit,
  };
};
