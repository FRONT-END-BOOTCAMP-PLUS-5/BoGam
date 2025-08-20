'use client';

export default Steps3Page;

import React, {
  ReactElement,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import { PageFlip } from 'page-flip';
import HTMLFlipBook from "react-pageflip";
import { IFlipSetting, IEventProps } from './settings';
import { styles } from './page.styles';
import GeneralPage from '../_components/GeneralPage';
import StateIcon from '../../_components/common/stateIcon/StateIcon';
import onboardingStyles from '@/(anon)/_components/onboarding/Onboarding.module.css';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface IProps extends IFlipSetting, IEventProps {
  className: string;
  style: React.CSSProperties;
  children: React.ReactNode;
  renderOnlyPageLengthChange?: boolean;
}

const HTMLFlipBookForward = React.forwardRef<PageFlip, IProps>(
  (props, ref) => {
    const htmlElementRef = useRef<HTMLDivElement>(null);
    const childRef = useRef<HTMLElement[]>([]);
    const pageFlip = useRef<PageFlip | null>(null);

    const [pages, setPages] = useState<ReactElement[]>([]);

    useImperativeHandle(ref, () => pageFlip.current as PageFlip, [pageFlip.current]);

    const refreshOnPageDelete = useCallback(() => {
    }, []);

    const removeHandlers = useCallback(() => {
      const flip = pageFlip.current;
      if (flip) {
        if (typeof flip.off === 'function') {
          flip.off('flip');
          flip.off('changeOrientation');
          flip.off('changeState');
          flip.off('init');
          flip.off('update');
        }
      }
    }, []);

    useEffect(() => {
      childRef.current = [];
      if (props.children) {
        const childList = React.Children.map(props.children, (child, idx) => {
          return React.cloneElement(child as ReactElement, {
            key: idx,
          });
        }) || [];

        if (!props.renderOnlyPageLengthChange || pages.length !== childList.length) {
          if (childList.length < pages.length) {
            refreshOnPageDelete();
          }
          setPages(childList);
        }
      }
    }, [props.children, pages.length, refreshOnPageDelete, props.renderOnlyPageLengthChange]);

    useEffect(() => {
      const setHandlers = () => {
        const flip = pageFlip.current;
        if (flip) {
          if (props.onFlip && typeof flip.on === 'function') {
            flip.on('flip', (e: unknown) => props.onFlip && props.onFlip(e));
          }
          if (props.onChangeOrientation && typeof flip.on === 'function') {
            flip.on('changeOrientation', (e: unknown) => props.onChangeOrientation && props.onChangeOrientation(e));
          }
          if (props.onChangeState && typeof flip.on === 'function') {
            flip.on('changeState', (e: unknown) => props.onChangeState && props.onChangeState(e));
          }
          if (props.onInit && typeof flip.on === 'function') {
            flip.on('init', (e: unknown) => props.onInit && props.onInit(e));
          }
          if (props.onUpdate && typeof flip.on === 'function') {
            flip.on('update', (e: unknown) => props.onUpdate && props.onUpdate(e));
          }
        }
      };

      if (pages.length > 0 && childRef.current.length > 0) {
        removeHandlers();
        if (htmlElementRef.current && !pageFlip.current) {
          pageFlip.current = new PageFlip(htmlElementRef.current, props as any);
        }
        if (pageFlip.current && typeof pageFlip.current.getFlipController === 'function' && !pageFlip.current.getFlipController()) {
          pageFlip.current.loadFromHTML(childRef.current);
        } else if (pageFlip.current && typeof pageFlip.current.updateFromHtml === 'function') {
          pageFlip.current.updateFromHtml(childRef.current);
        }
        setHandlers();
      }
    }, [pages, props, removeHandlers]);

    return (
      <div ref={htmlElementRef} className={props.className} style={props.style}>
        {pages}
      </div>
    );
  }
);

function SummaryPage({ title, contents }: { title: string; contents: { subtitle: string; items: string[] }[] }) {
  return (
    <div className={styles.generalPage}>
      <div className={styles.left}>
        <div className={styles.firstLeftBox}></div>
        <div className={styles.leftBox}></div>
        <div className={styles.leftBox}></div>
        <div className={styles.leftBox}></div>
        <div className={styles.lastLeftBox}></div>
      </div>
      <div>
        <div className={styles.rightFirstOutsideBox}>
          <div className={styles.rightFirstInsideBox}>
            <p className={styles.smallFont}> {title} </p>
          </div>
        </div>
  <div className={styles.whitePaper + ' max-h-[340px] overflow-y-auto'}>
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
  )
}

export function Steps3Page() {
  const router = useRouter();
  const bookRef = React.useRef<any>(null);
  const [marginLeft, setMarginLeft] = React.useState('-73%');
  const [currentPage, setCurrentPage] = React.useState(0);
  const [pages, setPages] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
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
  pages.forEach((page: any, idx: number) => {
    if (page.type === 'summary') {
      flipPages.push(
        <div key={`summary-${idx}`} className={styles.flex}>
          <SummaryPage title={page.title ?? ''} contents={page.contents ?? []} />
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
          <div className={styles.pageContent}></div>
        </div>
      );
    }
  });

  React.useEffect(() => {
    const width = window.innerWidth;
    setMarginLeft(width <= 400 ? '-99%' : '-73%');
  }, []);
  if (loading) return <div>데이터를 불러오는 중...</div>;
  return (
    <div className={styles.book}>
      <div style={{ position: 'absolute', top: '13%', left: '50%', transform: 'translateX(-50%)', zIndex: 100 }}>
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
        style={{ marginLeft: '-50%', marginTop: 48 }}
        startZIndex={0}
        autoSize={true}
        clickEventForward={true}
        useMouseEvents={true}
        swipeDistance={30}
        showPageCorners={false}
        disableFlipByClick={true}
        onFlip={(e: any) => {
          setCurrentPage(Math.floor((e.data + 1) / 2));
        }}
      >
        {flipPages}
      </HTMLFlipBook>
      <div className={styles.indicatorWrapper}>
        <div className={styles.indicatorLeft}>
          {currentPage === 0 && (
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
              className={`${onboardingStyles.dot} ${j === currentPage ? onboardingStyles.dotActive : ''} ${styles.indicatorDotBtn}`}
              aria-label={`slide ${j + 1}${j === currentPage ? ' (current)' : ''}`}
              onClick={() => bookRef.current?.pageFlip?.flip(j * 2)}
              style={{ background: j === currentPage ? '#000000' : '#A7A8A9' }}
            />
          ))}
        </div>
        <div className={styles.indicatorRight}>
          {currentPage === totalPages - 1 && (
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