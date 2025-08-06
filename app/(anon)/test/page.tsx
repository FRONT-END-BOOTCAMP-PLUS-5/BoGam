'use client';
import React, { useState } from 'react';
import './StepDetailCard.css';

const StepDetailPage = () => {
  const steps = [
    {
      title: '등본 조회',
      purpose: '임대인 소유 여부 확인',
      dataStatus: { needCheck: 2, confirmed: 3, warning: 1 },
    },
    {
      title: '완납 증명서 조회',
      purpose: '임대인의 세금 완납 여부 확인',
      dataStatus: { needCheck: 1, confirmed: 4, warning: 0 },
    },
    {
      title: '확정일자 발급',
      purpose: '보증금 보호를 위한 확정일자 발급',
      dataStatus: { needCheck: 0, confirmed: 5, warning: 0 },
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentStep = steps[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? steps.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === steps.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className='step-detail-container'>
      {/* 헤더 */}
      <header className='header'>
        <button className='header-btn'>
          {/* <FiChevronLeft size={24} /> */}
        </button>
        <button className='header-btn'>{/* <FiMenu size={24} /> */}</button>
      </header>

      {/* 전체 단계 상태 요약 */}
      <div className='overall-status'>
        <div className='status-item confirmed'>
          {/* <FaCheckCircle /> 확인 완료: 3개 */}
        </div>
        <div className='status-item warning'>
          {/* <FaExclamationTriangle /> 경고: 6개 */}
        </div>
        <div className='status-item error'>
          {/* <FaTimesCircle /> 문제 발생: 2개 */}
        </div>
      </div>

      {/* 세부 단계 카드 */}
      <div className='card-wrapper'>
        <button className='nav-btn' onClick={handlePrev}>
          {/* <FiChevronLeft size={28} /> */}
        </button>
        <div className='card'>
          <h4 className='step-label'>{currentIndex + 1}단계</h4>
          <h2 className='step-title'>{currentStep.title}</h2>
          <p className='purpose'>{currentStep.purpose}</p>

          <div className='data-status'>
            <div className='data-item need-check'>
              📌 확인 필요: {currentStep.dataStatus.needCheck}
            </div>
            <div className='data-item confirmed'>
              ✅ 확인 완료: {currentStep.dataStatus.confirmed}
            </div>
            <div className='data-item warning'>
              ⚠ 문제 발생: {currentStep.dataStatus.warning}
            </div>
          </div>
        </div>
        <button className='nav-btn' onClick={handleNext}>
          {/* <FiChevronRight size={28} /> */}
        </button>
      </div>

      {/* 페이지 인디케이터 */}
      <div className='indicator'>
        {steps.map((_, idx) => (
          <span
            key={idx}
            className={`dot ${idx === currentIndex ? 'active' : ''}`}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default StepDetailPage;
