'use client';

import { useState } from 'react';
import { generalPageStyles } from './generalPage.style';

interface pageType {
    title: string,
    category: string,
    content: string,
    pageIdx: number,
    stepNumber: string
}

interface GeneralPageProps extends pageType {
    onOpenModal: (stepNumber: string, pageIdx: number) => void;
}

export default function GeneralPage({ title, category, content, pageIdx, stepNumber, onOpenModal }: GeneralPageProps) {
    const openModal = () => {
        onOpenModal(stepNumber, pageIdx);
    };

    return (
        <div className={generalPageStyles.generalWhitePage}>
            <div>
                <div className={generalPageStyles.smallFontDiv}>
                    <h3 className={generalPageStyles.smallFont}> {title} </h3>
                </div>
                <div className={generalPageStyles.borderBottomDiv}>
                    <h5 className={generalPageStyles.danger}> {category} </h5>
                    <p className={generalPageStyles.content} style={{ whiteSpace: 'pre-line' }}>
                        {content}
                    </p>
                </div>
                <div className={generalPageStyles.goInsideDiv}>
                    <button className={generalPageStyles.goInside} onClick={openModal}> 바로가기 </button>
                </div>
            </div>
        </div>
    )
}