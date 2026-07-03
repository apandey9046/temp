import React from 'react';
import { cn } from '@/shared/utils/cn';

interface MarkdownPreviewProps {
  html: string;
  className?: string;
}

export const MarkdownPreview: React.FC<MarkdownPreviewProps> = React.memo(({ html, className }) => {
  return (
    <div
      className={cn(
        "prose prose-neutral max-w-none prose-p:leading-[1.9] prose-p:text-[17px] prose-p:font-playpen",
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
});

MarkdownPreview.displayName = 'MarkdownPreview';
