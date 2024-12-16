import { useState } from 'react';
import { Folder, File as FileIcon, ChevronRight, ChevronDown, FilePlus, FolderPlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { FileSystemItem, File, Directory } from '@/types/fileSystem';

interface FileTreeItemProps {
  item: FileSystemItem;
  depth?: number;
  onFileSelect: (file: File) => void;
  onDirectoryToggle: (dir: Directory) => void;
  onCreateItem: (parentPath: string, type: 'file' | 'directory') => void;
  onRename: (id: number, newName: string) => void;
  activeFileId?: number;
  newItemPath?: string | null;
  newItemType?: 'file' | 'directory' | null;
  onNewItemSubmit: (name: string) => void;
  onNewItemCancel: () => void;
}

export const FileTreeItem = ({
  item,
  depth = 0,
  onFileSelect,
  onDirectoryToggle,
  onCreateItem,
  onRename,
  activeFileId,
  newItemPath,
  newItemType,
  onNewItemSubmit,
  onNewItemCancel,
}: FileTreeItemProps) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div style={{ paddingLeft: `${depth * 12}px` }}>
      <div className="group flex items-center p-1 hover:bg-gray-100">
        {isEditing ? (
          <Input
            className="h-6 py-0 px-1 text-sm"
            defaultValue={item.name}
            autoFocus
            onBlur={(e) => {
              onRename(item.id, e.target.value);
              setIsEditing(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onRename(item.id, e.currentTarget.value);
                setIsEditing(false);
              }
            }}
          />
        ) : (
          <div
            className={`flex-1 flex items-center cursor-pointer ${
              activeFileId === item.id ? 'bg-blue-100' : ''
            }`}
            onClick={() => {
              if (item.type === 'file') {
                onFileSelect(item);
              } else {
                onDirectoryToggle(item);
              }
            }}
            onDoubleClick={() => setIsEditing(true)}
          >
            {item.type === 'directory' && (
              <span className="mr-1">
                {item.isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </span>
            )}
            {item.type === 'directory' ? (
              <Folder size={16} className="mr-2 text-blue-500" />
            ) : (
              <FileIcon size={16} className="mr-2 text-gray-500" />
            )}
            <span className="text-sm flex-1">{item.name}</span>
            {item.type === 'directory' && (
              <div className="hidden group-hover:flex gap-1">
                <button
                  className="p-1 bg-gray-50 hover:bg-gray-50 rounded text-blue-500 hover:text-blue-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCreateItem(item.path, 'file');
                  }}
                  title="New File"
                >
                  <FilePlus size={14} />
                </button>
                <button
                  className="p-1 bg-gray-50 hover:bg-gray-50 rounded text-blue-500 hover:text-blue-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCreateItem(item.path, 'directory');
                  }}
                  title="New Folder"
                >
                  <FolderPlus size={14} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      {item.type === 'directory' && item.isOpen && (
        <div>
          {item.children.map(child => (
            <FileTreeItem
              key={child.id}
              item={child}
              depth={depth + 1}
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
          {newItemPath === item.path && (
            <div style={{ paddingLeft: `${(depth + 1) * 12}px` }}>
              <Input
                className="h-6 py-0 px-1 text-sm"
                placeholder={`New ${newItemType}`}
                autoFocus
                onBlur={(e) => {
                  if (e.target.value) onNewItemSubmit(e.target.value);
                  else onNewItemCancel();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value) {
                    onNewItemSubmit(e.currentTarget.value);
                  }
                  if (e.key === 'Escape') {
                    onNewItemCancel();
                  }
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 