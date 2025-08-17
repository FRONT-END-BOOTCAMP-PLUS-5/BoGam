'use client';

import { useState } from 'react';
import CircularIconBadge from '@/(anon)/_components/common/circularIconBadges/CircularIconBadge';
import { AddressDropDown } from '@/(anon)/_components/common/addressDropDown';
import GuideStepItem from '@/(anon)/_components/common/guideStepItem/GuideStepItem';
import GuideStepRow from '@/(anon)/_components/common/guideStepContent/GuideStepRow';
import GuideStepText from '@/(anon)/_components/common/guideStepContent/GuideStepText';
import GuideStepContent from '@/(anon)/_components/common/guideStepContent/GuideStepContent';
import GuideResultSummary from './_components/GuideResultSummary';
import ResultAccordion from './_components/ResultAccordion';
import { styles } from './page.styles';

// 하드코딩된 데이터
const mockData = {
  profile: {
    name: '나는야노석준',
    avatar: '나'
  },
  addresses: [
    {
      id: '1',
      address: '경기도 고양시 왕산동구 항시티 0로 000, B동 000호 (당사동, 전세보갑아파트)',
      isFavorite: true,
      isExpanded: true,
      isActive: false
    },
    {
      id: '2',
      address: '경기도 고양시 왕산동구 항시티 0로 000, B동 000호 (당사동, 전세보갑아파트)',
      isFavorite: true,
      isActive: true
    },
    {
      id: '3',
      address: '서울특별시 강남구 강시티 0로 000, 100동 101호 (강남동, 전세보갑아파트)',
      isFavorite: true,
      isActive: false
    },
    {
      id: '4',
      address: '서울특별시 강남구 강시티 0로 000, 100동 101호 (강남동, 전세보갑아파트)',
      isFavorite: false,
      isActive: false
    },
    {
      id: '5',
      address: '서울특별시 강남구 강시티 0로 000, 100동 101호 (강남동, 전세보갑아파트)',
      isFavorite: false,
      isActive: false
    }
  ],
  guideSummary: {
    match: 15,
    mismatch: 9,
    unchecked: 4
  },
  guideSteps: [
    {
      stepNumber: '1',
      title: '집 고를 때',
      match: 1,
      mismatch: 10,
      unchecked: 9,
      expanded: true,
      subSteps: [
        {
          id: '3-1',
          title: '가짜 임대인 구분하기',
          type: 'match' as const,
          content: '신흥사부동산중개인사무소의 홍길동 씨는 공인중개사 자격증을 소지하고 있습니다!'
        },
        {
          id: '3-2',
          title: '최우선변제 금액 안내',
          type: 'match' as const,
          content: '서울특별시',
          multiLine: true,
          details: [
            '소액보증금 범위 : 1억 5천만원 이하',
            '최우선변제금액 : 5천만원'
          ]
        },
        {
          id: '3-3',
          title: '공제증서 발급 안내',
          type: 'mismatch' as const,
          content: '공제증서 발급 요건이 불충족되었습니다.',
          hasLink: true,
          linkText: '온라인 서비스로 이동하기',
          linkHref: 'http://localhost:3000/online-service'
        }
      ]
    },
    {
      stepNumber: '2',
      title: '임대인 확인할 때',
      match: 3,
      mismatch: 2,
      unchecked: 1,
      expanded: false
    },
    {
      stepNumber: '3',
      title: '계약서 작성할 때',
      match: 5,
      mismatch: 1,
      unchecked: 0,
      expanded: false
    },
    {
      stepNumber: '4',
      title: '계약한 직후',
      match: 2,
      mismatch: 3,
      unchecked: 1,
      expanded: false
    },
    {
      stepNumber: '5',
      title: '입주한 이후',
      match: 1,
      mismatch: 2,
      unchecked: 2,
      expanded: false
    },
    {
      stepNumber: '6',
      title: '계약기간이 끝난 후',
      match: 2,
      mismatch: 1,
      unchecked: 1,
      expanded: false
    },
    {
      stepNumber: '7',
      title: '이런 상황에 휘말리지 않도록 유의하세요!',
      match: 1,
      mismatch: 0,
      unchecked: 0,
      expanded: false
    }
  ]
};

export default function MyPage() {
  const [selectedAddressId, setSelectedAddressId] = useState<string>('1');
  const [addresses, setAddresses] = useState(mockData.addresses);

  const selectedAddress = addresses.find(
    (addr) => addr.id === selectedAddressId
  );

  const handleAddressSelect = (id: string) => {
    setSelectedAddressId(id);
  };

  const handleAddressToggleFavorite = (id: string) => {
    setAddresses((prev) =>
      prev.map((addr) =>
        addr.id === id ? { ...addr, isFavorite: !addr.isFavorite } : addr
      )
    );
  };

  const handleAddressDelete = (id: string) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
    // 삭제된 주소가 선택된 주소였다면 첫 번째 주소로 변경
    if (id === selectedAddressId) {
      const remainingAddresses = addresses.filter((addr) => addr.id !== id);
      if (remainingAddresses.length > 0) {
        setSelectedAddressId(remainingAddresses[0].id);
      }
    }
  };

  return (
    <div className={styles.container}>
      {/* 그라데이션 배경 */}
      <div className={styles.gradientBackground}></div>
      
      {/* 프로필 헤더 (임시) */}
      <div className={styles.profileHeader}>
        <div className={styles.profileContent}>
          <div className={styles.avatar}>
            {mockData.profile.avatar}
          </div>
          <div className={styles.profileInfo}>
            <span className={styles.profileName}>{mockData.profile.name}</span>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        {/* 주소 */}
        <AddressDropDown
          addresses={addresses}
          selectedAddress={selectedAddress}
          onDelete={handleAddressDelete}
          onToggleFavorite={handleAddressToggleFavorite}
          onSelect={handleAddressSelect}
        />

        {/* 문서 카드 */}
        <div className={styles.card}>
          <div className={styles.cardTitle}>문서</div>
          <div className={styles.documentButtons}>
            <span className={styles.documentButton}>등기부등본</span>
            <span className={styles.documentButton}>납세증명서</span>
          </div>
        </div>

        {/* 가이드 결과 요약 */}
        <GuideResultSummary
          match={mockData.guideSummary.match}
          mismatch={mockData.guideSummary.mismatch}
          unchecked={mockData.guideSummary.unchecked}
        />

        {/* 가이드 결과 보기 */}
        <div className={styles.card}>
          <div className={styles.guideResultHeader}>
            <div className={styles.cardTitle}>가이드 결과 보기</div>
            <div className={styles.lastModified}>최종 수정 일자: 2025-08-06 17:37</div>
          </div>
          
          {/* 첫 번째 아코디언 위에 CircularIconBadge 3개 */}
          <div className={styles.iconBadgeContainer}>
            <CircularIconBadge type="match" size="sm" weight="thick" />
            <CircularIconBadge type="mismatch" size="sm" weight="thick" />
            <CircularIconBadge type="unchecked" size="sm" weight="thick" />
          </div>
          
          <div className={styles.guideSteps}>
            {mockData.guideSteps.map((step) => (
              <ResultAccordion
                key={step.stepNumber}
                stageNumber={`${step.stepNumber}단계`}
                subtitle={step.title}
                defaultOpen={step.expanded}
                numbers={[step.match.toString(), step.mismatch.toString(), step.unchecked.toString()]}
              >
                {step.subSteps && (
                  <div className={styles.stepContent}>
                    {step.subSteps.map((subStep) => (
                      <GuideStepItem 
                        key={subStep.id}
                        stepNumber={subStep.id} 
                        title={subStep.title}
                        showDivider={false}
                      >
                        <GuideStepContent>
                          <GuideStepRow iconType={subStep.type}>
                            <GuideStepText>
                              {subStep.content}
                            </GuideStepText>
                          </GuideStepRow>
                          {subStep.multiLine && subStep.details && (
                            <GuideStepRow iconType={subStep.type}>
                              <GuideStepText>
                                {subStep.details.map((detail, index) => (
                                  <p key={index}>{detail}</p>
                                ))}
                              </GuideStepText>
                            </GuideStepRow>
                          )}
                          {subStep.hasLink && (
                            <GuideStepRow iconType="link" href={subStep.linkHref}>
                              {subStep.linkText}
                            </GuideStepRow>
                          )}
                        </GuideStepContent>
                      </GuideStepItem>
                    ))}
                  </div>
                )}
              </ResultAccordion>
            ))}
          </div>
        </div>

        {/* 회원탈퇴 버튼 */}
        <div className={styles.withdrawButton}>
          <button className={styles.withdrawBtn}>
            회원탈퇴
          </button>
        </div>
      </div>
    </div>
  );
}
