import { useState, useEffect, useRef, useCallback } from 'react';

export function useMarkdownWorker() {
  const [html, setHtml] = useState('');
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL('@/features/editor/workers/markdownWorker.ts', import.meta.url),
      { type: 'module' }
    );

    workerRef.current.onmessage = (e) => {
      if (e.data.html) {
        setHtml(e.data.html);
      }
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const parse = useCallback((content: string) => {
    workerRef.current?.postMessage({ content });
  }, []);

  return { html, parse };
}
