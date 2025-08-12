"use client";

import Script from 'next/script';
import { useEffect } from 'react';
import styles from './PageFlip.module.css';

declare global {
  interface Window {
    $: any;
    jQuery: any;
  }
}

const PageFlip = () => {
  useEffect(() => {
    const initTurn = () => {
      if (typeof window !== 'undefined' && window.$ && window.$.fn && window.$.fn.turn) {
        const $book = window.$('#book');
        if ($book.length > 0) {
          try {
            if ($book.hasClass('turn-js')) {
              $book.turn('destroy');
            }
            $book.turn({
              gradients: true,
              acceleration: true,
              width: 400,
              height: 600,
              autoCenter: true,
              display: 'single'
            });
          } catch (error) {
            console.error(error);
          }
        }
      }
    };

    const checkScripts = () => {
      if (window.$ && window.$.fn && window.$.fn.turn) {
        initTurn();
      } else {
        setTimeout(checkScripts, 100);
      }
    };
    
    const timer = setTimeout(checkScripts, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleJQueryLoad = () => {
    console.log('jQuery loaded');
  };

  const handleTurnLoad = () => {
    console.log('Turn.js loaded');
  };

  return (
    <div>
      <Script
        src="https://code.jquery.com/jquery-3.4.1.min.js"
        strategy="beforeInteractive"
        onLoad={handleJQueryLoad}
      />
      <Script
        src="/js/turn.min.js"
        strategy="afterInteractive"
        onLoad={handleTurnLoad}
      />

      <div id="book">
        <div style={{ backgroundColor: 'red', width: '100%', height: '100%' }}>
          <h1>첫 번째 페이지입니다.</h1>
          <div className={styles.triangle}></div>
        </div>
        <div style={{ backgroundColor: 'yellow', width: '100%', height: '100%' }}> 두 번째 페이지입니다. </div>
        <div style={{ backgroundColor: 'green', width: '100%', height: '100%' }}> 세 번째 페이지입니다. </div>
        <div style={{ backgroundColor: 'blue', width: '100%', height: '100%' }}> 네 번째 페이지입니다. </div>
        <div style={{ backgroundColor: 'purple', width: '100%', height: '100%' }}> 다섯 번째 페이지입니다. </div>
        <div style={{ backgroundColor: 'pink', width: '100%', height: '100%' }}> 여섯 번째 페이지입니다. </div>
        <div style={{ backgroundColor: 'green', width: '100%', height: '100%' }}> 일곱 번째 페이지입니다. </div>
      </div>
    </div>
  );
}

export default PageFlip;