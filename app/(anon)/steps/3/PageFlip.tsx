"use client";

import React, {
    ReactElement,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from 'react';

import { PageFlip } from 'page-flip';
import { IFlipSetting, IEventProps } from './settings';

interface IProps extends IFlipSetting, IEventProps {
    className: string;
    style: React.CSSProperties;
    children: React.ReactNode;
    renderOnlyPageLengthChange?: boolean;
}

const HTMLFlipBookForward = React.forwardRef<PageFlip, IProps>(
    (props: IProps, ref) => {
        const htmlElementRef = useRef<HTMLDivElement>(null);
        const childRef = useRef<HTMLElement[]>([]);
        const pageFlip = useRef<PageFlip | null>(null);

        const [pages, setPages] = useState<ReactElement[]>([]);

        useImperativeHandle(ref, () => pageFlip.current!, []);

        const refreshOnPageDelete = useCallback(() => {
            if (pageFlip.current) {
                pageFlip.current.destroy();
            }
        }, []);

        const removeHandlers = useCallback(() => {
            const flip = pageFlip.current;

            if (flip) {
                flip.off('flip');
                flip.off('changeOrientation');
                flip.off('changeState');
                flip.off('init');
                flip.off('update');
            }
        }, []);

        useEffect(() => {
            if (props.children) {
                const childList = React.Children.map(props.children, (child, index) => {
                    return React.cloneElement(child as ReactElement, {
                        key: index,
                    });
                });

                if (childList && (!props.renderOnlyPageLengthChange || pages.length !== childList.length)) {
                    if (childList.length < pages.length) {
                        refreshOnPageDelete();
                    }

                    setPages(childList);
                }
            }
        }, [props.children]);

        useEffect(() => {
            const setHandlers = () => {
                const flip = pageFlip.current;

                if (flip) {
                    if (props.onFlip) {
                        flip.on('flip', (e: unknown) => props.onFlip?.(e));
                    }

                    if (props.onChangeOrientation) {
                        flip.on('changeOrientation', (e: unknown) => props.onChangeOrientation?.(e));
                    }

                    if (props.onChangeState) {
                        flip.on('changeState', (e: unknown) => props.onChangeState?.(e));
                    }

                    if (props.onInit) {
                        flip.on('init', (e: unknown) => props.onInit?.(e));
                    }

                    if (props.onUpdate) {
                        flip.on('update', (e: unknown) => props.onUpdate?.(e));
                    }
                }
            };

            if (pages.length > 0 && htmlElementRef.current) {
                const container = htmlElementRef.current;

                if (!container.querySelector('#pair-face-style')) {
                    const styleEl = document.createElement('style');
                    styleEl.id = 'pair-face-style';
                    styleEl.textContent = `
                        [data-merged-wrapper="true"] {
                            position: relative;
                            width: 100%;
                            height: 100%;
                            box-sizing: border-box;
                            transform-style: preserve-3d;
                        }
                        [data-merged-wrapper="true"] > [data-side] {
                            position: absolute;
                            inset: 0;
                            width: 100%;
                            height: 100%;
                            backface-visibility: hidden;
                        }
                        [data-merged-wrapper="true"] > [data-side="back"] {
                            transform: rotateY(180deg);
                            background: red !important;
                            box-shadow: 0 0 0 1px red;
                            border: 0;
                            z-index: 2;
                            min-width: 100%;
                            min-height: 100%;
                            background-clip: padding-box;
                            isolation: isolate;
                            overflow: hidden;
                            mix-blend-mode: normal;
                            filter: brightness(1) drop-shadow(0 0 0 white);
                            will-change: transform, opacity;
                        }
                        [data-merged-wrapper="true"] > [data-side="back"] * {
                            background: red !important;
                        }
                        [data-merged-wrapper="true"] > [data-side="back"]::after {
                        [data-merged-wrapper="true"] > [data-side="back"]::before {
                            content: '';
                            position: absolute;
                            inset: 0;
                            width: 100%;
                            height: 100%;
                            background: red;
                            opacity: 1;
                            pointer-events: none;
                            z-index: 998;
                        }
                            content: '';
                            position: absolute;
                            inset: 0;
                            width: 100%;
                            height: 100%;
                            background: red;
                            opacity: 1;
                            pointer-events: none;
                            z-index: 999;
                        }
                    `;
                    container.appendChild(styleEl);
                }

                Array.from(container.querySelectorAll('[data-merged-wrapper="true"], [data-generated-blank="true"]'))
                    .forEach((el) => el.remove());

                const baseChildren = Array.from(container.children) as HTMLElement[];

                removeHandlers();

                if (!pageFlip.current) {
                    const { className, style, children: propsChildren, renderOnlyPageLengthChange, onFlip, onChangeOrientation, onChangeState, onInit, onUpdate, ...flipSettings } = props;
                    pageFlip.current = new PageFlip(container, flipSettings as any);
                }

                const finalPages: HTMLElement[] = [];
                for (let i = 0; i < baseChildren.length; i += 2) {
                    const frontEl = baseChildren[i];
                    const backEl = baseChildren[i + 1];

                    const wrapper = document.createElement('div');
                    wrapper.setAttribute('data-merged-wrapper', 'true');
                    wrapper.style.width = '100%';
                    wrapper.style.height = '100%';
                    wrapper.style.boxSizing = 'border-box';

                    const front = document.createElement('div');
                    front.setAttribute('data-side', 'front');
                    const back = document.createElement('div');
                    back.setAttribute('data-side', 'back');
                    back.setAttribute('style', 'background: red !important; color: red !important;');

                    container.insertBefore(wrapper, frontEl);
                    wrapper.appendChild(front);
                    wrapper.appendChild(back);
                    front.appendChild(frontEl);
                    if (backEl) back.appendChild(backEl);

                    finalPages.push(wrapper);
                }

                childRef.current = finalPages;

                if (pageFlip.current && finalPages.length > 0) {
                    if (!pageFlip.current.getFlipController()) {
                        pageFlip.current.loadFromHTML(finalPages);
                    } else {
                        pageFlip.current.updateFromHtml(finalPages);
                    }
                }

                setHandlers();
            }
        }, [pages]);

        return (
            <div 
                ref={htmlElementRef} 
                className={props.className} 
                style={{
                    ...props.style,
                    overflow: 'hidden'
                }}
            >
                {pages}
            </div>
        );
    }
);

export const HTMLFlipBook = React.memo(HTMLFlipBookForward);