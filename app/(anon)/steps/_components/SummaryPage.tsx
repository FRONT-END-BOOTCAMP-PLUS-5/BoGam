import { summaryPageStyles } from './SummaryPage.styles';

interface SummaryPageProps {
  title: string;
  contents: { subtitle: string; items: string[] }[];
}

export default function SummaryPage({ title, contents }: SummaryPageProps) {
  return (
    <div className={summaryPageStyles.generalPage}>
      <div className={summaryPageStyles.leftDiv}>
        <div className={summaryPageStyles.leftFirst}></div>
        <div className={summaryPageStyles.leftCenter}></div>
        <div className={summaryPageStyles.leftCenter}></div>
        <div className={summaryPageStyles.leftCenter}></div>
        <div className={summaryPageStyles.leftLast}></div>
      </div>
      <div>
        <div className={summaryPageStyles.rightFirstOutsideBox}>
          <div className={summaryPageStyles.rightFirstInsideBox}>
            <p className={summaryPageStyles.smallFont}> {title} </p>
          </div>
        </div>
        <div className={summaryPageStyles.whitePaper + ' max-h-[340px] overflow-y-auto'}>
          {contents.map((block, i) => (
            <div key={i}>
              <h6 className={summaryPageStyles.topic}>{block.subtitle}</h6>
              {block.items.map((item, j) => (
                <p key={j} className={summaryPageStyles.introContent}>{item}</p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
