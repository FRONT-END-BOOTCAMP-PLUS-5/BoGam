import React from 'react';
import styles from './TextOnly.styles';

interface TextOnlyProps {
  text: string;
  variant?: 'default' | 'title' | 'subtitle' | 'body' | 'caption';
  align?: 'left' | 'center' | 'right';
  color?: string;
  className?: string;
}

const TextOnly = ({
  text,
  variant = 'default',
  align = 'left',
  color,
  className
}: TextOnlyProps) => {
  return (
    <div 
      className={`${styles.textOnly} ${styles[variant]} ${styles[`align-${align}`]} ${className || ''}`}
      style={{ color: color }}
    >
      {text}
    </div>
  );
};

export default TextOnly;
