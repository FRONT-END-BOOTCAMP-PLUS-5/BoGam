'use client';

import React, { useState } from 'react';
import {
  RealEstateContainerProps,
  RealEstateFormData,
  ApiResponse,
  AddressListItem,
} from './types';
import { RealEstateInput } from './RealEstateInput';
import { RealEstateOutput } from './RealEstateOutput';
import { RealEstateTwoWayContent } from './RealEstateTwoWayContent';
import { ConfirmModal } from '@/(anon)/_components/common/modal/ConfirmModal';
import { styles } from './RealEstateContainer.styles';
import { frontendAxiosInstance } from '@libs/api_front/axiosInstance';

export const RealEstateContainer: React.FC<RealEstateContainerProps> = () => {
  const [activeTab, setActiveTab] = useState<'input' | 'output'>('input');
  const [formData, setFormData] = useState<RealEstateFormData>({
    userAddressId: 1,
    password: 'qwe123',
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
    dong: '',
    ho: '',
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
  const [loading, setLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] =
    useState<AddressListItem | null>(null);
  const [showTwoWayModal, setShowTwoWayModal] = useState(false);

  const handleFormDataChange = React.useCallback((data: RealEstateFormData) => {
    setFormData(data);
  }, []);

  const handleReset = React.useCallback(() => {
    const resetData: RealEstateFormData = {
      userAddressId: 1,
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
      dong: '',
      ho: '',
      addr_sigungu: '',
      addr_roadName: '',
      addr_buildingNumber: '',
      listNumber: '',
      ePrepayNo: '',
      ePrepayPass: '',
      originData: '',
      reqIdentity: '',
      identityList: [{ reqIdentity: '' }],
    };
    setFormData(resetData);
    setResponse(null);
    setSelectedAddress(null);
  }, []);

  const handleSubmit = async (data: RealEstateFormData) => {
    const requestData = {
      ...data,
      dong: data.dong || '101',
      ho: data.ho || '101',
    };

    setLoading(true);
    setResponse(null);
    setSelectedAddress(null);

    try {
      console.log('📤 요청 데이터 전송 중...');
      const res = await frontendAxiosInstance
        .getAxiosInstance()
        .post('/api/real-estate/search/address', requestData);

      console.log('📥 응답 수신:', {
        status: res.status,
        statusText: res.statusText,
        ok: res.status >= 200 && res.status < 300,
      });

      const responseData: ApiResponse = res.data as ApiResponse;
      console.log('📋 응답 데이터:', responseData);

      setResponse(responseData);

      // 2-way 인증이 필요한 경우 모달 표시 (백엔드 API 응답 기준)
      if (responseData.requiresTwoWayAuth && responseData.resAddrList) {
        console.log('🔐 2-way 인증 필요, 모달 표시');
        console.log('📋 2-way 인증 정보:', {
          requiresTwoWayAuth: responseData.requiresTwoWayAuth,
          twoWayInfo: responseData.twoWayInfo,
          resAddrList: responseData.resAddrList,
        });
        setShowTwoWayModal(true);
      } else {
        console.log('✅ 일반 응답, Output 탭으로 이동');
        console.log('📋 응답 타입:', {
          requiresTwoWayAuth: responseData.requiresTwoWayAuth,
          hasTwoWayInfo: !!responseData.twoWayInfo,
          hasResAddrList: !!responseData.resAddrList,
        });
        // 결과가 있으면 Output 탭으로 이동
        setActiveTab('output');
      }
    } catch (error) {
      console.error('❌ API 요청 오류:', error);
      setResponse({
        success: false,
        message: 'API 호출 중 오류가 발생했습니다.',
        error: error instanceof Error ? error.message : '알 수 없는 오류',
      });
      setActiveTab('output');
    } finally {
      console.log('🏁 API 요청 완료');
      setLoading(false);
    }
  };

  const handleAddressSelect = async (address: AddressListItem) => {
    console.log('🔍 주소 선택됨:', address);
    setSelectedAddress(address);

    console.log('address', address);

    // 모달 즉시 닫기
    setShowTwoWayModal(false);

    // Output 탭으로 이동하여 로딩 상태 표시
    setActiveTab('output');
    setLoading(true);

    // 주소 선택 즉시 2-way 인증 요청 실행
    await handleTwoWayAuthWithAddress(address);
  };

  const handleTwoWayAuthWithAddress = async (address: AddressListItem) => {
    if (!response?.twoWayInfo) {
      console.log('⚠️ 2-way 인증: 2-way 정보 없음');
      alert('2-way 인증 정보가 없습니다.');
      return;
    }

    console.log('🔐 2-way 인증 요청 시작:', {
      selectedAddress: address,
      twoWayInfo: response.twoWayInfo,
    });

    // twoWayLoading은 더 이상 사용하지 않음 (모달에서 로딩하지 않으므로)
    // setTwoWayLoading(true);

    try {
      // 2-way 인증 요청 데이터 준비
      const twoWayRequestData = Object.fromEntries(
        Object.entries(formData).filter(([key]) => key !== 'uniqueNo')
      );

      // 필수 컬럼 dong, ho 추가 (handleSubmit과 동일하게)
      twoWayRequestData.dong = formData.dong || '101';
      twoWayRequestData.ho = formData.ho || '101';

      // 간편검색인 경우 주소 필드들을 address로 묶기
      if (formData.inquiryType === '1') {
        const addressParts = [
          formData.addr_sido,
          formData.addr_sigungu,
          formData.addr_dong,
          formData.dong && formData.ho
            ? `${formData.dong}동 ${formData.ho}호`
            : '',
        ].filter(Boolean);

        twoWayRequestData.address = addressParts.join(' ');

        console.log('🔗 2-way 인증 간편검색 주소 조합:', {
          combined: twoWayRequestData.address,
          parts: addressParts,
        });
      }

      const twoWayRequest = {
        // 2-way 인증 필수 파라미터
        uniqueNo: address.commUniqueNo,
        jobIndex: response.twoWayInfo.jobIndex,
        threadIndex: response.twoWayInfo.threadIndex,
        jti: response.twoWayInfo.jti,
        twoWayTimestamp: response.twoWayInfo.twoWayTimestamp,
        isTwoWayAuth: true, // 2-way 인증 요청 플래그

        // 원본 요청 파라미터들
        ...twoWayRequestData,
      };

      console.log(
        '📤 2-way 인증 요청 데이터:',
        JSON.stringify(twoWayRequest, null, 2)
      );

      const res = await frontendAxiosInstance
        .getAxiosInstance()
        .post('/api/real-estate/search/address', twoWayRequest);

      console.log('📥 2-way 인증 응답 수신:', {
        status: res.status,
        statusText: res.statusText,
        ok: res.status >= 200 && res.status < 300,
      });

      const data: ApiResponse = res.data as ApiResponse;
      console.log('📋 2-way 인증 응답 데이터:', data);

      setResponse(data);
      // 모달은 이미 닫혀있고, Output 탭도 이미 활성화되어 있음
    } catch (error) {
      console.error('❌ 2-way 인증 API 요청 오류:', error);
      setResponse({
        success: false,
        message: '2-way 인증 API 호출 중 오류가 발생했습니다.',
        error: error instanceof Error ? error.message : '알 수 없는 오류',
      });
      // 모달은 이미 닫혀있고, Output 탭도 이미 활성화되어 있음
    } finally {
      console.log('🏁 2-way 인증 요청 완료');
      // twoWayLoading은 더 이상 사용하지 않음
      // setTwoWayLoading(false);
    }
  };

  const handleTwoWayAuth = async () => {
    if (!selectedAddress || !response?.twoWayInfo) {
      console.log('⚠️ 2-way 인증: 부동산이 선택되지 않거나 2-way 정보 없음');
      alert('부동산을 선택해주세요.');
      return;
    }

    // 선택된 주소로 2-way 인증 요청
    await handleTwoWayAuthWithAddress(selectedAddress);
  };

  const handleCloseTwoWayModal = () => {
    setShowTwoWayModal(false);
    setSelectedAddress(null);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>부동산등기부등본 조회</h1>

      {/* 탭 네비게이션 */}
      <div className={styles.tabContainer}>
        <button
          onClick={() => setActiveTab('input')}
          className={`${styles.tab} ${
            activeTab === 'input' ? styles.activeTab : styles.inactiveTab
          }`}
        >
          입력
        </button>
        <button
          onClick={() => setActiveTab('output')}
          className={`${styles.tab} ${
            activeTab === 'output' ? styles.activeTab : styles.inactiveTab
          }`}
        >
          결과
        </button>
      </div>

      {/* 탭 컨텐츠 */}
      <div className={styles.tabContent}>
        {activeTab === 'input' && (
          <RealEstateInput
            formData={formData}
            onSubmit={handleSubmit}
            onReset={handleReset}
            loading={loading}
          />
        )}

        {activeTab === 'output' && (
          <RealEstateOutput response={response} loading={loading} />
        )}
      </div>

      {/* 2-way 인증 모달 */}
      <ConfirmModal
        isOpen={showTwoWayModal}
        title='부동산 목록에서 선택하세요'
        onCancel={handleCloseTwoWayModal}
        cancelText='취소'
        icon='info'
        isLoading={false} // 모달에서 로딩하지 않으므로 false로 고정
        onConfirm={undefined}
      >
        <RealEstateTwoWayContent
          resAddrList={response?.resAddrList || []}
          selectedAddress={selectedAddress}
          onAddressSelect={handleAddressSelect}
        />
      </ConfirmModal>
    </div>
  );
};
