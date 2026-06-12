export const DEFAULT_PAGE_LIMIT = 20;
export const MAX_PAGE_LIMIT = 50;
export const MAX_CURSOR_OFFSET = 10_000;

export interface PaginationInput {
  limit: number;
  cursor: number;
}

export interface PaginatedRows<T> {
  data: T[];
  nextCursor: string | null;
}

export function pageRows<T>(rows: T[], pagination: PaginationInput): PaginatedRows<T> {
  const data = rows.slice(0, pagination.limit);
  const nextCursor = rows.length > pagination.limit ? String(pagination.cursor + pagination.limit) : null;

  return {
    data,
    nextCursor
  };
}
