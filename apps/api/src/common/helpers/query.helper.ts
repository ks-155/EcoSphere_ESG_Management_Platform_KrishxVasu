export interface ParsedQuery {
  search?: string;
  status?: string;
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export function parseQuery(query: any): ParsedQuery {
  return {
    search: query.search || undefined,
    status: query.status !== undefined && query.status !== '' ? query.status : undefined,
    page: Math.max(1, Number(query.page) || 1),
    limit: Math.min(100, Math.max(1, Number(query.limit) || 10)),
    sortBy: query.sortBy || 'name',
    sortOrder: query.sortOrder === 'desc' ? 'desc' : 'asc',
  };
}
