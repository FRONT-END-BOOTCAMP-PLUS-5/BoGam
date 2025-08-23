'use client';

import React, { useState, useEffect, useRef } from 'react';
import { styles } from './CheckListGroup.styles';
import { useGetStepResult } from '@/hooks/useStepResultQueries';
import { useStepResultMutations } from '@/hooks/useStepResultMutations';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import { parseStepUrl } from '@utils/stepUrlParser';
import CircularIconBadge from '@/(anon)/_components/common/circularIconBadges/CircularIconBadge';

interface ChecklistItem {
  id: string;
  text: string;
}

interface ChecklistGroup {
  title: string;
  items: ChecklistItem[];
}

interface ContentSection {
  title?: string;
  description?: string[];
  checklistGroups?: ChecklistGroup[];
  summary?: string;
  link?: string;
}

interface CheckListGroupProps {
  data: ContentSection[];
}

const CheckListGroup = ({ data }: CheckListGroupProps) => {
  // 로컬 상태로 즉시 UI 반응
  const [localStepDetails, setLocalStepDetails] = useState<Record<string, 'match' | 'mismatch' | 'unchecked'>>({});
  
  // 초기화 여부를 추적하는 ref
  const hasInitialized = useRef(false);
  
  const selectedAddress = useUserAddressStore((state) => state.selectedAddress);
  const { upsertStepResult, removeQueries } = useStepResultMutations();

  // URL에서 현재 stepNumber와 detail 가져오기
  const pathname = window.location.pathname;
  const stepUrlData = parseStepUrl(pathname);
  const stepNumber = stepUrlData?.stepNumber || 1;
  const detail = stepUrlData?.detail || 1;

  // GET 요청 - 현재 페이지의 stepNumber와 detail 사용
  const { data: stepData, isLoading, isError } = useGetStepResult({
    userAddressNickname: selectedAddress?.nickname || '',
    stepNumber: String(stepNumber),
    detail: String(detail)
  });

  // DB 데이터를 로컬 상태와 동기화
  useEffect(() => {
    if (stepData?.jsonDetails) {
      setLocalStepDetails(stepData.jsonDetails);
    }
  }, [stepData?.jsonDetails]);

  // 에러 시 unchecked로 초기화
  useEffect(() => {
    if (!isError || data.length === 0 || hasInitialized.current) {
      return;
    }
    
    // 체크리스트 항목이 실제로 존재하는지 확인
    let hasChecklistItems = false;
    const uncheckedDetails: Record<string, 'unchecked'> = {};
    
    data.forEach((section) => {
      if (section.checklistGroups) {
        section.checklistGroups.forEach((group) => {
          if (group.items && group.items.length > 0) {
            hasChecklistItems = true;
            group.items.forEach((item) => {
              uncheckedDetails[item.id] = 'unchecked';
            });
          }
        });
      }
    });
    
    // 체크리스트 항목이 실제로 존재할 때만 초기화 진행
    if (hasChecklistItems && Object.keys(uncheckedDetails).length > 0 && selectedAddress?.id) {
      console.log('🔍 CheckListGroup: 400 에러 시 초기화 진행', uncheckedDetails);
      
      // 로컬 상태도 즉시 업데이트
      setLocalStepDetails(uncheckedDetails);
      
      // DB 저장 (upsert 사용)
      upsertStepResult.mutate({
        userAddressId: selectedAddress.id,
        stepNumber: stepNumber,
        detail: detail,
        jsonDetails: uncheckedDetails
      });
      
      // 쿼리 완전 중단
      removeQueries(selectedAddress.nickname, stepNumber, detail);
      
      hasInitialized.current = true;
    } else {
      console.log('🔍 CheckListGroup: 체크리스트 항목이 없어 초기화 건너뜀', { data, uncheckedDetails });
    }
  }, [isError, data, selectedAddress?.id, selectedAddress?.nickname, stepNumber, detail, upsertStepResult, removeQueries]);

  // Step Result 업데이트 핸들러 - 즉시 로컬 상태 업데이트 후 백그라운드에서 DB 저장
  const handleStepResultUpdate = (newDetails: Record<string, 'match' | 'mismatch' | 'unchecked'>) => {
    // 즉시 로컬 상태 업데이트 (UI 반응성 향상)
    setLocalStepDetails(newDetails);
    
    // 백그라운드에서 DB 저장 - upsert 직접 사용
    if (selectedAddress?.id) {
      upsertStepResult.mutate({
        userAddressId: selectedAddress.id,
        stepNumber: stepNumber,
        detail: detail,
        jsonDetails: newDetails
      });
    }
  };

  // 로딩 중일 때
  if (isLoading && !isError) {
    return <div className={styles.container}><div className={styles.loadingContainer}>로딩 중...</div></div>;
  }

  return (
    <div className={styles.container}>
      {data.map((section, sectionIndex) => (
        <div key={sectionIndex} className={styles.section}>
          {section.title && <div className={styles.sectionTitle}>{section.title}</div>}
          
          {section.description && (
            <div className={styles.descriptionContainer}>
              {section.description.map((desc, descIndex) => (
                <p key={descIndex} className={styles.descriptionItem}>{desc}</p>
              ))}
            </div>
          )}
          
          {/* 계층 구조 체크리스트 */}
          {section.checklistGroups && (
            <div className={styles.checklistGroupsContainer}>
              {section.checklistGroups.map((group, groupIndex) => (
                <div key={groupIndex} className={styles.checklistGroup}>
                  <div className={styles.groupTitle}>{group.title}</div>
                  <div className={styles.checklistContainer}>
                    {group.items.map((item, itemIndex) => {
                      const currentStatus = localStepDetails[item.id] || 'unchecked';
                      return (
                        <div key={itemIndex} className={styles.checklistItem}>
                          <div className={styles.checklistText}>{item.text}</div>
                          <div className={styles.checklistBadge}>
                            <CircularIconBadge 
                              type={currentStatus}
                              size="sm"
                              clickable={currentStatus === 'unchecked' || currentStatus === 'match'}
                              stepData={{
                                stepNumber: stepNumber,
                                detail: detail,
                                userAddressId: selectedAddress?.id || 1,
                                currentDetails: localStepDetails,
                                currentKey: item.id,
                                onStepResultUpdate: handleStepResultUpdate
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {section.summary && <div className={styles.summary}>{section.summary}</div>}
        </div>
      ))}
    </div>
  );
};

export default CheckListGroup;
