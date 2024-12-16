import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { fetchGitHubRepo } from '@/utils/github';
import { FileSystemItem } from '@/types/fileSystem';

interface GitHubImportProps {
  onImport: (files: FileSystemItem[]) => void;
}

export function GitHubImport({ onImport }: GitHubImportProps) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleImport = async () => {
    try {
      setLoading(true);
      setError(null);
      const files = await fetchGitHubRepo(url);
      
      // Convert files to our FileSystem structure
      let nextId = 1;
      const fileSystem: FileSystemItem[] = [];
      const directories = new Map<string, FileSystemItem>();
      
      files.forEach(({ path, content }) => {
        const parts = path.split('/');
        let currentPath = '';
        
        parts.slice(0, -1).forEach((part: string) => {
          const parentPath = currentPath;
          currentPath = currentPath ? `${currentPath}/${part}` : part;
          
          if (!directories.has(currentPath)) {
            const directory: FileSystemItem = {
              id: nextId++,
              name: part,
              path: `/${currentPath}`,
              type: 'directory',
              children: [],
              isOpen: true
            };
            
            if (parentPath) {
              const parent = directories.get(parentPath);
              if (parent && parent.type === 'directory') {
                parent.children.push(directory);
              }
            } else {
              fileSystem.push(directory);
            }
            
            directories.set(currentPath, directory);
          }
        });
        
        const file: FileSystemItem = {
          id: nextId++,
          name: parts[parts.length - 1],
          path: `/${path}`,
          type: 'file',
          content
        };
        
        const parentPath = parts.slice(0, -1).join('/');
        if (parentPath) {
          const parent = directories.get(parentPath);
          if (parent && parent.type === 'directory') {
            parent.children.push(file);
          }
        } else {
          fileSystem.push(file);
        }
      });
      
      onImport(fileSystem);
      setOpen(false);
      setUrl('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import repository');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Import from GitHub</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import GitHub Repository</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="https://github.com/owner/repo"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button
            onClick={handleImport}
            disabled={loading || !url}
            className="w-full"
          >
            {loading ? 'Importing...' : 'Import'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 