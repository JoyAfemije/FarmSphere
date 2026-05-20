import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function Pagination({ page, pages, onPageChange }) {
  if (pages <= 1) return null;

  const pageNumbers = [];
  const delta = 2;
  const left = Math.max(2, page - delta);
  const right = Math.min(pages - 1, page + delta);

  pageNumbers.push(1);
  if (left > 2) pageNumbers.push("...");
  for (let i = left; i <= right; i++) pageNumbers.push(i);
  if (right < pages - 1) pageNumbers.push("...");
  if (pages > 1) pageNumbers.push(pages);

  return (
    <nav className="flex items-center justify-center gap-1 mt-10" aria-label="Pagination">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Previous page"
      >
        <FiChevronLeft size={17} />
      </button>

      {pageNumbers.map((num, i) =>
        num === "..." ? (
          <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">
            …
          </span>
        ) : (
          <button
            key={num}
            onClick={() => onPageChange(num)}
            className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition-colors
              ${page === num
                ? "bg-primary-600 text-white shadow-green"
                : "border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            aria-current={page === num ? "page" : undefined}
          >
            {num}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === pages}
        className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Next page"
      >
        <FiChevronRight size={17} />
      </button>
    </nav>
  );
}
