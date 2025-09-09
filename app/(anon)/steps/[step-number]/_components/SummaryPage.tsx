import { styles } from './SummaryPage.styles';

interface SummaryPageProps {
  title: string;
  contents: { subtitle: string; items: string[] }[];
  stepNumber: string;
}

export default function SummaryPage({ title, contents, stepNumber }: SummaryPageProps) {
  const isEarlyStep = ['1', '2', '3'].includes(stepNumber);
  const bookCoverClass = isEarlyStep
    ? styles.bookCover
    : styles.bookCoverGreen;
  return (
    <article className={bookCoverClass} role="article" aria-labelledby={`summary-title-${stepNumber}`}>
      <div className={styles.leftDiv} role="presentation" aria-hidden="true">
        <div className={styles.leftFirst}></div>
        <div className={styles.leftCenter}></div>
        <div className={styles.leftCenter}></div>
        <div className={styles.leftCenter}></div>
        <div className={styles.leftLast}></div>
      </div>
      <div className={styles.rightContainer}>
        {/* 상단 영역 */}
        <header className={styles.rightFirstOutsideBox}>
          <h2 
            id={`summary-title-${stepNumber}`} 
            className={styles.summaryTitle}
          >
            {title}
          </h2>
        </header>
        
        {/* 하단 영역 */}
        <main className={styles.whitePaper} role="main" aria-label="요약 내용">
          {contents.map((block, i) => (
            <section key={i} aria-labelledby={`summary-subtitle-${stepNumber}-${i}`}>
              <h3 id={`summary-subtitle-${stepNumber}-${i}`} className={styles.topic}>
                {block.subtitle}
              </h3>
              <ul role="list" aria-label={`${block.subtitle} 항목들`}>
                {block.items.map((item, j) => (
                  <li key={j} className={styles.introContent} role="listitem">
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </main>
      </div>
    </article>
  );
}
