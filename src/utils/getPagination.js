export default function getPagination(currentPage, totalPages, siblingCount = 1) {

  const pages = [];

  const left = Math.max(currentPage - siblingCount, 1);
  const right = Math.min(currentPage + siblingCount, totalPages);

  if (left > 1) {
    pages.push(1);
  }

  if (left > 2) {
    pages.push("...");
  }

  for (let i = left; i <= right; i++) {
    pages.push(i);
  }

  if (right < totalPages - 1) {
    pages.push("...");
  }

  if (right < totalPages) {
    pages.push(totalPages);
  }

  return pages;
}
