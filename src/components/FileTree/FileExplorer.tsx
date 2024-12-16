import { FileTreeItem } from './FileTreeItem';
import { FileSystemItem, File, Directory } from '@/types/fileSystem';

interface FileExplorerProps {
  fileSystem: FileSystemItem[];
  activeFileId?: number;
  onFileSelect: (file: File) => void;
  onDirectoryToggle: (dir: Directory) => void;
  onCreateItem: (parentPath: string, type: 'file' | 'directory') => void;
  onRename: (id: number, newName: string) => void;
  newItemPath: string | null;
  newItemType: 'file' | 'directory' | null;
  onNewItemSubmit: (name: string) => void;
  onNewItemCancel: () => void;
}

export const FileExplorer = ({
  fileSystem,
  activeFileId,
  onFileSelect,
  onDirectoryToggle,
  onCreateItem,
  onRename,
  newItemPath,
  newItemType,
  onNewItemSubmit,
  onNewItemCancel,
}: FileExplorerProps) => {
  return (
    <div className="w-64 bg-white border-r overflow-y-auto">
      <div className="p-2">
        <h2 className="text-sm font-semibold mb-2">Explorer</h2>
        {fileSystem.map(item => (
          <FileTreeItem
            key={item.id}
            item={item}
            onFileSelect={onFileSelect}
            onDirectoryToggle={onDirectoryToggle}
            onCreateItem={onCreateItem}
            onRename={onRename}
            activeFileId={activeFileId}
            newItemPath={newItemPath}
            newItemType={newItemType}
            onNewItemSubmit={onNewItemSubmit}
            onNewItemCancel={onNewItemCancel}
          />
        ))}
      </div>
    </div>
  );
}; 