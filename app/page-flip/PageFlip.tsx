"use client";

import Script from 'next/script';
import { useEffect } from 'react';

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
    const timer = setTimeout(initTurn, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <Script 
        src="/js/jquery-3.4.1.min.js"
        strategy="beforeInteractive"
      />
      <Script 
        src="/js/turn.min.js"
        strategy="afterInteractive"
      />

      <div id="book">
        <div style={{ backgroundColor: 'red', width: '100%', height: '100%' }}> 첫 번째 페이지입니다. </div>
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