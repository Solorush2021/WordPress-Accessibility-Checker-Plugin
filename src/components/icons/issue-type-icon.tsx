import React from 'react';
import { ImageIcon, Contrast, Heading1, Link2Off, Link as LinkIcon, AlertCircle, LucideProps, Type, Search, MousePointerClick } from 'lucide-react';

interface IssueTypeIconProps extends LucideProps {
  type: string;
}

export const IssueTypeIcon: React.FC<IssueTypeIconProps> = ({ type, className, ...props }) => {
  const normalizedType = type.toLowerCase();

  if (normalizedType.includes('alt text') || normalizedType.includes('image')) {
    return <ImageIcon className={className} {...props} aria-hidden="true" />;
  }
  if (normalizedType.includes('contrast')) {
    return <Contrast className={className} {...props} aria-hidden="true" />;
  }
  if (normalizedType.includes('heading')) {
    return <Heading1 className={className} {...props} aria-hidden="true" />;
  }
  if (normalizedType.includes('empty link')) {
    return <Link2Off className={className} {...props} aria-hidden="true" />;
  }
  if (normalizedType.includes('link') || normalizedType.includes('anchor')) {
    return <LinkIcon className={className} {...props} aria-hidden="true" />;
  }
  if (normalizedType.includes('text') || normalizedType.includes('font')) {
    return <Type className={className} {...props} aria-hidden="true" />;
  }
  if (normalizedType.includes('form') || normalizedType.includes('input') || normalizedType.includes('label')) {
    return <Search className={className} {...props} aria-hidden="true" />; // Using Search as a generic form-related icon
  }
  if (normalizedType.includes('button') || normalizedType.includes('interactive')) {
    return <MousePointerClick className={className} {...props} aria-hidden="true" />;
  }
  
  return <AlertCircle className={className} {...props} aria-hidden="true" />; // Default icon
};
