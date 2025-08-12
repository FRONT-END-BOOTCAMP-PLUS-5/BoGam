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
                const children = Array.from(htmlElementRef.current.children) as HTMLElement[];
                childRef.current = children;

                removeHandlers();

                if (!pageFlip.current) {
                    const { className, style, children: propsChildren, renderOnlyPageLengthChange, onFlip, onChangeOrientation, onChangeState, onInit, onUpdate, ...flipSettings } = props;
                    pageFlip.current = new PageFlip(htmlElementRef.current, flipSettings as any);
                }

                if (pageFlip.current && children.length > 0) {
                    if (!pageFlip.current.getFlipController()) {
                        pageFlip.current.loadFromHTML(children);
                    } else {
                        pageFlip.current.updateFromHtml(children);
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