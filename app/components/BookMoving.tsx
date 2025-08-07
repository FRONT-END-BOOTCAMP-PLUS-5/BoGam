"use client"

import { useEffect, useRef, useState } from 'react';

declare global {
    interface Window {
        jQuery: any;
        $: any;
    }
    interface JQuery {
        turn(options?: any): JQuery;
        turn(method: string): JQuery;
    }
}

const BookMoving = () => {
    const bookRef = useRef<HTMLDivElement>(null);
    const [turnReady, setTurnReady] = useState(false);

    useEffect(() => {
        const initializeTurn = () => {
            if (
                bookRef.current &&
                window.$ &&
                window.$.fn &&
                window.$.fn.turn
            ) {
                window.$(bookRef.current).turn({
                    display: 'single',
                    width: 400,
                    height: 600,
                    autoCenter: true
                });
                setTurnReady(true);
            }
        };

        const checkAndInit = () => {
            if (window.$ && window.$.fn && window.$.fn.turn) {
                initializeTurn();
            } else {
                setTimeout(checkAndInit, 100);
            }
        };
        checkAndInit();
    }, []);

    const nextPage = () => {
        if (
            turnReady &&
            bookRef.current &&
            window.$ &&
            window.$.fn &&
            window.$.fn.turn
        ) {
            window.$(bookRef.current).turn('next');
        }
    };
    const prevPage = () => {
        if (
            turnReady &&
            bookRef.current &&
            window.$ &&
            window.$.fn &&
            window.$.fn.turn
        ) {
            window.$(bookRef.current).turn('previous');
        }
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <style>{`
                .book {
                    position: relative;
                    width: 400px;
                    height: 600px;
                    margin: 0 auto;
                    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
                    background: #fff;
                    overflow: hidden;
                }
                .book > div {
                    width: 400px;
                    height: 600px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2rem;
                }
            `}</style>
            <div ref={bookRef} className="book">
                <div style={{ backgroundColor:'green' }}>
                    <p>1페이지</p>
                </div>
                <div style={{ backgroundColor:'blue' }}>
                    <p>2페이지</p>
                </div>
                <div style={{ backgroundColor:'red' }}>
                    <p>3페이지</p>
                </div>
            </div>
            <div style={{ marginTop: 16 }}>
                <button onClick={prevPage} style={{ marginRight: 8 }} disabled={!turnReady}>이전</button>
                <button onClick={nextPage} disabled={!turnReady}>다음</button>
            </div>
        </div>
    )
}

export default BookMoving;