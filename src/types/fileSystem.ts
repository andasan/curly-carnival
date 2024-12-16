export interface File {
  id: number;
  name: string;
  content: string;
  path: string;
  type: 'file';
}

export interface Directory {
  id: number;
  name: string;
  path: string;
  type: 'directory';
  children: (File | Directory)[];
  isOpen?: boolean;
}

export type FileSystemItem = File | Directory; 