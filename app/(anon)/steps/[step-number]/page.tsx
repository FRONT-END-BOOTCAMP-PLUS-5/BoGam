'use client';

import { useEffect, useRef, useState } from 'react';

import HTMLFlipBook from 'react-pageflip';
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

export default function MiddleStepPage() {
  const router = useRouter();
  const bookRef = useRef<any>(null);
  const [marginLeft, setMarginLeft] = useState('-73%');
  const [currentPage, setCurrentPage] = useState(1); 
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
  const match =
    typeof window !== 'undefined'
      ? window.location.pathname.match(/\/steps\/(\d+)/)
      : null;
  const stepNumber = match ? match[1] : '1';

  const flipPages: React.ReactNode[] = [];
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
            content={page.content ?? ''}
            pageIdx={idx}
            stepNumber={stepNumber}
          />
        </div>
      );
    }
    if (idx < pages.length - 1) {
      flipPages.push(
        <div key={`empty-${idx}`} className={styles.page}>
          <div className={`${styles.pageContent} bg-brand-light-gray`}></div>
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
        key={`book-${currentPage}`}
        ref={bookRef}
        className={styles.demoBook}
        width={550}
        height={733}
        size='stretch'
        minWidth={315}
        maxWidth={1000}
        minHeight={400}
        maxHeight={1533}
        maxShadowOpacity={0.5}
        showCover={true}
        mobileScrollSupport={true}
        startPage={currentPage === 1 ? 0 : (currentPage - 1) * 2}
        drawShadow={true}
        flippingTime={1000}
        usePortrait={false}
        style={
          marginLeft.startsWith('translateX')
            ? { transform: marginLeft, marginTop: 48 }
            : { marginLeft, marginTop: 48 }
        }
        startZIndex={0}
        autoSize={true}
        clickEventForward={true}
        useMouseEvents={true}
        swipeDistance={30}
        showPageCorners={false}
        disableFlipByClick={false}
        onFlip={(e: { data: number }) => {
          const currentFlipPage = flipPages[e.data];
          if (currentFlipPage && typeof currentFlipPage === 'object' && 'key' in currentFlipPage) {
            const key = currentFlipPage.key as string;
            console.log('Current flip page key:', key);
            
            if (key && (key.startsWith('summary-') || key.startsWith('general-'))) {
              let pageIndex = 1;
              if (e.data === 0) {
                pageIndex = 1; 
              } else if (e.data === 2) {
                pageIndex = 2; 
              } else if (e.data === 4) {
                pageIndex = 3; 
              } else if (e.data === 6) {
                pageIndex = 4; 
              } else {
                pageIndex = Math.floor(e.data/2) + 1;
              }
              setCurrentPage(pageIndex);
            } else {
              let nextContentPage = 1;
              if (e.data === 1) {
                nextContentPage = 2; 
              } else if (e.data === 3) {
                nextContentPage = 3; 
              } else if (e.data === 5) {
                nextContentPage = 4;
              } else {
                nextContentPage=(e.data+3)/2;
              }
              setCurrentPage(nextContentPage);
            }
          } else {
            console.log('Invalid page data');
          }
        }}
      >
        {flipPages}
      </HTMLFlipBook>
      <div className={styles.indicatorWrapper}>
        <div className={styles.indicatorLeft}>
          {currentPage === 1 && Number(stepNumber) > 1 && (
            <button
              className={styles.indicatorArrowBtn}
              aria-label='이전 단계로 이동'
              onClick={() => router.push(`/steps/${Number(stepNumber) - 1}`)}
            >
              <ChevronLeft size={22} color='#222' />
            </button>
          )}
        </div>
        <div className={styles.indicatorDots}>
          {Array.from({ length: totalPages }).map((_, j) => {
            const isActive = (j + 1) === currentPage;
            const baseClasses = 'h-2 w-2 rounded-full transition-all duration-200 ease-in-out mx-[6px]';
            const dotClasses = `${baseClasses} ${isActive ? 'bg-brand-black' : 'bg-brand-light-gray'}`;
            
            return (
              <button
                key={j}
                className={dotClasses}

                aria-label={`slide ${j + 1}${
                  isActive ? ' (current)' : ''
                }`}
                onClick={() => {
                  const findFlipMethod = (obj: any, depth = 0): any => {
                    if (depth > 3) return null; 
                    if (!obj || typeof obj !== 'object') return null;
                    
                    const keys = Object.keys(obj);
                    
                    for (const key of keys) {
                      const value = obj[key];
                      
                      if (typeof value === 'function' && (key.includes('flip') || key.includes('page') || key.includes('go'))) {
                        return value;
                      }
                      
                      if (typeof value === 'object' && value !== null) {
                        const found = findFlipMethod(value, depth + 1);
                        if (found) return found;
                      }
                    }
                    return null;
                  };
                  
                  const flipMethod = findFlipMethod(bookRef.current);
                  
                  if (flipMethod) {
                    const flipBookPage = j === 0 ? 0 : j * 2;
                    
                    try {
                      
                      flipMethod(flipBookPage);
                      
                      setCurrentPage(j + 1);
                      
                    } catch (error) {
                      console.error('Error calling flip method:', error);
                    }
                  } else {
                    console.log('No flip method found in entire bookRef structure');
                  }
                }}
              />
            );
          })}
        </div>
        <div className={styles.indicatorRight}>
          {currentPage === totalPages && Number(stepNumber) < 7 && (
            <button
              className={styles.indicatorArrowBtn}
              aria-label='다음 단계로 이동'
              onClick={() => router.push(`/steps/${Number(stepNumber) + 1}`)}
            >
              <ChevronRight size={22} color='#222' />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
