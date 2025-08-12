'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import styles from '@/(anon)/_components/onboarding/Onboarding.module.css';

type Props = {
  onSkipToAuth: () => void; // 마지막 이전 슬라이드에서 Skip 누르면 인증으로
  onDoneToAuth: () => void; // 마지막 슬라이드에서 시작하기 → 인증으로
};

const SLIDES = [
  {
    icon: '🔍',
    title: '전세 정보 검색',
    desc: '원하는 지역의 전세 매물 정보를 한눈에 확인하세요',
  },
  {
    icon: '🧭',
    title: '주소만 입력',
    desc: '등기·실거래·보증여부를 한 번에 조회합니다',
  },
  {
    icon: '📑',
    title: '7단계 체크리스트',
    desc: '위험 요소를 단계별로 쉽게 점검해요',
  },
  {
    icon: '📊',
    title: '시세 분석',
    desc: '정확한 시세 분석으로 합리적인 전세 계약을 도와드립니다',
  },
];

export default function Onboarding({ onSkipToAuth, onDoneToAuth }: Props) {
  const [i, setI] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);
  const dx = useRef(0);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  const last = SLIDES.length - 1;

  const go = useCallback(
    (idx: number) => {
      setI(Math.max(0, Math.min(last, idx)));
    },
    [last]
  );

  // 터치 드래그
  const onTouchStart = (e: React.TouchEvent) => {
    setDragging(true);
    startX.current = e.touches[0].clientX;
    dx.current = 0;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!dragging) return;
    dx.current = e.touches[0].clientX - startX.current;
    viewportRef.current?.classList.add(styles.dragging);
  };
  const onTouchEnd = () => {
    setDragging(false);
    viewportRef.current?.classList.remove(styles.dragging);
    const threshold = 60;
    if (dx.current < -threshold) go(i + 1);
    else if (dx.current > threshold) go(i - 1);
    dx.current = 0;
  };

  // 마우스 드래그(개발 편의)
  const onMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    startX.current = e.clientX;
    dx.current = 0;
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    dx.current = e.clientX - startX.current;
    viewportRef.current?.classList.add(styles.dragging);
  };
  const onMouseUp = () => onTouchEnd();
  const onMouseLeave = () => dragging && onTouchEnd();

  // 키보드 보조
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(i + 1);
      if (e.key === 'ArrowLeft') go(i - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [i, go]);

  const percentOffset =
    -i * 100 +
    (dragging
      ? (dx.current / (viewportRef.current?.clientWidth || 1)) * 100
      : 0);

  return (
    <main
      className={styles.container}
      aria-roledescription='carousel'
      aria-live='polite'
    >
      {/* 마지막 슬라이드에서는 Skip 숨김 */}
      <header className={styles.header}>
        {i !== last && (
          <button className={styles.skip} onClick={onSkipToAuth}>
            Skip
          </button>
        )}
      </header>

      <section
        ref={viewportRef}
        className={styles.viewport}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      >
        <div
          className={styles.track}
          style={{ transform: `translate3d(${percentOffset}%, 0, 0)` }}
        >
          {SLIDES.map((s, idx) => (
            <div
              key={idx}
              className={styles.slideWrap}
              role='group'
              aria-label={`${idx + 1} / ${SLIDES.length}`}
            >
              <div className={styles.content}>
                <div className={styles.icon} aria-hidden>
                  {s.icon}
                </div>
                <h2 className={styles.title}>{s.title}</h2>
                <p className={styles.desc}>{s.desc}</p>

                <div className={styles.dots} aria-label='slides'>
                  {SLIDES.map((_, j) => (
                    <button
                      key={j}
                      className={`${styles.dot} ${
                        j === i ? styles.dotActive : ''
                      }`}
                      aria-label={`slide ${j + 1}${
                        j === i ? ' (current)' : ''
                      }`}
                      onClick={() => go(j)}
                    />
                  ))}
                </div>

                {/* 마지막 슬라이드에서만 시작하기 */}
                {idx === last && i === last && (
                  <button className={styles.startBtn} onClick={onDoneToAuth}>
                    시작하기
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className={styles.footer} />
    </main>
  );
}
