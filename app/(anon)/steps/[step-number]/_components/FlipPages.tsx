import { ReactNode } from 'react';
import { styles } from './FlipPages.styles';
import GeneralPage from './GeneralPage';
import SummaryPage from './SummaryPage';

interface PageContent {
  subtitle: string;
  items: string[];
}

interface SummaryPageData {
  type: 'summary';
  title: string;
  contents: PageContent[];
}

interface GeneralPageData {
  type: 'general';
  title: string;
  category: string;
  content: string[];
}

type PageData = SummaryPageData | GeneralPageData;

interface FlipPagesProps {
  pages: PageData[];
  stepNumber: string;
}

export default function FlipPages({ pages, stepNumber }: FlipPagesProps): ReactNode[] {
  const flipPages: ReactNode[] = [];
  
  pages.forEach((page: PageData, idx: number) => {
    if (page.type === 'summary') {
      flipPages.push(
        <div key={`summary-${idx}`} className={styles.flex}>
          <SummaryPage
            title={page.title ?? ''}
            contents={page.contents ?? []}
            stepNumber={stepNumber}
          />
        </div>
      );
    } else if (page.type === 'general') {
      flipPages.push(
        <div key={`general-${idx}`} className={styles.flex}>
          <GeneralPage
            title={page.title ?? ''}
            category={page.category ?? ''}
            content={page.content ?? []}
            pageIdx={idx}
            stepNumber={stepNumber}
          />
        </div>
      );
    }
    
    // 페이지 사이에 빈 페이지 추가 (마지막 페이지 제외)
    if (idx < pages.length - 1) {
      flipPages.push(
        <div key={`empty-${idx}`} className={styles.page}>
          <div className={`${styles.pageContent} bg-brand-light-gray`}></div>
        </div>
      );
    }
  });

  return flipPages;
}

export type { PageData, SummaryPageData, GeneralPageData, PageContent };
