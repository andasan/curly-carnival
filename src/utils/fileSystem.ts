import { FileSystemItem } from '@/types/fileSystem';

export function getAllIds(items: FileSystemItem[]): number[] {
  return items.reduce((acc: number[], item) => {
    acc.push(item.id);
    if (item.type === 'directory') {
      acc.push(...getAllIds(item.children));
    }
    return acc;
  }, []);
} 