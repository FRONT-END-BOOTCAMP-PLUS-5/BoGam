import { useState } from 'react';

export const useExpandable = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return { isExpanded, toggleExpanded };
};
