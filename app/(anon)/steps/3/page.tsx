'use client'

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
import { pageStyles } from './pageStyles';
import GeneralPage from './components/GeneralPage';

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




export default function Steps3Page() {
    const bookRef = React.useRef<any>(null);
    const [marginLeft, setMarginLeft] = React.useState('-50%');
    React.useEffect(() => {
        const width = window.innerWidth;
        setMarginLeft(width <= 400 ? '-70%' : '-50%');
    }, []);
    return (
        <div
            className={pageStyles.book}
            style={{
                maxWidth: '480px',
                width: '100%',
                margin: '0 auto',
                background: '#d1d5db',
                position: 'relative',
                overflow: 'hidden',
                minHeight: '100vh',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                border: '0px'
            }}
        >
            <HTMLFlipBook
                ref={bookRef}
                className="demo-book"
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
                style={{ marginLeft }}
                startZIndex={0}
                autoSize={true}
                clickEventForward={true}
                useMouseEvents={true}
                swipeDistance={30}
                showPageCorners={false}
                disableFlipByClick={true}
            >
                <div className={pageStyles.flex} style={{ position: "relative" }}>
                    <div
                        style={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            width: "30%",
                            height: "100%",
                            zIndex: 10,
                            cursor: "pointer",
                        }}
                        onClick={() => bookRef.current && bookRef.current.pageFlip && bookRef.current.pageFlip.flipPrev()}
                    />
                    <div className={pageStyles.generalPage}>
                        <div className={pageStyles.left}>
                            <div className={pageStyles.firstLeftBox}></div>
                            <div className={pageStyles.leftBox}></div>
                            <div className={pageStyles.leftBox}></div>
                            <div className={pageStyles.leftBox}></div>
                            <div className={pageStyles.lastLeftBox}></div>
                        </div>
                        <div>
                            <div className={pageStyles.rightFirstOutsideBox}>
                                <div className={pageStyles.rightFirstInsideBox}>
                                    <p className={pageStyles.smallFont}> 3-0단계 전체 요약 </p>
                                </div>
                            </div>
                            <div className={pageStyles.whitePaper}>
                                <h6 className={pageStyles.topic}> 전세 계약 시 사기를 당하는 경우는 크게 2가지입니다. </h6>
                                <p className={pageStyles.introContent}> 월셋집을 전셋집으로 둔갑시킨 중개사 </p>
                                <p className={pageStyles.introContent}> 사용자님 말고 다른 세입자와 이중계약 </p>
                                <h6 className={pageStyles.topic}> 전세보감은 이러한 피해를 막기 위해 다음을 제공합니다. </h6>
                                <p className={pageStyles.introContent}> 공인중개사 자격증 유무 조회 </p>
                                <p className={pageStyles.introContent}> 최우선 변제 기준 데이터 제공 </p>
                                <p className={pageStyles.introContent}> 공제 증서 안내 </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="page">
                    <div className="page-content" style={{ backgroundColor: '#e5e7eb' }}>
                    </div>
                </div>
                <div className={pageStyles.flex}>
                    <GeneralPage title='3-1단계 공인중개사 자격증 유무 조회'
                        category='위험 요소'
                        content='무자격자가 중개업 등록증이나 자격증을 빌려서
                        중개사무소를 차리는 경우가 많아지고 있습니다.
                        이런 경우 공식적인 중개업 등록증이나 자격증을
                        소지하고 일하는 중개사무소보다 사기 위험이
                        더 높을 수 밖에 없습니다.
                        사업자상호(부동산 이름)과 중개업자 이름을 입력하면
                        전세보감이 증명된 중개업자인지 확인해드리겠습니다.'></GeneralPage>
                </div>
                <div className="page">
                    <div className="page-content" style={{ backgroundColor: '#e5e7eb' }}>
                    </div>
                </div>
                <div className={pageStyles.flex}>
                    <GeneralPage title='3-2단계 최우선변제 금액 안내'
                        category='안내 사항'
                        content='주택임대차보호법 제8조를 따라 사용자님이 가장
                            늦게 입주 세입자이더라도 최우선으로
                            보증금을 변제 받을 수 있습니다.
                            이 기준은 지역마다 다릅니다.
                            전세보감이 초기 설정 때 작성한 매물 지역의
                            최우선변제 금액을 안내해드리겠습니다'></GeneralPage>
                </div>
                <div className="page">
                    <div className="page-content" style={{ backgroundColor: '#e5e7eb' }}>
                    </div>
                </div>
                <div className={pageStyles.flex}>
                    <GeneralPage title='3-3단계 공제증서 발급 링크 안내'
                        category='안내 사항'
                        content='공인중개사와의 중개 과정에서 발생할 수 있는 사고로
                                사용자님에게 손해를 입힐 수 있으므로
                                공제증서를 발급받는 것이 좋습니다.
                                현재 공제증서를 받는 방법으로는 구청이나
                                시청에 방문하시거나 한국공인중개사협회
                                온라인 서비스를 이용하셔야 됩니다.
                                전세보감이 해당 온라인 서비스 링크를
                                제공해드리곘습니다.'></GeneralPage>
                </div>
            </HTMLFlipBook>
        </div>
    );
}