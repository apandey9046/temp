import React, { useCallback, useMemo } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { EditorView } from '@codemirror/view';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const NoteEditor: React.FC<EditorProps> = React.memo(({ value, onChange }) => {
  const handleChange = useCallback((val: string) => {
    onChange(val);
  }, [onChange]);

  const extensions = useMemo(() => [
    markdown({ base: markdownLanguage, codeLanguages: languages }),
    EditorView.lineWrapping,
    EditorView.theme({
      '&': {
        fontSize: '17px',
        backgroundColor: 'transparent !important',
        fontFamily: '"Playpen Sans", cursive',
      },
      '.cm-content': {
        padding: '0 !important',
        lineHeight: '1.9',
      },
      '.cm-line': {
        padding: '0 !important',
      },
      '.cm-gutters': {
        display: 'none !important',
      },
      '&.cm-focused': {
        outline: 'none !important',
      }
    })
  ], []);

  return (
    <div className="w-full max-w-[850px] mx-auto min-h-screen pt-32 pb-20 px-6 sm:px-12">
      <CodeMirror
        value={value}
        height="auto"
        extensions={extensions}
        onChange={handleChange}
        basicSetup={{
          lineNumbers: false,
          foldGutter: false,
          highlightActiveLine: false,
          highlightSelectionMatches: false,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          rectangularSelection: false,
          crosshairCursor: false,
          dropCursor: true,
        }}
        className="text-primary selection:bg-black/10"
      />
    </div>
  );
});

NoteEditor.displayName = 'NoteEditor';
