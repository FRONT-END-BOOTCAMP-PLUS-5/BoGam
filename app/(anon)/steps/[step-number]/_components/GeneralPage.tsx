import { styles } from './GeneralPage.styles';
import GoInsideButton from './GoInsideButton';

interface pageType {
  title: string;
  category: string;
  content: string | string[];
  pageIdx: number;
  stepNumber: string;
}

// \n을 <br> 태그로 변환하는 함수
const formatContent = (content: string | string[]): string => {
  if (Array.isArray(content)) {
    return content.join('\n').replace(/\n/g, '<br>');
  }
  return content.replace(/\n/g, '<br>');
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
          dangerouslySetInnerHTML={{ __html: formatContent(content) }}
          role="region"
          aria-label="단계별 상세 내용"
        />
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