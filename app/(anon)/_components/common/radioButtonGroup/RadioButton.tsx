'use client';

import { forwardRef } from 'react';
import clsx from 'clsx';
import { styles } from './RadioButton.styles';

type RadioButtonProps = {
  id: string;
  name: string;
  value: string;
  label: string;
  checked: boolean;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
};

const RadioButton = forwardRef<HTMLInputElement, RadioButtonProps>(
  ({ id, name, value, label, checked, onChange, disabled = false, className }, ref) => {
    const handleChange = () => {
      if (!disabled) {
        onChange(value);
      }
    };

    return (
      <div 
        className={clsx(
          styles.radioContainer,
          disabled && styles.disabled,
          className
        )}
        onClick={handleChange}
      >
        <input
          ref={ref}
          type="radio"
          id={id}
          name={name}
          value={value}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className={styles.radioInput}
        />
        
        <div className={clsx(
          styles.radioButton,
          checked ? styles.checked : styles.unchecked
        )}>
          {checked && <div className={styles.checkmark} />}
        </div>
        
        <label 
          htmlFor={id}
          className={clsx(
            styles.radioLabel,
            disabled && styles.disabledLabel
          )}
        >
          {label}
        </label>
      </div>
    );
  }
);

RadioButton.displayName = 'RadioButton';

export default RadioButton;
