'use client';

import { AddressDropDown } from '@/(anon)/_components/common/addressDropDown/AddressDropDown';
import DocumentCard from '@/(anon)/main/_components/DocumentCard';
import { styles as mainStyles } from '../main.styles';
import { AddressConfirmationTab } from './tabContainer/AddressConfirmationTab';
import { Pin, X } from 'lucide-react';
import Button from '@/(anon)/_components/common/button/Button';
import { DaumPostcodeModal } from './daumPostcodeModal/DaumPostcodeModal';
import { ConfirmModal } from '../../_components/common/modal/ConfirmModal';
import { GuideResultsContainer } from './guideResults/GuideResultsContainer';
import { useMainPage } from '@/hooks/useMainPage';
import WithdrawButton from '@/(anon)/mypage/_components/WithdrawButton';

export const MainPageClient = () => {
  const {
    userAddresses,
    selectedAddress,
    gpsLoading,
    gpsError,
    showPostcode,
    isNewAddressSearch,
    isOpen,
    content,
    showNavigationConfirm,
    postcodeRef,
    onSearch,
    executePostcode,
    setShowPostcode,
    deleteAddress,
    toggleFavorite,
    handleAddressSelect,
    confirmModal,
    cancelModal,
    handleConfirmNavigation,
    handleCancelNavigation,
  } = useMainPage();

  return (
    <>
      {/* 주소 드롭다운 영역 */}
      <AddressDropDown
        addresses={userAddresses}
        selectedAddress={selectedAddress}
        onDelete={deleteAddress}
        onToggleFavorite={toggleFavorite}
        onSelect={handleAddressSelect}
      />

      {/* 주소 추가 및 지도 영역 */}
      <div className={mainStyles.addressMapContainer}>
        <div className={mainStyles.addressInfoHeader}>
          <div className={mainStyles.addressInfoTitleContainer}>
            <h3 className={mainStyles.addressInfoTitle}>선택된 주소 정보</h3>
            <Button
              onClick={onSearch}
              variant='primary'
              className={mainStyles.addressAddButton}
            >
              주소 검색
            </Button>
          </div>
          {/* 위치 상태 표시 */}
          <div className={mainStyles.locationStatusContainer}>
            {gpsLoading ? (
              <span className={mainStyles.locationStatusLoading}>
                <Pin className={mainStyles.locationStatusIcon} />
                위치 확인 중...
              </span>
            ) : (
              gpsError && (
                <span className={mainStyles.locationStatusError}>
                  <X className={mainStyles.locationStatusIcon} />
                  위치 오류
                </span>
              )
            )}
          </div>
        </div>

        {/* 주소 확인 탭 컴포넌트 */}
        <AddressConfirmationTab />
      </div>

      {/* 가이드 결과 컨테이너 */}
      {!isNewAddressSearch && (
        <>
          {/* 문서 카드 */}
          <DocumentCard />
          <GuideResultsContainer
            selectedAddress={selectedAddress}
            isNewAddressSearch={isNewAddressSearch}
          />
        </>
      )}

      {/* Daum 우편번호 검색 모달 */}
      <DaumPostcodeModal
        postcodeRef={postcodeRef}
        showPostcode={showPostcode}
        onClose={() => setShowPostcode(false)}
        onSearch={executePostcode}
      />

      {/* 공통 모달 */}
      <ConfirmModal
        isOpen={isOpen}
        title={content?.title || ''}
        onConfirm={confirmModal}
        onCancel={cancelModal}
        confirmText={content?.confirmText}
        cancelText={content?.cancelText}
        icon={content?.icon || 'info'}
      >
        {content?.content}
      </ConfirmModal>

      {/* 페이지 이동 확인 모달 */}
      <ConfirmModal
        isOpen={showNavigationConfirm}
        title='주소 저장 확인'
        onConfirm={handleConfirmNavigation}
        onCancel={handleCancelNavigation}
        confirmText='계속하기'
        cancelText='취소'
        icon='warning'
      >
        새롭게 추가된 주소가 저장되지 않아 추가된 주소가 초기화됩니다.
        <br />
        계속 하시겠습니까?
      </ConfirmModal>

      {/* 회원탈퇴 버튼 */}
      <WithdrawButton />
    </>
  );
};
