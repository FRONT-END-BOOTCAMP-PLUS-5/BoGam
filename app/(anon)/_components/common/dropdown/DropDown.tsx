'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import Field from '@/(anon)/_components/common/forms/Field';
import { styles } from './DropDown.styles';

// 드롭다운 옵션 인터페이스
interface DropDownOption {
  value: string;
  label: string;
}

// 드롭다운 컴포넌트 props 인터페이스
interface DropDownProps {
  options: DropDownOption[];           // 선택 가능한 옵션들
  value?: string;                      // 현재 선택된 값
  onChange?: (value: string) => void;  // 값 변경 시 호출되는 콜백
  placeholder?: string;                // 플레이스홀더 텍스트
  disabled?: boolean;                  // 비활성화 여부
  className?: string;                  // 추가 CSS 클래스
  label?: string;                      // 라벨 텍스트
  required?: boolean;                  // 필수 입력 여부
  hint?: string;                       // 도움말 텍스트
  error?: string;                      // 에러 메시지
  id?: string;                         // 고유 식별자
}

/**
 * 공통 드롭다운 컴포넌트
 * Field 컴포넌트를 사용하여 라벨, 힌트, 에러 메시지를 표시하고
 * Forms.styles의 기본 스타일을 적용합니다.
 */
export function DropDown({
  options,
  value,
  onChange,
  placeholder = '선택하세요',
  disabled = false,
  className = '',
  label,
  required = false,
  hint,
  error,
  id,
}: DropDownProps) {
  // 드롭다운 열림/닫힘 상태
  const [isOpen, setIsOpen] = useState(false);
  // 포커스 상태 (스타일링용)
  const [focus, setFocus] = useState(false);
  
  // 드롭다운 컨테이너 ref
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setFocus(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 옵션 선택 처리
  const handleSelect = (optionValue: string) => {
    onChange?.(optionValue);
    setIsOpen(false);
  };

  // 현재 선택된 옵션 찾기
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <Field
      id={id || 'dropdown'}
      label={label}
      required={required}
      hint={hint}
      error={error}
    >
      <div className={focus ? styles.inputFocused : error ? styles.inputErrorState : styles.inputDefault} ref={dropdownRef}>
        {/* 드롭다운 트리거 버튼 */}
        <button
          type="button"
          className={focus ? styles.buttonFocus : error ? styles.buttonError : styles.buttonBase}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
        >
          {/* 선택된 값 또는 플레이스홀더 표시 */}
          <span className="block truncate text-left">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          
          {/* 화살표 아이콘 (비활성화 상태가 아닐 때만 표시) */}
          {!disabled && (
            <ChevronDown 
              size={16} 
              className={isOpen ? styles.chevronOpen : styles.chevronClosed}
            />
          )}
        </button>

        {/* 드롭다운 메뉴 (열림 상태일 때만 표시) */}
        {isOpen && (
          <div className={styles.dropdownMenu}>
            <div className={styles.optionsList}>
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={option.value === value ? styles.optionSelected : styles.optionDefault}
                  onClick={() => handleSelect(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Field>
  );
}