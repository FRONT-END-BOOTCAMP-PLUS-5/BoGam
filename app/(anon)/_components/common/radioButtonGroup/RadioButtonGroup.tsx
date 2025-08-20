'use client';

import { useState } from 'react';
import clsx from 'clsx';
import { styles } from './RadioButtonGroup.styles';
import RadioButton from './RadioButton';

type RadioOption = {
  value: string;
  label: string;
};

type RadioButtonGroupProps = {
  name: string;
  options: RadioOption[];
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  showYesNoLabels?: boolean;
};

const RadioButtonGroup = ({
  name,
  options,
  defaultValue,
  onChange,
  disabled = false,
  className,
  showYesNoLabels = true
}: RadioButtonGroupProps) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue || options[0]?.value || '');

  const handleChange = (value: string) => {
    setSelectedValue(value);
    onChange?.(value);
  };

  // 옵션을 2개씩 그룹화
  const groupedOptions = [];
  for (let i = 0; i < options.length; i += 2) {
    groupedOptions.push(options.slice(i, i + 2));
  }

  return (
    <div className={clsx(styles.group, className)}>
      {showYesNoLabels && (
        <div className={styles.labelContainer}>
          <span className={styles.label}>아니오</span>
          <span className={styles.label}>예</span>
        </div>
      )}
      
      {groupedOptions.map((row, rowIndex) => (
        <div key={rowIndex} className={styles.row}>
          {row.map((option) => (
            <RadioButton
              key={option.value}
              id={`${name}-${option.value}`}
              name={name}
              value={option.value}
              label={option.label}
              checked={selectedValue === option.value}
              onChange={handleChange}
              disabled={disabled}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default RadioButtonGroup;
