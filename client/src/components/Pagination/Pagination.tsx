import Button from "../Button/Button";

interface PaginationProps {
  totalPages: number;
  setCurrentPage: (page: number) => void;
  currentPage: number;
}

const Pagination = ({
  totalPages,
  setCurrentPage,
  currentPage,
}: PaginationProps) => {
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      {/* Кнопки для перехода на предыдущую/следующую страницу */}
      <Button
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
      >
        Предыдущая
      </Button>
      <span>
        Страница {currentPage} из {totalPages}
      </span>
      <Button
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
      >
        Следующая
      </Button>
    </div>
  );
};

export default Pagination;
