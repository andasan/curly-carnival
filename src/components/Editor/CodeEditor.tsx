import Editor from '@monaco-editor/react';
import { File } from '@/types/fileSystem';

interface CodeEditorProps {
  file: File | null;
  onChange: (value: string | undefined) => void;
}

export const CodeEditor = ({ file, onChange }: CodeEditorProps) => {
  if (!file) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a file to edit
      </div>
    );
  }

  const getLanguage = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js':
        return 'javascript';
      case 'ts':
        return 'typescript';
      case 'jsx':
        return 'javascript';
      case 'tsx':
        return 'typescript';
      case 'json':
        return 'json';
      case 'html':
        return 'html';
      case 'css':
        return 'css';
      case 'md':
        return 'markdown';
      default:
        return 'plaintext';
    }
  };

  return (
    <Editor
      defaultLanguage={getLanguage(file.name)}
      theme="vs-dark"
      value={file.content}
      onChange={onChange}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        wordWrap: 'on',
        automaticLayout: true,
      }}
    />
  );
}; 