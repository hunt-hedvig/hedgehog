export const getPageState = (totalItems, currentPage, pageSize) => {
    currentPage = currentPage || 1;
    pageSize = pageSize || 10;
    const totalPages = Math.ceil(totalItems / pageSize);
    let start, end;

    if (totalPages <= 5) {
        start = 1;
        end = totalPages;
    } else {
        if (currentPage <= 3) {
            start = 1;
            end = 5;
        } else if (currentPage + 2 >= totalPages) {
            start = totalPages - 4;
            end = totalPages;
        } else {
            start = currentPage - 2;
            end = currentPage + 2;
        }
    }

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
    const pages = Array(end - start + 1)
        .fill()
        .map((_, id) => start + id);

    return {
        totalItems,
        currentPage,
        pageSize,
        totalPages,
        startPage: start,
        endPage: end,
        startIndex,
        endIndex,
        pages
    };
};
