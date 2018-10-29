export const getPageState = (totalItems, currentPage, pageSize) => {
  currentPage = currentPage || 1
  pageSize = pageSize || 10
  const totalPages = Math.ceil(totalItems / pageSize)
  let start
  let end

  if (totalPages <= 5) {
    start = 1
    end = totalPages
  } else {
    if (currentPage <= 3) {
      start = 1
      end = 5
    } else if (currentPage + 2 >= totalPages) {
      start = totalPages - 4
      end = totalPages
    } else {
      start = currentPage - 2
      end = currentPage + 2
    }
  }

  const startIndex = (currentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1)
  const pages = Array(end - start + 1)
    .fill()
    .map((_, id) => start + id)

  return {
    totalItems,
    currentPage,
    pageSize,
    totalPages,
    startPage: start,
    endPage: end,
    startIndex,
    endIndex,
    pages,
  }
}

interface BackendPageState {
  startPage: number
  endPage: number
  currentPage: number
  totalPages: number
}

export function getBackendPageState(
  totalPages: number,
  currentPage: number,
): BackendPageState {
  let start = currentPage - 3
  let end = currentPage + 4

  if (start < 0) {
    end += -start
  }

  if (end > totalPages) {
    start -= end - totalPages
  }

  start = Math.max(start, 0)
  end = Math.min(end, totalPages)

  return {
    currentPage,
    totalPages,
    startPage: start,
    endPage: end,
  }
}
