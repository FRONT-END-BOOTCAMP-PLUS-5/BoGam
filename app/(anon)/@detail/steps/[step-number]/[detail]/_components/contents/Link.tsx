'use client';

import React from 'react';
import styles from './Link.styles';

interface LinkData {
  title: string;
  url: string;
  description?: string;
}

interface LinkProps {
  title?: string;
  data: LinkData[];
}

export default function Link({ title, data }: LinkProps) {
  const handleLinkClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={styles.container}>
      {title && <h2 className={styles.title}>{title}</h2>}
      
      {data.map((linkItem, index) => (
        <div key={index} className="text-center">
          <div className={styles.linkContainer}>
            <button
              onClick={() => handleLinkClick(linkItem.url)}
              className={styles.linkButton}
              aria-label={`${linkItem.title} 링크로 이동`}
            >
              <span className={styles.linkText}>{linkItem.title}</span>
            </button>
          </div>
          
          {linkItem.description && (
            <p className={styles.description}>{linkItem.description}</p>
          )}
        </div>
      ))}
    </div>
  );
}
