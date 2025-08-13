import { HTMLFlipBook } from './PageFlip';
import styles from './PageFlip.module.css'

export default function PageFlipPage() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <div className={styles['up-point']}></div>
      <div className={styles['page-num-div']}>
        <button className={styles['page-num']}> 0 </button>
        <button className={styles['page-num']}> 1 </button>
        <button className={styles['page-num']}> 2 </button>
        <button className={styles['page-num']}> 3 </button>
      </div>
      <div className={styles['flip-book']}>
        <HTMLFlipBook
          className={styles.flipBook}
          style={{}}
          startPage={0}
          size="fixed"
          width={380}
          height={450}
          minWidth={380}
          maxWidth={380}
          minHeight={450}
          maxHeight={250}
          drawShadow={true}
          flippingTime={1000}
          usePortrait={true}
          startZIndex={0}
          autoSize={false}
          maxShadowOpacity={0.5}
          showCover={false}
          mobileScrollSupport={false}
          clickEventForward={true}
          useMouseEvents={true}
          swipeDistance={30}
          showPageCorners={true}
          disableFlipByClick={false}
        >
          <div className={styles['intro-page']}>
            <h1>Page 1</h1>
          </div>
          <div className="page-2 w-full h-full bg-red-200 flex items-center justify-center">
            <h1>Page 2</h1>
          </div>
          <div className="page-3 w-full h-full bg-green-200 flex items-center justify-center">
            <h1>Page 3</h1>
          </div>
        </HTMLFlipBook>
      </div>
    </div>
  );
}