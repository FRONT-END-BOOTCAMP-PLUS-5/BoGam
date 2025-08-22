import { SummaryPageStyles } from './SummaryPage.styles';

interface SummaryPageProps {
  title: string;
  contents: { subtitle: string; items: string[] }[];
  stepNumber: string;
}

export default function SummaryPage({ title, contents, stepNumber }: SummaryPageProps) {
  const isEarlyStep = ['1', '2', '3'].includes(stepNumber);
  const generalPageClass = isEarlyStep
    ? SummaryPageStyles.generalPage
    : SummaryPageStyles.generalPageGreen;
  return (
    <div className={generalPageClass}>
      <div className={SummaryPageStyles.leftDiv}>
        <div className={SummaryPageStyles.leftFirst}></div>
        <div className={SummaryPageStyles.leftCenter}></div>
        <div className={SummaryPageStyles.leftCenter}></div>
        <div className={SummaryPageStyles.leftCenter}></div>
        <div className={SummaryPageStyles.leftLast}></div>
      </div>
      <div>
        <div className={SummaryPageStyles.rightFirstOutsideBox}>
          <div className={SummaryPageStyles.rightFirstInsideBox}>
            <p className={SummaryPageStyles.smallFont}> {title} </p>
          </div>
        </div>
        <div className={SummaryPageStyles.whitePaper + ' max-h-[340px] overflow-y-auto'}>
          {contents.map((block, i) => (
            <div key={i}>
              <h6 className={SummaryPageStyles.topic}>{block.subtitle}</h6>
              {block.items.map((item, j) => (
                <p key={j} className={SummaryPageStyles.introContent}>{item}</p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
