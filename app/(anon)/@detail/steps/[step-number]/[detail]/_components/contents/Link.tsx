'use client';

import React from 'react';
import styles from './Link.styles';
import Button from '@/(anon)/_components/common/button/Button';

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
            <Button
              onClick={() => handleLinkClick(linkItem.url)}
              variant="primary"
              fullWidth={false}
              className="px-8 py-4 text-lg font-semibold"
            >
              {linkItem.title}
            </Button>
          </div>
          
          {linkItem.description && (
            <p className={styles.description}>{linkItem.description}</p>
          )}
        </div>
      ))}
    </div>
  );
}
