import GuideResultSummary from './_components/GuideResultSummary';
import ResultAccordion from './_components/ResultAccordion';
import GuideStepItem from '@/(anon)/_components/common/guideStepItem/GuideStepItem';
import GuideStepRow from '@/(anon)/_components/common/guideStepContent/GuideStepRow';
import GuideStepText from '@/(anon)/_components/common/guideStepContent/GuideStepText';
import GuideStepMultiLineText from '@/(anon)/_components/common/guideStepContent/GuideStepMultiLineText';
import GuideStepLink from '@/(anon)/_components/common/guideStepContent/GuideStepLink';
import { styles } from './page.styles';

export default function MyPage() {
  // 랜덤 데이터 생성 (0~100 사이)
  const generateRandomValue = () => Math.floor(Math.random() * 101);
  
  const match = generateRandomValue();        // 안전
  const mismatch = generateRandomValue();      // 경고
  const unchecked = generateRandomValue();     // 미확인

  return (
    <div className={styles.mainContainer}>
      <div className={styles.container}>
        <h1 className={styles.title}>마이페이지</h1>
        
        {/* 가이드 결과 요약 컴포넌트 */}
        <GuideResultSummary 
          match={match}
          mismatch={mismatch}
          unchecked={unchecked}
        />

        {/* 결과 아코디언 섹션 */}
        <div className={styles.accordionSection}>
          <h2 className={styles.accordionTitle}>가이드 결과 상세</h2>
          
          <ResultAccordion 
            stageNumber="1단계" 
            subtitle="임대인 확인할 때" 
            defaultOpen={true}
            numbers={["1", "10", "9"]}
          >
            <GuideStepItem stepNumber="3-1" title="가짜 임대인 구분하기" showDivider={true}>
              <GuideStepRow iconType="match">
                <GuideStepText>
                  신흥사부동산중개인사무소의 홍길동 씨는 공인중개사 자격증을 소지하고 있습니다!
                </GuideStepText>
              </GuideStepRow>
            </GuideStepItem>

            <GuideStepItem stepNumber="3-2" title="최우선변제 금액 안내" showDivider={true}>
              <GuideStepRow iconType="unchecked">
                <GuideStepMultiLineText>
                  <p>서울특별시</p>
                  <p>소액보증금 범위 : 1억 5천만원 이하</p>
                  <p>최우선변제금액 : 5천만원</p>
                </GuideStepMultiLineText>
              </GuideStepRow>
            </GuideStepItem>

            <GuideStepItem stepNumber="3-3" title="공제증서 발급 안내">
              <GuideStepRow iconType="mismatch">
                <GuideStepText>
                  공제증서 발급 요건이 불충족되었습니다.
                </GuideStepText>
              </GuideStepRow>
              <GuideStepLink href="http://localhost:3000/">
                온라인 서비스로 이동하기
              </GuideStepLink>
            </GuideStepItem>
          </ResultAccordion>

          <ResultAccordion 
            stageNumber="2단계" 
            subtitle="계약서 확인할 때"
            numbers={["2", "8", "7"]}
          >
            <div className={styles.tempContent}>
              <p className={styles.tempText}>계약서 관련 상세 내용이 여기에 표시됩니다.</p>
              <p className={styles.tempText}>각 항목별로 확인해야 할 사항들을 정리해드립니다.</p>
            </div>
          </ResultAccordion>

          <ResultAccordion 
            stageNumber="3단계" 
            subtitle="입주 전 확인할 때"
            numbers={["3", "6", "5"]}
          >
            <div className={styles.tempContent}>
              <p className={styles.tempText}>입주 전 체크리스트가 여기에 표시됩니다.</p>
              <p className={styles.tempText}>안전하고 만족스러운 입주를 위한 가이드입니다.</p>
            </div>
          </ResultAccordion>
        </div>
      </div>
    </div>
  );
}
