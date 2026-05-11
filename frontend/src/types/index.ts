export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Song {
  _id: string;
  name: string;
  description: string;
  creatorName: string;
  createdAt: string;
  originalFileName: string;
  fileName: string;
  filePath: string;
}

export interface PaginatedSongs {
  items: Song[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
