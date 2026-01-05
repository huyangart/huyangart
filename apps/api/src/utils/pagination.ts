export type PaginationOptions = {
  page: number;
  limit: number;
};

type PaginationQuery = {
  page?: string;
  limit?: string;
};

type PaginationResult = {
  page: number;
  limit: number;
  offset: number;
};

const parsePositiveInt = (value: string | undefined, fallback: number): number => {
  if (value === undefined) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
};

export const parsePagination = (
  query: PaginationQuery,
  defaults: PaginationOptions,
): PaginationResult => {
  const page = parsePositiveInt(query.page, defaults.page);
  const limit = parsePositiveInt(query.limit, defaults.limit);

  return {
    page,
    limit,
    offset: (page - 1) * limit,
  };
};
