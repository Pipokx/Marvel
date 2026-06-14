const Pagination = ({ currentPage, totalPages, onPageChange, disabled }) => {
  if (totalPages <= 1) return null;

  return (
    <>
      <button 
        disabled={disabled || currentPage <= 1} 
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </button>
      <span>Page {currentPage} of {totalPages}</span>
      <button 
        disabled={disabled || currentPage >= totalPages} 
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>
    </>
  );
};

export default Pagination;
