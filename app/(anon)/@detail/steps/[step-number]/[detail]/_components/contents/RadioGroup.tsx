'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import styles from './RadioGroup.styles';
import { useGetStepResult } from '@/hooks/useStepResultQueries';
import { useStepResultMutations } from '@/hooks/useStepResultMutations';
import { useUserAddressStore } from '@libs/stores/userAddresses/userAddressStore';
import { parseStepUrl } from '@utils/stepUrlParser';
import RadioButtonGroup from '@/(anon)/_components/common/radioButtonGroup/RadioButtonGroup';
import Button from '@/(anon)/_components/common/button/Button';

interface ContentSection {
  title?: string;
  subtitle?: string;
  contents?: string[];
  messages?: string[];
  successMessages?: string[];
  link?: string;
  summary?: string;
}

interface RadioGroupProps {
  data: ContentSection[];
}

const RadioGroup = ({ data }: RadioGroupProps) => {
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [hasInitializedFromError, setHasInitializedFromError] = useState(false);
  const [contentData, setContentData] = useState<{
    successMessage?: string;
    errorMessage?: string;
    links?: Array<{ title: string; url: string }>;
    data?: ContentSection[][];
    sections?: Record<string, unknown>[]; // CombinedContent 타입에 대한 추가 필드
    dataType?: string; // dataType 속성 추가
  } | null>(null);
  
  // 초기화 여부를 추적하는 ref
  const hasInitialized = useRef(false);
  
  const queryClient = useQueryClient();
  const selectedAddress = useUserAddressStore((state) => state.selectedAddress);
  const { createOrUpdateStepResult } = useStepResultMutations();

  // URL 파싱 - ModalContent와 동일한 방식
  const pathname = window.location.pathname;
  const stepUrlData = parseStepUrl(pathname);
  const stepNumber = stepUrlData?.stepNumber || 1;
  const detail = stepUrlData?.detail || 1;

  // JSON 파일에서 메시지와 링크 데이터 로드
  useEffect(() => {
    console.log('🔍 JSON 파일 로드 useEffect 실행:', { stepNumber, detail });
    
    const loadContentData = async () => {
      if (!stepNumber || !detail) {
        console.log('❌ stepNumber 또는 detail 없음');
        return;
      }
      
      try {
        const contentModule = await import(
          `./data/step-${stepNumber}-${detail}-contents.json`
        );
        console.log('✅ JSON 파일 로드 성공:', contentModule.default);
        
        // CombinedContent 타입인 경우 RadioGroup 섹션을 찾아서 처리
        if (contentModule.default.dataType === 'CombinedContent') {
          const radioGroupSection = contentModule.default.sections.find(
            (section: Record<string, unknown>) => section.type === 'RadioGroup'
          );
          
          if (radioGroupSection) {
            // RadioGroup 섹션의 데이터를 contentData.data 형태로 변환하고 sections도 저장
            const transformedData = {
              ...contentModule.default,
              data: [radioGroupSection.data], // 2차원 배열로 변환
              sections: contentModule.default.sections // sections 정보도 저장
            };
            console.log('✅ CombinedContent에서 RadioGroup 데이터 추출:', transformedData);
            setContentData(transformedData);
          } else {
            console.log('❌ RadioGroup 섹션을 찾을 수 없음');
            setContentData(contentModule.default);
          }
        } else {
          // 기존 RadioGroup 타입인 경우 그대로 사용
          setContentData(contentModule.default);
        }
      } catch (error) {
        console.log('❌ Content data not found:', error);
      }
    };

    loadContentData();
  }, [stepNumber, detail]);

  // GET 요청
  const { data: stepData, isLoading, isError } = useGetStepResult({
    userAddressNickname: selectedAddress?.nickname || '',
    stepNumber: String(stepNumber),
    detail: String(detail)
  });

  // DB 저장 (useCallback으로 메모이제이션) - 전체 질문 저장
  const saveToDatabase = useCallback(async (answers: { [key: number]: string }) => {
    if (!selectedAddress?.id || !stepNumber || !detail || !contentData?.data) {
      console.error('필수 정보가 누락되었습니다.');
      return;
    }
    
    //default는 unchecked, 예는 match, 아니오는 mismatch
    const jsonDetails: Record<string, 'match' | 'mismatch' | 'unchecked'> = {};
    
    // 전체 JSON 데이터의 모든 질문에 대해 상태 설정
    contentData.data.forEach((pageData) => {
      pageData.forEach((section) => {
        if (section.title) {
          // 현재 페이지의 답변인지 확인
          const isCurrentPageQuestion = data.some((currentSection, currentIndex) => 
            currentSection.title === section.title && answers[currentIndex]
          );
          
          if (isCurrentPageQuestion) {
            // 현재 페이지의 답변 사용
            const currentIndex = data.findIndex(s => s.title === section.title);
            const answer = answers[currentIndex];
            jsonDetails[section.title] = answer === 'yes' ? 'match' : answer === 'no' ? 'mismatch' : 'unchecked';
          } else {
            // 기존 저장된 답변 유지 (없으면 unchecked)
            const existingAnswer = stepData?.jsonDetails?.[section.title];
            jsonDetails[section.title] = existingAnswer || 'unchecked';
          }
        }
      });
    });

    try {
      // 백그라운드에서 저장 (UI 업데이트에 영향 없음)
      createOrUpdateStepResult.mutate({
        userAddressId: selectedAddress.id,
        stepNumber: stepNumber,
        detail: detail,
        jsonDetails
      });

      // 동적으로 전체 질문 수 계산하여 로그 출력
      const totalQuestions = Object.keys(jsonDetails).length;
      console.log(`✅ 저장 시작 (전체 ${totalQuestions}문항):`, jsonDetails);
    } catch (error) {
      console.error('❌ 저장 실패:', error);
    }
  }, [selectedAddress?.id, stepNumber, detail, data, contentData, stepData, createOrUpdateStepResult]);

  // 라디오 버튼 변경 핸들러
  const handleRadioChange = (sectionIndex: number, value: string) => {
    const newSelectedAnswers = { ...selectedAnswers, [sectionIndex]: value };
    setSelectedAnswers(newSelectedAnswers);
    saveToDatabase(newSelectedAnswers);
  };

  // 정상 데이터로 초기화 (한 번만 실행)
  useEffect(() => {
    if (stepData?.jsonDetails && data.length > 0 && !hasInitialized.current) {
      const initialAnswers: { [key: number]: string } = {};
      
      data.forEach((section, index) => {
        if (section.title) {
          const matchingKey = Object.keys(stepData.jsonDetails).find(key => 
            key === section.title || (section.title && key.includes(section.title)) || (section.title && section.title.includes(key))
          );
          
          if (matchingKey) {
            const status = stepData.jsonDetails[matchingKey];
            if (status === 'match') initialAnswers[index] = 'yes';
            else if (status === 'mismatch') initialAnswers[index] = 'no';
          }
        }
      });
      
      setSelectedAnswers(initialAnswers);
      setHasInitializedFromError(false);
      hasInitialized.current = true;
    }
  }, [stepData, data]);

  // 에러 시 unchecked로 초기화
  useEffect(() => {
    if (isError && data.length > 0 && !hasInitializedFromError && !hasInitialized.current) {
      const uncheckedAnswers: { [key: number]: string } = {};
      
      data.forEach((section, index) => {
        if (section.title) uncheckedAnswers[index] = 'unchecked';
      });
      
      setSelectedAnswers(uncheckedAnswers);
      setHasInitializedFromError(true);
      hasInitialized.current = true;
      
      // 에러 시 바로 POST 요청
      if (selectedAddress?.id && stepNumber && detail) {
        saveToDatabase(uncheckedAnswers);
        
        // 쿼리 완전 중단
        const queryKey = ['stepResults', selectedAddress.nickname, String(stepNumber), String(detail)];
        queryClient.removeQueries({ queryKey });
      }
    }
  }, [isError, data, hasInitializedFromError, selectedAddress?.id, selectedAddress?.nickname, stepNumber, detail, queryClient, saveToDatabase]);

  // 전체 결과 상태 계산 (모든 페이지 데이터 종합)
  const calculateOverallResult = useCallback(() => {
    console.log('🔍 calculateOverallResult 호출됨');
    console.log('🔍 contentData:', contentData);
    console.log('🔍 stepData:', stepData);
    
    // CombinedContent 타입인 경우 sections 사용, 아니면 data 사용
    const dataSource = contentData?.dataType === 'CombinedContent' ? contentData.sections : contentData?.data;
    
    console.log('🔍 dataType:', contentData?.dataType);
    console.log('🔍 dataSource:', dataSource);
    console.log('🔍 contentData.sections:', contentData?.sections);
    console.log('🔍 contentData.data:', contentData?.data);
    
    if (!dataSource) {
      console.log('❌ dataSource 없음 (data 또는 sections)');
      return { allAnswered: false, hasMismatch: false };
    }
    
    if (!stepData?.jsonDetails) {
      console.log('❌ stepData.jsonDetails 없음');
      return { allAnswered: false, hasMismatch: false };
    }
    
    // 전체 질문 수 계산
    let totalQuestions = 0;
    let allQuestionTitles: string[] = [];
    
    if (contentData?.dataType === 'CombinedContent' && contentData.sections) {
      // CombinedContent 타입인 경우 sections에서 RadioGroup 섹션의 실제 질문들 추출
      const radioGroupSection = contentData.sections.find(section => section.type === 'RadioGroup');
      if (radioGroupSection && Array.isArray(radioGroupSection.data)) {
        allQuestionTitles = (radioGroupSection.data as Record<string, unknown>[])
          .filter((item: Record<string, unknown>) => item.title)
          .map((item: Record<string, unknown>) => item.title as string);
        totalQuestions = allQuestionTitles.length;
      }
    } else {
      // 기존 방식: data 배열에서 질문 제목 추출
      const flatData = (dataSource as ContentSection[][]).flat();
      totalQuestions = flatData.filter((section: ContentSection) => section.title).length;
      allQuestionTitles = flatData
        .filter((section: ContentSection) => section.title)
        .map(section => section.title as string);
    }
    
    console.log('🔍 전체 질문 수:', totalQuestions);
    console.log('🔍 모든 질문 제목:', allQuestionTitles);
    
    // 각 질문의 답변 상태 상세 확인
    console.log('🔍 stepData.jsonDetails 상세:', stepData.jsonDetails);
    
    const questionStatuses = allQuestionTitles.map(title => {
      const status = title ? stepData.jsonDetails[title] : null;
      console.log(`🔍 질문 "${title}" 상태:`, status);
      return { title, status };
    });
    console.log('🔍 모든 질문 상태:', questionStatuses);
    
    // 모든 질문이 답변되었는지 확인 (unchecked가 아닌지)
    const allAnswered = allQuestionTitles.every(title => {
      const hasAnswer = title && stepData.jsonDetails[title] && stepData.jsonDetails[title] !== 'unchecked';
      console.log(`🔍 질문 "${title}" 답변 여부:`, hasAnswer);
      return hasAnswer;
    });
    
    // mismatch가 있는지 확인
    const hasMismatch = allQuestionTitles.some(title => 
      title && stepData.jsonDetails[title] === 'mismatch'
    );
    
    console.log('🔍 최종 결과:', { totalQuestions, allAnswered, hasMismatch, jsonDetails: stepData.jsonDetails });
    
    return { allAnswered, hasMismatch };
  }, [contentData, stepData]);

  const { allAnswered, hasMismatch } = calculateOverallResult();

  // 로딩 상태
  if (typeof window === 'undefined' || (isLoading && !isError)) {
    return <div className={styles.container}><div className={styles.loadingContainer}>로딩 중...</div></div>;
  }

  // 메인 렌더링
  return (
    <div className={styles.container}>
      {data.map((section, sectionIndex) => (
        <div key={sectionIndex} className={styles.section}>
          {section.title && <div className={styles.sectionTitle}>{section.title}</div>}
          {section.subtitle && <div className={styles.sectionSubtitle}>{section.subtitle}</div>}
          
          <div className={styles.contentRow}>
            <div className={styles.contentColumn}>
              {section.contents?.map((content, contentIndex) => (
                <p key={contentIndex} className={styles.contentItem}>{content}</p>
              ))}
            </div>
            
            <div className={styles.radioColumn}>
              <RadioButtonGroup
                name={`section-${sectionIndex}`}
                options={[{ value: 'yes', label: '예' }, { value: 'no', label: '아니오' }]}
                defaultValue={selectedAnswers[sectionIndex] || ""}
                onChange={(value) => handleRadioChange(sectionIndex, value)}
                showYesNoLabels={true}
                disabled={isLoading}
              />
            </div>
          </div>
          
          {section.summary && <div className={styles.summary}>{section.summary}</div>}
          
          {/* 선택에 따른 메시지 표시 */}
          {selectedAnswers[sectionIndex] && selectedAnswers[sectionIndex] !== 'unchecked' && selectedAnswers[sectionIndex] !== '' && (
            (selectedAnswers[sectionIndex] === 'yes' && section.messages) || 
            (selectedAnswers[sectionIndex] === 'no' && section.successMessages) ? (
              <div className={styles.messagesContainer}>
                {selectedAnswers[sectionIndex] === 'yes' && section.messages && (
                  // '예' 선택 시 경고 메시지
                  section.messages.map((message, messageIndex) => (
                    <div key={messageIndex} className={styles.messageItem}>{message}</div>
                  ))
                )}
                {selectedAnswers[sectionIndex] === 'no' && section.successMessages && (
                  // '아니오' 선택 시 안전 메시지
                  section.successMessages.map((message, messageIndex) => (
                    <div key={messageIndex} className={styles.messageItem}>{message}</div>
                  ))
                )}
                {section.link && (
                  <div className={styles.linkContainer}>
                    <Link 
                      href={section.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className={styles.link}
                    >
                      관련 링크 보기 →
                    </Link>
                  </div>
                )}
              </div>
            ) : null
          )}
        </div>
      ))}

      {/* 결과 메시지 및 링크 - 마지막 페이지에서만 표시 */}
      {(() => {
        // 현재 페이지가 마지막 페이지인지 확인
        const isLastPage = contentData?.data && data.length > 0 && 
          contentData.data[contentData.data.length - 1].some(section => 
            section.title === data[0]?.title
          );
        
        console.log('🔍 결과 표시 조건 체크:', { 
          allAnswered, 
          contentData: !!contentData, 
          isLastPage,
          currentPageTitle: data[0]?.title,
          lastPageTitles: contentData?.data?.[contentData.data.length - 1]?.map(s => s.title)
        });
        
        // 마지막 페이지이고 모든 질문이 답변되었을 때만 결과 표시
        if (allAnswered && contentData && isLastPage) {
          return (
            <div className={styles.resultSection}>
              {hasMismatch ? (
                <div className={styles.errorMessage}>
                  {contentData.errorMessage || ''}
                </div>
              ) : (
                <div className={styles.successMessage}>
                  {contentData.successMessage || ''}
                    {contentData.links && contentData.links.length > 0 && (
                     <div className={styles.linksContainer}>
                       {contentData.links.map((link: { title: string; url: string }, index: number) => (
                         <Button 
                           key={index}
                           href={link.url} 
                           variant="primary"
                           className="min-w-[200px]"
                           target="_blank"
                           rel="noopener noreferrer"
                         >
                           {link.title}
                         </Button>
                       ))}
                     </div>
                   )}
                </div>
              )}
            </div>
          );
        }
        
        return null;
      })()}
    </div>
  );
};

export default RadioGroup;
