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
    <div className={bookCoverClass}>
      <div className={styles.leftDiv}>
        <div className={styles.leftFirst}></div>
        <div className={styles.leftCenter}></div>
        <div className={styles.leftCenter}></div>
        <div className={styles.leftCenter}></div>
        <div className={styles.leftLast}></div>
      </div>
      <div className={styles.rightContainer}>
        {/* 상단 영역 */}
        <div className={styles.rightFirstOutsideBox}>
          <div className={styles.rightFirstInsideBox}>
            <p className={styles.smallFont}> {title} </p>
          </div>
        </div>
        
        {/* 하단 영역 */}
        <div className={styles.whitePaper}>
          {contents.map((block, i) => (
            <div key={i}>
              <h6 className={styles.topic}>{block.subtitle}</h6>
              {block.items.map((item, j) => (
                <p key={j} className={styles.introContent}>{item}</p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
