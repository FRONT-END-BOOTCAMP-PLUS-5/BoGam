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
            <p className={styles['bold-main-text']} id={styles['bold-main-text-id']}>
              <span> 전세 계약 시 사기를 당하는 경우는 크게 </span>
              <span className={styles['underline-bold']}> 2가지 </span>
              <span> 입니다. </span>
            </p>
            <div className={styles['circle-and-text']}>
              <p className={styles['num-circle']}> 1 </p>
              <p className={styles['small-text']}> 월셋집을 전셋집으로 둔갑시킨 중개사 </p>
            </div>
            <div className={styles['circle-and-text']}>
              <p className={styles['num-circle']}> 2 </p>
              <p className={styles['small-text']}> 사용자님 말고 다른 세입자와 이중계약 </p>
            </div>

            <p className={styles['bold-main-text']}>
              전세보감은 이러한 피해를 막기 위해 다음을 제공합니다.
            </p>
            <div className={styles['circle-and-text']}>
              <p className={styles['num-circle']}> 1 </p>
              <p className={styles['small-text']}> 공인중개사 자격증 유무 조회 </p>
            </div>
            <div className={styles['circle-and-text']}>
              <p className={styles['num-circle']}> 2 </p>
              <p className={styles['small-text']}> 최우선 변제 기준 데이터 제공 </p>
            </div>
            <div className={styles['circle-and-text']}>
              <p className={styles['num-circle']}> 3 </p>
              <p className={styles['small-text']}> 공제 증서 안내 </p>
            </div>
            
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