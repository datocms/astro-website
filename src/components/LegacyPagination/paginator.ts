interface PaginatorResult {
  totalPages: number;
  pages: number;
  currentPage: number;
  firstPage: number;
  lastPage: number;
  previousPage: number;
  nextPage: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  totalResults: number;
  results: number;
  firstResult: number;
  lastResult: number;
}

export function createPaginator(per_page: number = 10, length: number = 10) {
  return function build(totalResults: number, currentPage: number): PaginatorResult {
    const totalPages = Math.ceil(totalResults / per_page);
    totalResults = parseInt(totalResults.toString(), 10);
    currentPage = parseInt(currentPage.toString(), 10) || 1;

    if (currentPage < 1) {
      currentPage = 1;
    }
    if (currentPage > totalPages) {
      currentPage = totalPages;
    }

    let firstPage = Math.max(1, currentPage - Math.floor(length / 2));
    let lastPage = Math.min(totalPages, currentPage + Math.floor(length / 2));

    if (lastPage - firstPage + 1 < length) {
      if (currentPage < totalPages / 2) {
        lastPage = Math.min(totalPages, lastPage + (length - (lastPage - firstPage)));
      } else {
        firstPage = Math.max(1, firstPage - (length - (lastPage - firstPage)));
      }
    }

    if (lastPage - firstPage + 1 > length) {
      if (currentPage > totalPages / 2) {
        firstPage++;
      } else {
        lastPage--;
      }
    }

    let firstResult = per_page * (currentPage - 1);
    if (firstResult < 0) {
      firstResult = 0;
    }

    let lastResult = per_page * currentPage - 1;
    if (lastResult < 0) {
      lastResult = 0;
    }
    if (lastResult > Math.max(totalResults - 1, 0)) {
      lastResult = Math.max(totalResults - 1, 0);
    }

    return {
      totalPages,
      pages: Math.min(lastPage - firstPage + 1, totalPages),
      currentPage,
      firstPage,
      lastPage,
      previousPage: currentPage - 1,
      nextPage: currentPage + 1,
      hasPreviousPage: currentPage > 1,
      hasNextPage: currentPage < totalPages,
      totalResults,
      results: Math.min(lastResult - firstResult + 1, totalResults),
      firstResult,
      lastResult,
    };
  };
}
