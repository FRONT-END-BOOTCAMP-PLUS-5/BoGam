'use client';

import { useState } from 'react';
import { generalPageStyles } from './generalPage.style';
import StepDetail from '../../@detail/steps/[step-number]/[detail]/StepDetail';

interface pageType {
    title: string,
    category: string,
    content: string,
    pageIdx: number,
    stepNumber: string
}

export default function GeneralPage({ title, category, content, pageIdx, stepNumber }: pageType) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
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

            <StepDetail 
                isOpen={isModalOpen} 
                onClose={closeModal}
                stepNumber={stepNumber}
                pageIdx={pageIdx}
            />
        </>
    )
}