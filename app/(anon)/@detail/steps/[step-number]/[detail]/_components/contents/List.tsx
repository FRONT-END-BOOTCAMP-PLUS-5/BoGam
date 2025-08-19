import React from 'react';

interface ListProps {
  items: (string | number)[];
  type?: 'ordered' | 'unordered' | 'checklist';
  marker?: 'disc' | 'circle' | 'square' | 'decimal' | 'lower-alpha' | 'upper-alpha';
  spacing?: 'compact' | 'normal' | 'loose';
  showIcons?: boolean;
  className?: string;
}

const List = ({
  items,
  type = 'unordered',
  marker = 'disc',
  spacing = 'normal',
  showIcons = false,
  className
}: ListProps) => {
  const renderMarker = (index: number) => {
    if (type === 'checklist') {
      return showIcons ? '✓' : '•';
    }
    if (type === 'ordered') {
      return `${index + 1}.`;
    }
    return marker === 'disc' ? '•' : marker === 'circle' ? '○' : '■';
  };

  const getSpacingStyles = () => {
    switch (spacing) {
      case 'compact':
        return { marginBottom: '8px' };
      case 'loose':
        return { marginBottom: '24px' };
      default:
        return { marginBottom: '16px' };
    }
  };

  const listStyles = {
    margin: 0,
    padding: 0,
    listStyle: 'none' as const,
    ...getSpacingStyles()
  };

  const listItemStyles = {
    position: 'relative' as const,
    paddingLeft: '20px',
    marginBottom: '8px',
    lineHeight: 1.5,
    color: '#212529'
  };

  if (type === 'ordered') {
    return (
      <ol className={className} style={listStyles}>
        {items.map((item, index) => (
          <li key={index} style={listItemStyles}>
            {renderMarker(index)} {item}
          </li>
        ))}
      </ol>
    );
  }

  return (
    <ul className={className} style={listStyles}>
      {items.map((item, index) => (
        <li key={index} style={listItemStyles}>
          {renderMarker(index)} {item}
        </li>
      ))}
    </ul>
  );
};

export default List;
