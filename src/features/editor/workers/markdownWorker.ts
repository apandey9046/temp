import { marked } from 'marked';
import { gfmHeadingId } from 'marked-gfm-heading-id';
import { mangle } from 'marked-mangle';

// Configure marked with plugins
marked.use(gfmHeadingId());
marked.use(mangle());

self.onmessage = (e: MessageEvent) => {
  const { content } = e.data;

  try {
    const html = marked.parse(content);
    self.postMessage({ html });
  } catch (error) {
    self.postMessage({ error: 'Failed to parse markdown' });
  }
};
