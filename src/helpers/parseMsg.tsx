import React from 'react';
const parsedMsg = (text: string): JSX.Element => {
  const urlRegex = /(\b\w+\.\w+\b)/gi;
  const parts = text.split(/(\s+)/); // Split by spaces, preserving them
  
  return (
    <span style={{ whiteSpace: 'pre-wrap' }}>
      {parts.map((part, index) => {
        if (urlRegex.test(part.trim())) { // Trim part to avoid false positives
          const href = part.startsWith('http') ? part : `http://${part.trim()}`;
          return (
            <a key={index} href={href} target="_blank" rel="noopener noreferrer">
              {part}
            </a>
          );
        }
        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </span>
  );
};

export default parsedMsg;
