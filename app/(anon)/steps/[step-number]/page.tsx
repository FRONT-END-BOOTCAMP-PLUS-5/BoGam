'use client';

import {
  useEffect,
  useRef,
  useState
} from 'react';

import HTMLFlipBook from "react-pageflip";
import { styles } from './page.styles';
import GeneralPage from '@/(anon)/steps/[step-number]/_components/GeneralPage';
import SummaryPage from '@/(anon)/steps/[step-number]/_components/SummaryPage';
import StateIcon from '@/(anon)/_components/common/stateIcon/StateIcon';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
  content: string;
}

type PageData = SummaryPageData | GeneralPageData;

interface StepData {
  step: number;
  pages: PageData[];
}

export default function MiddleStepPage() {
  const router = useRouter();
  const bookRef = useRef<{ pageFlip?: { flip: (page: number) => void } }>(null);
  const [marginLeft, setMarginLeft] = useState('-73%');
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState<PageData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const match = window.location.pathname.match(/\/steps\/(\d+)/);
    const stepNumber = match ? match[1] : '1';
    import(`./stepData/${stepNumber}.json`)
      .then((data) => {
        if (Array.isArray(data.default)) {
          setPages(data.default[0]?.pages || []);
        } else if (data.default?.pages) {
          setPages(data.default.pages);
        } else if (Array.isArray(data)) {
          setPages(data[0]?.pages || []);
        } else if (data.pages) {
          setPages(data.pages);
        } else {
          setPages([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setPages([]);
        setLoading(false);
      });
  }, []);

  const totalPages = pages.length;
  const match = typeof window !== 'undefined' ? window.location.pathname.match(/\/steps\/(\d+)/) : null;
  const stepNumber = match ? match[1] : '1';

  const flipPages: React.ReactNode[] = [];
  pages.forEach((page: PageData, idx: number) => {
    if (page.type === 'summary') {
      flipPages.push(
        <div key={`summary-${idx}`} className={styles.flex}>
          <SummaryPage title={page.title ?? ''} contents={page.contents ?? []} stepNumber={stepNumber} />
        </div>
      );
    } else if (page.type === 'general') {
      flipPages.push(
        <div key={`general-${idx}`} className={styles.flex}>
          <GeneralPage title={page.title ?? ''} category={page.category ?? ''} content={page.content ?? ''} pageIdx={idx} stepNumber={stepNumber} />
        </div>
      );
    }
    if (idx < pages.length - 1) {
      flipPages.push(
        <div key={`empty-${idx}`} className={styles.page}>
          <div className={styles.pageContent} style={{ backgroundColor: 'var(--brand-light-gray)' }}></div>
        </div>
      );
    }
  });

  useEffect(() => {
    const width = window.innerWidth;
    if (width <= 400) {
      setMarginLeft('translateX(-45%)');
    } else if (width <= 430) {
      setMarginLeft('translateX(-42%)');
    } else {
      setMarginLeft('translateX(-37%)');
    }
  }, []);
  
  if (loading) return <div>데이터를 불러오는 중...</div>;
  
  return (
    <div className={styles.book}>
      <div className={styles.stateDiv}>
        <StateIcon completedCount={2} unconfirmedCount={1} warningCount={0} />
      </div>
      
      <HTMLFlipBook
        ref={bookRef}
        className={styles.demoBook}
        width={550}
        height={733}
        size="stretch"
        minWidth={315}
        maxWidth={1000}
        minHeight={400}
        maxHeight={1533}
        maxShadowOpacity={0.5}
        showCover={true}
        mobileScrollSupport={true}
        startPage={0}
        drawShadow={true}
        flippingTime={1000}
        usePortrait={false}
        style={marginLeft.startsWith('translateX') ? { transform: marginLeft, marginTop: 48 } : { marginLeft, marginTop: 48 }}
        startZIndex={0}
        autoSize={true}
        clickEventForward={true}
        useMouseEvents={true}
        swipeDistance={30}
        showPageCorners={false}
        disableFlipByClick={true}
        onFlip={(e: { data: number }) => {
          setCurrentPage(Math.floor((e.data + 1) / 2));
        }}
      >
        {flipPages}
      </HTMLFlipBook>
      
      <div className={styles.indicatorWrapper}>
        <div className={styles.indicatorLeft}>
          {currentPage === 0 && Number(stepNumber) > 1 && (
            <button
              className={styles.indicatorArrowBtn}
              aria-label="이전 단계로 이동"
              onClick={() => router.push(`/steps/${Number(stepNumber) - 1}`)}
            >
              <ChevronLeft size={22} color="#222" />
            </button>
          )}
        </div>
        <div className={styles.indicatorDots}>
          {Array.from({ length: totalPages }).map((_, j) => (
            <button
              key={j}
              className={`${styles.dot} ${j === currentPage ? styles.dotActive : ''} ${styles.indicatorDotBtn}`}
              aria-label={`slide ${j + 1}${j === currentPage ? ' (current)' : ''}`}
              onClick={() => {
                if (bookRef.current?.pageFlip?.flip) {
                  bookRef.current.pageFlip.flip(j * 2);
                }
              }}
            />
          ))}
        </div>
        <div className={styles.indicatorRight}>
          {currentPage === totalPages - 1 && Number(stepNumber) < 7 && (
            <button
              className={styles.indicatorArrowBtn}
              aria-label="다음 단계로 이동"
              onClick={() => router.push(`/steps/${Number(stepNumber) + 1}`)}
            >
              <ChevronRight size={22} color="#222" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}