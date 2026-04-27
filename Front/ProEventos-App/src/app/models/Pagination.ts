export class Pagination {
  CurrentPage: number = 1;
  ItemsPerPage: number = 10;
  TotalItems: number = 0;
  TotalPages: number = 0;
}

export class PaginatedResult<T> {
  result?: T;
  pagination: Pagination = new Pagination();
}
