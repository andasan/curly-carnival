import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileExplorer } from '@/components/FileTree/FileExplorer';
import { CodeEditor } from '@/components/Editor/CodeEditor';
import { FileSystemItem, File, Directory } from '@/types/fileSystem';
import { getAllIds } from '@/utils/fileSystem';
import { GitHubImport } from '@/components/GithubImport/GitHubImport';

const App = () => {
  const [fileSystem, setFileSystem] = useState<FileSystemItem[]>([
    {
      id: 1,
      name: 'src',
      path: '/src',
      type: 'directory',
      isOpen: true,
      children: [
        {
          id: 2,
          name: 'index.js',
          path: '/src/index.js',
          type: 'file',
          content: '// Welcome to your Web IDE!\nconsole.log("Hello, World!");'
        }
      ]
    }
  ]);
  const [activeFile, setActiveFile] = useState<File | null>(null);
  const [newItemPath, setNewItemPath] = useState<string | null>(null);
  const [newItemType, setNewItemType] = useState<'file' | 'directory' | null>(null);

  let nextId = Math.max(...getAllIds(fileSystem)) + 1;

  const createNewItem = (parentPath: string, type: 'file' | 'directory') => {
    setNewItemPath(parentPath);
    setNewItemType(type);
  };

  const handleNewItemSubmit = (name: string) => {
    if (!newItemPath || !newItemType) return;

    const newItem: FileSystemItem = newItemType === 'file' 
      ? {
          id: nextId++,
          name,
          path: `${newItemPath}/${name}`,
          type: 'file',
          content: ''
        }
      : {
          id: nextId++,
          name,
          path: `${newItemPath}/${name}`,
          type: 'directory',
          children: [],
          isOpen: true
        };

    const updateTree = (items: FileSystemItem[], path: string): FileSystemItem[] => {
      return items.map(item => {
        if (item.type === 'directory') {
          if (item.path === path) {
            return { ...item, children: [...item.children, newItem] };
          }
          return { ...item, children: updateTree(item.children, path) };
        }
        return item;
      });
    };

    setFileSystem(updateTree(fileSystem, newItemPath));
    setNewItemPath(null);
    setNewItemType(null);
  };

  const handleRename = (id: number, newName: string) => {
    const updateTree = (items: FileSystemItem[]): FileSystemItem[] => {
      return items.map(item => {
        if (item.id === id) {
          const newPath = item.path.split('/').slice(0, -1).concat(newName).join('/');
          return { ...item, name: newName, path: newPath };
        }
        if (item.type === 'directory') {
          return { ...item, children: updateTree(item.children) };
        }
        return item;
      });
    };

    setFileSystem(updateTree(fileSystem));
  };

  const toggleDirectory = (dir: Directory) => {
    const updateTree = (items: FileSystemItem[]): FileSystemItem[] => {
      return items.map(i => {
        if (i.id === dir.id) {
          return { ...i, isOpen: !dir.isOpen };
        }
        if (i.type === 'directory') {
          return { ...i, children: updateTree(i.children) };
        }
        return i;
      });
    };
    setFileSystem(updateTree(fileSystem));
  };

  const handleEditorChange = (value: string | undefined) => {
    if (!activeFile || !value) return;
    
    const updateFiles = (items: FileSystemItem[]): FileSystemItem[] => {
      return items.map(item => {
        if (item.type === 'file' && item.id === activeFile.id) {
          return { ...item, content: value };
        }
        if (item.type === 'directory') {
          return { ...item, children: updateFiles(item.children) };
        }
        return item;
      });
    };
    
    setFileSystem(updateFiles(fileSystem));
  };

  const handleGitHubImport = (importedFiles: FileSystemItem[]) => {
    setFileSystem(importedFiles);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-100">
      <div className="flex items-center p-4 bg-white border-b">
        <h1 className="text-xl font-bold">Web IDE</h1>
        <div className="ml-auto flex gap-2">
          <GitHubImport onImport={handleGitHubImport} />
          <Button
            onClick={() => createNewItem('', 'file')}
          >
            New File
          </Button>
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <FileExplorer
          fileSystem={fileSystem}
          activeFileId={activeFile?.id}
          onFileSelect={setActiveFile}
          onDirectoryToggle={toggleDirectory}
          onCreateItem={createNewItem}
          onRename={handleRename}
          newItemPath={newItemPath}
          newItemType={newItemType}
          onNewItemSubmit={handleNewItemSubmit}
          onNewItemCancel={() => {
            setNewItemPath(null);
            setNewItemType(null);
          }}
        />

        <div className="flex-1 flex flex-col">
          <CodeEditor
            file={activeFile}
            onChange={handleEditorChange}
          />
        </div>
      </div>
    </div>
  );
};

export default App;