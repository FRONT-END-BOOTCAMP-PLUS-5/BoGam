import { styles } from './GeneralPage.styles';
import GoInsideButton from './GoInsideButton';

interface pageType {
  title: string;
  category: string;
  content: string[];
  pageIdx: number;
  stepNumber: string;
}

// content를 렌더링하는 함수
const renderContent = (content: string[]) => {
  return content.map((paragraph, index) => {
    // 빈 문자열인 경우 빈 줄로 처리
    if (paragraph === '') {
      return <div key={index} className={styles.emptyLine}></div>;
    }
    // 일반 문단인 경우
    return (
      <p key={index} className={styles.paragraph}>
        {paragraph}
      </p>
    );
  });
};

export default function GeneralPage({
  title,
  category,
  content,
  pageIdx,
  stepNumber,
}: pageType) {

  return (
    <article className={styles.contents} role="article" aria-labelledby={`step-title-${pageIdx}`}>
      {/* 상단 */}
      <header className={styles.topSection}>
        <h2 id={`step-title-${pageIdx}`} className={styles.smallFont}>
          {title}
        </h2>
      </header>
      
      {/* 중간 */}
      <section className={styles.middleSection} aria-labelledby={`step-category-${pageIdx}`}>
        <h3 id={`step-category-${pageIdx}`} className={styles.danger}>
          {category}
        </h3>
        <div
          className={styles.content}
          role="region"
          aria-label="단계별 상세 내용"
        >
          {renderContent(content)}
        </div>
      </section>
      
      {/* 하단 */}
      <footer className={styles.bottomSection}>
        <GoInsideButton
          stepNumber={stepNumber}
          pageIdx={pageIdx}
        />
      </footer>
    </article>
  );
}