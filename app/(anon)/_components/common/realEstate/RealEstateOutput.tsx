'use client';

import React from 'react';
import { RealEstateOutputProps, ApiResponse } from './types';
import { PdfViewer } from '../pdfViewer/PdfViewer';
import { styles } from './RealEstateOutput.styles';

export const RealEstateOutput: React.FC<RealEstateOutputProps> = ({
  response,
  loading,
}) => {
  // 로딩 중일 때
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.mainContainer}>
          <h2 className={styles.title}>응답 결과</h2>
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p className={styles.loadingText}>위험한 단어를 검색 중이에요 !</p>
            <p className={styles.loadingSubText}>
              다소 시간이 걸릴 수 있어요 !
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 데이터가 없을 때
  if (!response) {
    return (
      <div className={styles.container}>
        <div className={styles.mainContainer}>
          <h2 className={styles.title}>응답 결과</h2>
          <div className={styles.emptyContainer}>
            <p className={styles.emptyText}>등기부등본 데이터가 없어요 !</p>
            <p className={styles.emptyText}>혹시 주소를 선택하지 않으셨나요?</p>
          </div>
        </div>
      </div>
    );
  }

  // JSON 데이터에서 문자열이 있는 모든 컬럼들을 추출하는 함수
  const extractStringFields = (
    data: Record<string, unknown>
  ): Record<string, string> => {
    const stringFields: Record<string, string> = {};

    const processObject = (obj: unknown, prefix = '') => {
      if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
        Object.entries(obj).forEach(([key, value]) => {
          const fullKey = prefix ? `${prefix}.${key}` : key;

          if (typeof value === 'string' && value.trim() !== '') {
            stringFields[fullKey] = value;
          } else if (typeof value === 'object' && value !== null) {
            processObject(value, fullKey);
          }
        });
      }
    };

    processObject(data);
    return stringFields;
  };

  // 위험 단어 검색 함수
  const searchDangerousWords = (
    data: Record<string, unknown>
  ): Array<{ field: string; value: string; matchedWords: string[] }> => {
    const dangerousWords = ['압류', '가압류', '경매'];
    const results: Array<{
      field: string;
      value: string;
      matchedWords: string[];
    }> = [];

    const processObject = (obj: unknown, prefix = '') => {
      if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
        Object.entries(obj).forEach(([key, value]) => {
          const fullKey = prefix ? `${prefix}.${key}` : key;

          if (typeof value === 'string' && value.trim() !== '') {
            const matchedWords = dangerousWords.filter((word) =>
              value.includes(word)
            );

            if (matchedWords.length > 0) {
              results.push({
                field: fullKey,
                value: value,
                matchedWords: matchedWords,
              });
            }
          } else if (typeof value === 'object' && value !== null) {
            processObject(value, fullKey);
          }
        });
      }
    };

    processObject(data);
    return results;
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainContainer}>
        <h2 className={styles.title}>응답 결과</h2>

        <div
          className={`${styles.responseBox} ${
            response.success
              ? styles.responseBoxSuccess
              : styles.responseBoxError
          }`}
        >
          <div className={styles.responseHeader}>
            <span
              className={`${styles.responseStatus} ${
                response.success
                  ? styles.responseStatusSuccess
                  : styles.responseStatusError
              }`}
            >
              {response.success ? '✅ 성공' : '❌ 실패'}
            </span>
            {response.resultCode && (
              <span className={styles.responseCode}>
                코드: {response.resultCode}
              </span>
            )}
          </div>

          <div className={styles.responseMessage}>
            <strong>메시지:</strong> {response.message}
          </div>

          {response.error && (
            <div className={styles.responseError}>
              <strong>오류:</strong> {response.error}
            </div>
          )}

          {response.warning && (
            <div className={styles.responseWarning}>
              <strong>경고:</strong> {response.warning}
            </div>
          )}
        </div>

        {response.twoWayInfo && !response.requiresTwoWayAuth && (
          <div className={styles.twoWayContainer}>
            <h3 className={styles.twoWayTitle}>2-way 인증 정보</h3>
            <div className={styles.twoWayGrid}>
              <div className={styles.twoWayItem}>
                <strong>Method:</strong> {response.twoWayInfo.method}
              </div>
              <div className={styles.twoWayItem}>
                <strong>Job Index:</strong> {response.twoWayInfo.jobIndex}
              </div>
              <div className={styles.twoWayItem}>
                <strong>Thread Index:</strong> {response.twoWayInfo.threadIndex}
              </div>
              <div className={styles.twoWayItem}>
                <strong>JTI:</strong> {response.twoWayInfo.jti}
              </div>
              <div className={styles.twoWayItem}>
                <strong>Timestamp:</strong>{' '}
                {response.twoWayInfo.twoWayTimestamp}
              </div>
            </div>
          </div>
        )}

        {response.data && typeof response.data === 'object' && (
          <div className={styles.dangerousWordsSection}>
            <h3 className={styles.dangerousWordsTitle}>위험 단어 검색 결과</h3>
            {(() => {
              const dangerousResults = searchDangerousWords(
                response.data as Record<string, unknown>
              );

              if (dangerousResults.length === 0) {
                return (
                  <div className={styles.safeContainer}>
                    <div className={styles.safeIcon}>✅</div>
                    <p className={styles.safeText}>안전합니다!</p>
                    <p className={styles.safeSubText}>
                      &quot;압류&quot;, &quot;가압류&quot;, &quot;경매&quot;
                      관련 단어가 발견되지 않았습니다.
                    </p>
                  </div>
                );
              } else {
                return (
                  <div className={styles.dangerousContainer}>
                    <div className={styles.dangerousIcon}>⚠️</div>
                    <p className={styles.dangerousText}>
                      위험 단어가 {dangerousResults.length}개 발견되었습니다!
                    </p>
                    <div className={styles.dangerousResults}>
                      {dangerousResults.map((result, index) => (
                        <div key={index} className={styles.dangerousItem}>
                          <div className={styles.dangerousField}>
                            <strong>필드:</strong> {result.field}
                          </div>
                          <div className={styles.dangerousValue}>
                            <strong>내용:</strong> {result.value}
                          </div>
                          <div className={styles.dangerousMatches}>
                            <strong>발견된 단어:</strong>{' '}
                            {result.matchedWords.map((word, wordIndex) => (
                              <span
                                key={wordIndex}
                                className={styles.dangerousWord}
                              >
                                {word}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
            })()}
          </div>
        )}

        {response?.data?.data &&
        typeof response.data.data === 'object' &&
        'resOriGinalData' in response.data.data &&
        typeof (response.data.data as Record<string, unknown>)
          .resOriGinalData === 'string' ? (
          <div className={styles.pdfSection}>
            <h3 className={styles.pdfTitle}>등기부등본 PDF</h3>
            <PdfViewer
              base64={
                (response.data.data as Record<string, unknown>)
                  .resOriGinalData as string
              }
              fileName='등기부등본.pdf'
            />
          </div>
        ) : null}

        {response.data && (
          <div className={styles.jsonSection}>
            <h3 className={styles.jsonTitle}>전체 JSON 데이터</h3>
            <div className={styles.jsonContainer}>
              <pre className={styles.jsonPre}>
                {JSON.stringify(response.data, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
