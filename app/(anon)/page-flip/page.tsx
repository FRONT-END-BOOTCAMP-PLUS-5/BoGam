import { HTMLFlipBook } from './PageFlip';
import styles from './PageFlip.module.css'
import CircleAndText from './components/CircleAndText';
import GeneralPage from './components/GeneralPage';

export default function PageFlipPage() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center" style={{backgroundColor: '#EFF0F2'}}>
      <div className={styles['up-point']}></div>
      <div className={`${styles['flip-book']} box-book`}>
        <div className={styles['page-num-div']}>
          <button className={styles['page-num']}> 0 </button>
          <button className={styles['page-num']}> 1 </button>
          <button className={styles['page-num']}> 2 </button>
          <button className={styles['page-num']}> 3 </button>
        </div>
        <HTMLFlipBook
          className={styles.flipBook} 
          style={{}}
          startPage={0}
          size="fixed"
          width={300}
          height={400}
          minWidth={300}
          maxWidth={380}
          minHeight={400}
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
          <div className={`${styles['intro-page']} box-lg`}>
            <p className={styles['bold-main-text']} id={styles['bold-main-text-id']}>
              <span> 전세 계약 시 사기를 당하는 경우는 크게 </span>
              <span className={styles['underline-bold']}> 2가지 </span>
              <span> 입니다. </span>
            </p>
            <CircleAndText num={1} text='월셋집을 전셋집으로 둔갑시킨 중개사' />
            <CircleAndText num={2} text='사용자님 말고 다른 세입자와 이중계약' />

            <p className={styles['bold-main-text']}>
              전세보감은 이러한 피해를 막기 위해 다음을 제공합니다.
            </p>

            <CircleAndText num={1} text='공인중개사 자격증 유무 조회' />
            <CircleAndText num={2} text='최우선 변제 기준 데이터 제공' />
            <CircleAndText num={3} text='공제 증서 안내' />

          </div>

          <GeneralPage title='3-1단계 공인중개사 자격증 유무 조회'>
            무자격자가 중개업 등록증이나 자격증을 빌려서 
            중개사무소를 차리는 경우가 많아지고 있습니다. 
            이런 경우 공식적인 중개업 등록증이나 자격증을 
            소지하고 일하는 중개사무소보다 사기 위험이 
            더 높을 수 밖에 없습니다. 
            사업자상호(부동산 이름)과 중개업자 이름을 입력하면 
            전세보감이 증명된 중개업자인지 확인해드리겠습니다.
          </GeneralPage>

          <GeneralPage title='3-2단계 최우선변제 금액 안내'>
            주택임대차보호법 제8조를 따라 사용자님이 가장 <br />
            늦게 입주 세입자이더라도 최우선으로 <br />
            보증금을 변제 받을 수 있습니다. <br />
            이 기준은 지역마다 다릅니다. <br />
            전세보감이 초기 설정 때 작성한 매물 지역의 <br />
            최우선변제 금액을 안내해드리겠습니다
          </GeneralPage>

          <GeneralPage title='3-3단계 공제증서 발급 링크 안내'>
            공인중개사와의 중개 과정에서 발생할 수 있는 사고로
                  사용자님에게 손해를 입힐 수 있으므로
                  공제증서를 발급받는 것이 좋습니다.
                  현재 공제증서를 받는 방법으로는 구청이나 
                  시청에 방문하시거나 한국공인중개사협회 
                  온라인 서비스를 이용하셔야 됩니다. 
                  전세보감이 해당 온라인 서비스 링크를 
                  제공해드리곘습니다.
          </GeneralPage>

        </HTMLFlipBook>
      </div>
    </div>
  );
}